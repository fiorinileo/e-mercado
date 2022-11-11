import { firebaseGetImage, getProductInfo, getProductsOfCategory, saveCategorieCount, saveProductInfo, uploadFile } from "./config/firebase.js";
import { showMessage } from "./config/showMessage.js";
import { hideSpinner, showSpinner } from "./init.js";

let productCost = 0;
let productCount = 0;
let comissionPercentage = 0.13;
let MONEY_SYMBOL = "$";
let DOLLAR_CURRENCY = "Dólares (USD)";
let PESO_CURRENCY = "Pesos Uruguayos (UYU)";
let DOLLAR_SYMBOL = "USD ";
let PESO_SYMBOL = "UYU ";
let PERCENTAGE_SYMBOL = '%';
let MSG = "FUNCIONALIDAD NO IMPLEMENTADA";

//Función que se utiliza para actualizar los costos de publicación
function updateTotalCosts(){
    let unitProductCostHTML = document.getElementById("productCostText");
    let comissionCostHTML = document.getElementById("comissionText");
    let totalCostHTML = document.getElementById("totalCostText");

    let unitCostToShow = MONEY_SYMBOL + productCost;
    let comissionToShow = Math.round((comissionPercentage * 100)) + PERCENTAGE_SYMBOL;
    let totalCostToShow = MONEY_SYMBOL + ((Math.round(productCost * comissionPercentage * 100) / 100) + parseInt(productCost));

    unitProductCostHTML.innerHTML = unitCostToShow;
    comissionCostHTML.innerHTML = comissionToShow;
    totalCostHTML.innerHTML = totalCostToShow;
}
//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
document.addEventListener("DOMContentLoaded", function(e){
    setRelatedProducts(102)
    document.getElementById("productCountInput").addEventListener("change", function(){
        productCount = this.value;
        updateTotalCosts();
    });

    document.getElementById("productCostInput").addEventListener("change", function(){
        productCost = this.value;
        updateTotalCosts();
    });

    document.getElementById("goldradio").addEventListener("change", function(){
        comissionPercentage = 0.13;
        updateTotalCosts();
    });
    
    document.getElementById("premiumradio").addEventListener("change", function(){
        comissionPercentage = 0.07;
        updateTotalCosts();
    });

    document.getElementById("standardradio").addEventListener("change", function(){
        comissionPercentage = 0.03;
        updateTotalCosts();
    });

    document.getElementById("productCurrency").addEventListener("change", function(){
        if (this.value == DOLLAR_CURRENCY)
        {
            MONEY_SYMBOL = DOLLAR_SYMBOL;
        } 
        else if (this.value == PESO_CURRENCY)
        {
            MONEY_SYMBOL = PESO_SYMBOL;
        }

        updateTotalCosts();
    });


    //Configuraciones para el elemento que sube archivos
    let dzoptions = {
        url:"/",
        autoQueue: false
    };
    let myDropzone = new Dropzone("div#file-upload", dzoptions);    


    //Se obtiene el formulario de publicación de producto
    let sellForm = document.getElementById("sell-form");
    //Se agrega una escucha en el evento 'submit' que será
    //lanzado por el formulario cuando se seleccione 'Vender'.
    sellForm.addEventListener("submit",async function(e){
        showSpinner()
        e.preventDefault(); 
        e.preventDefault();
        
        let userName = JSON.parse(localStorage.getItem("credentials"))
            userName = userName.userName +" "+ userName.userLastname;
        let productNameInput = document.getElementById("productName");
        let productCategory = document.getElementById("productCategory");
        let productStatus = document.getElementById("productStatus");
        let productCost = document.getElementById("productCostInput");
        let productDescription = document.getElementById("productDescription");
        let productCurrency = document.getElementById("productCurrency");
        let productCountInput = document.getElementById("productCountInput");
        let infoMissing = false;
        let selectedCategory = "10"+[productCategory.selectedIndex]; // calculamos el id de la categoria del producto
        let Category = await getProductsOfCategory(selectedCategory) // traemos la categoría donde le usuario desea agregar su producto
        let productId = String(selectedCategory)+(Object.keys(Category).length+1); // Seteamos nuevo id para el producto a agregar
        //Quito las clases que marcan como inválidos
        productNameInput.classList.remove('is-invalid');
        productCategory.classList.remove('is-invalid');
        productCost.classList.remove('is-invalid');

        //Se realizan los controles necesarios,
        //En este caso se controla que se haya ingresado el nombre y categoría.
        //Consulto por el nombre del producto
        if (productNameInput.value === "")
        {
            productNameInput.classList.add('is-invalid');
            infoMissing = true;
        }
        
        //Consulto por la categoría del producto
        if (productCategory.value === "")
        {
            productCategory.classList.add('is-invalid');
            infoMissing = true;
        }
        // Consulto por el estado del producto
        if (productStatus.value === "")
        {
            productStatus.classList.add('is-invalid');
            infoMissing = true;
        }
        //Consulto por el costo
        if (productCost.value <=0)
        {
            productCost.classList.add('is-invalid');
            infoMissing = true;
        }
        if (myDropzone.files.length<3) {
            infoMissing = true;
            showMessage("Cantidad de imágenes insuficientes, debes subir al menos 4 imágenes diferentes",false,"top","center")
        }
        if(!infoMissing)
        {
                let relatedProducts = await setRelatedProducts(selectedCategory); // obtenemos productos relacionados

               let imagesProduct=[];
                for (let i = 0; i < myDropzone.files.length; i++) { // recorremos el array de imagenes del producto
                    let file = myDropzone.files[i]; // separamos la imagen a trabajar
                    let NewFile = Object.assign({},file)
                    NewFile.name="prod"+productId+"_"+(i+1)+".jpg" // le asignamos el nombre específico a esa imagen
                    await uploadFile(NewFile,NewFile.name); // subimos esa imagen a firebase
                    imagesProduct[i] = await firebaseGetImage(NewFile.name);
                }
                let catProducts = {};
                catProducts[productId] ={
                    catId:selectedCategory,
                    id:productId,
                    name:productNameInput.value,
                    description:productDescription.value,
                    cost:productCost.value,
                    currency:productCurrency.value,
                    stock:productCountInput.value,
                    images:imagesProduct,
                    soldCount:0,
                    relatedProducts:relatedProducts,
                    status:productStatus.value,
                    seller:userName,
                  }
                await saveCategorieCount(selectedCategory)
                await saveProductInfo(selectedCategory,catProducts)
                hideSpinner();
                showMessage("Su producto se ha publicado con exito!",true,"top","center");
                setTimeout(() => {
                    location.reload()
                }, 2000);
            //Aquí ingresa si pasó los controles, irá a enviar
            //la solicitud para crear la publicación.
           /*  getJSONData(PUBLISH_PRODUCT_URL).then(function(resultObj){

                let msgToShowHTML = document.getElementById("resultSpan");
                let msgToShow = "";
    
                //Si la publicación fue exitosa, devolverá mensaje de éxito,
                //de lo contrario, devolverá mensaje de error.
                //FUNCIONALIDAD NO IMPLEMENTADA
                if (resultObj.status === 'ok')
                {
                    msgToShow = MSG;
                    document.getElementById("alertResult").classList.add('alert-primary');
                }
                else if (resultObj.status === 'error')
                {
                    msgToShow = MSG;
                    document.getElementById("alertResult").classList.add('alert-primary');
                }
    
                msgToShowHTML.innerHTML = msgToShow;
                document.getElementById("alertResult").classList.add("show");
            }); */
            
        }
        else{
            hideSpinner()
        }
    });
});
function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }
async function setRelatedProducts(catId){ // Función que retorna un arrays de dos objetos con productos relacionados en base a una categoría
    let products = await getProductsOfCategory(catId); // traemos todos los productos de la categoría
    let relatedProducts = [] // Arrays que almacenará los productos relacionados que genere esta función
    const RelatedCategories = {
        /*  ESTRUCTURA Y CRITERIO
        CatId principal : {
            CatId relacionada : (porcentaje de categoría relacionada - rango : 1-100),
            Otra CatId relacionada : (otro porcentaje de categoría relacionada - rango : 1-100),

            // Entre todos los elementos, la suma de sus porcentajes siempre dará 100
            // El porcentaje representaría que tan similar es esa categoría a la principal
            // Las categoría no pueden NO tener categorías relacionadas, si la categoría no tiene similitud con ninguna, se relacionará con ella misma en un 100% 
        }, 
        */
        101:{
            101:100, // Autos sólo lo relacionamos con él mismo
        }, 
        102:{ // A "Juguetes" relacionamos con "Computadora" y "Celulares"
            105:60,
            109:40 ,
        },   
        103:{ // A "Muebles" relacionamos con "Herramientas" y "Electrodomésticos"
            104:30,
            107:70,
        }, 
        104:{ // A "Herramientas" relacionamos con "Muebles" y "Electrodomésticos"
            103:50,
            107:50, 
        }, 
        105:{ // A "Computadora" relacionamos con "Celulares" y "Electrodomésticos"
            109:80,
            107:20,
        }, 
        106:{ // A "Vestimenta" relacionamos con "Muebles" y "Deporte"
            103:20,
            108:80,
        }, 
        107:{ // A "Electrodomésticos" relacionamos con "Herramientas" y "Muebles"
            104:30,
            103:70,
        }, 
        108:{  // A "Deporte" relacionamos con "Vestimenta"
            106: 100,
        },
        109:{  // A "Celulares" relacionamos con "Computadora" y "Juguetes"
            105:70,
            102:30,
        },
    }
    const obtainRandProdOfCategory = async (catId,isOtherCategory=false) =>{ //obtiene un producto random de la categoría a la que pertenece
        let randProducts = products;
        if (isOtherCategory) {
            randProducts = await getProductsOfCategory(catId); // En el caso que sea una categoría relacionada, traemos sus productos
            
        }
        let randIndex = getRandomInt(Object.keys(randProducts).length) // Obtenemos un producto random de la cateogría, el número máximo que le pasamos como parámetro es el largo del objeto.
       
        if (randIndex>=0) { //comprobamos que la categoŕia tenga productos
            let randProduct = randProducts[String(catId)+(randIndex+1)]
            /* Componemos el id del producto, gracias a los tres primeros dígitos de la categoría, cancatenándole el índice random resultante: 
            //EJ:   
                    Jugetes tiene ID 102;
                    products[String(catId)+(randIndex+1)]   
                    products[String(102)+(2+1)]  = products[1023] = el arículo Playstation 5 tiene ID 1023*/
            
            if (relatedProducts.length-1<0 || randProduct.id !=  relatedProducts[relatedProducts.length-1].id) { //En el caso de que el array de productos relacionados esté vacío, o que el producto random nuevo sea diferente al anterior, se almacena el nuevo.
                relatedProducts[relatedProducts.length] = { // establecemos el índice según el largo del array
                    catId:catId,
                    //entramos al artículo y extraemos sus atributos
                    id: randProduct.id, 
                    image:randProduct.images[0],
                    name:randProduct.name,
                }
            }
            else{ //En el caso de que se repita el id: Ejecutamos =>
                obtainRandProdOfCategory(catId,true); //Ejecutamos la misma función hasta que se agregue uno diferente (Problema de eficiencia)
            }
        }
        else{
            obtainRandProdOfRelatedCategory(catId)
            obtainRandProdOfRelatedCategory(catId)
        }
    }
    const obtainRandProdOfRelatedCategory = async (catId) =>{ // Obtiene productos random, de una categoría relacionada, ya con sus porcentajes de probabilidad
        let numRand = getRandomInt(100)
        if(numRand<=Object.values(RelatedCategories[catId])[0]){ //Si el número random del 1 al 100 es menor o igual al procentaje almacenado en la primer categoría relacionada se ejecuta =>
            await obtainRandProdOfCategory(Object.keys(RelatedCategories[catId])[0],true) // Se busca producto random en la primer categoría relacionada
        }
        else{
            await obtainRandProdOfCategory(Object.keys(RelatedCategories[catId])[1],true)
        }
    }

    if ((Object.keys(products).length)>0) { // En el caso de que la categoría principal tenga al menos un producto 
        if (Object.keys(products).length>1) { // En el caso que la categoría principal tenga más de 1 producto, trabajamos con esa categoría
            await  obtainRandProdOfCategory(catId);
            await   obtainRandProdOfCategory(catId);
        }
        else{ // Pero si sólo tiene un producto, lo agregamos y luego agregamos otro de una categoría relacionada
            await  obtainRandProdOfCategory(catId);
            await  obtainRandProdOfRelatedCategory(catId)
        }
    }
    else{ //En caso de que la categoría NO posea productos, haremos el siguiente procedimiento
        await  obtainRandProdOfRelatedCategory(catId)
        await  obtainRandProdOfRelatedCategory(catId)
    }
    return relatedProducts;
}
