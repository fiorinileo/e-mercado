import { firebaseGetImage, getProductsOfCategory, saveProductInfo, uploadFile } from "./config/firebase.js";
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
    document.getElementById("productCountInput").addEventListener("change", function(){
        productCount = this.value;
        console.log(myDropzone);
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
        
        
        let productNameInput = document.getElementById("productName");
        let productCategory = document.getElementById("productCategory");
        let productCost = document.getElementById("productCostInput");
        let productDescription = document.getElementById("productDescription");
        let productCurrency = document.getElementById("productCurrency");
        let productCountInput = document.getElementById("productCountInput");
        let infoMissing = false;
        let selectedCategory = "10"+[productCategory.selectedIndex]; // calculamos el id de la categoria del producto
        let Category = await getProductsOfCategory(selectedCategory) // traemos la categoría donde le usuario desea agregar su producto
        let productId = String(selectedCategory)+(Object.keys(Category).length+1); // Seteamos nuevo id para el producto a agregar
        console.log(productId);
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

        //Consulto por el costo
        if (productCost.value <=0)
        {
            productCost.classList.add('is-invalid');
            infoMissing = true;
        }
        if (myDropzone.files.length<3) {
            infoMissing = true;
        }
        console.log(infoMissing);
        if(!infoMissing)
        {
               let imagesProduct=[];
                for (let i = 0; i < myDropzone.files.length; i++) { // recorremos el array de imagenes del producto
                    let file = myDropzone.files[i]; // separamos la imagen a trabajar
                    console.log(file);
                    let NewFile = Object.assign({},file)
                    NewFile.name="prod"+productId+"_"+(i+1)+".jpg" // le asignamos el nombre específico a esa imagen
                    console.log(NewFile.name);
                    console.log(NewFile);
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
                    soldCount:productCountInput.value,
                    images:imagesProduct,
                    relatedProducts:[]
                  }
                  console.log(imagesProduct);
                  console.log(catProducts);
                  console.log(selectedCategory);
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
    });
});