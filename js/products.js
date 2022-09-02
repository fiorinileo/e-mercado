





//  Los comentarios de todos los documentos están realizados con el
// AJUSTE DE PÁRRAFO QUE OFRECE VISUAL STUDIO CODE,
// se recomienda encarecidamente activar esta opción  
// ATAJO DE TECLADO OFRECIDO:  Alt + Z 


document.getElementById("sortAsc").addEventListener("click", function(){
    sortAndShowProducts(ORDER_ASC_BY_NAME);
});

document.getElementById("sortDesc").addEventListener("click", function(){
    sortAndShowProducts(ORDER_DESC_BY_NAME);
});

document.getElementById("sortBySold").addEventListener("click", function(){
    sortAndShowProducts(ORDER_BY_SOLD_COUNT);
});

document.getElementById("clearRangeFilter").addEventListener("click", function(){
    document.getElementById("rangeFilterPriceMin").value = "";
    document.getElementById("rangeFilterPriceMax").value = "";

    minCount = undefined;
    maxCount = undefined;

    showProductsList();
});



// Se crea listado para guardar el JSON de una categoria de productos brindado por el servidor.
let currentProductsArray = [];
let categoryName = null;

function showProductsList(){
    // Se extrae el nombre de la categoria almacenado dentro del objeto del JSON dependiendo del ID que esta almacene, siendo variable para todas las categorias existentes.    Se emplea el mismo formato de "Products" para presentar su nombre.
    document.getElementById("title-product").innerHTML = `
        <h2>Productos</h2>
        <p class="lead" >Verás aquí todos los artículos de la categoría ${categoryName}</p>
        `;
    // Reutilización del código ya creado en "Products", esto se debe a que la visualización que se solicita es idéntica, sustituyendo en este caso las distintas categorias, por los distintos productos pertenecientes a la categoría solicitada.
    let htmlContentToAppend = "";
    for(let i = 0; i < currentProductsArray.length; i++){
        let product = currentProductsArray[i];
        if (((minCount == undefined) || (minCount != undefined && parseInt(product.cost) >= minCount)) &&
            ((maxCount == undefined) || (maxCount != undefined && parseInt(product.cost) <= maxCount))){
                htmlContentToAppend += `
                <li class="cursor-active col-md-6 col-lg-4 p-4">
                    <div class="row pb-4 pt-2 px-1 product-card">
                        <div class="col-">
                            <div>
                                <img src="${product.image}" class="img-thumbnail">
                            </div>
                            
                        </div>
                        <div class="col mt-3">
                            <div class="d-flex w-100 justify-content-between">
                                <h4 class="mb-1 product-header">${product.name.toUpperCase()}</h4>
                                <small class="text-muted">${product.soldCount} vendidos</small>
                            </div>
                            <p class="mb-1">${product.description}</p>
                        </div>
                        <div class="row pe-0">
                         <p class="product-price col">${product.currency} ${product.cost}</p>
                         <div class="col product-cta-btn pe-0">
                            <button>
                                COMPRAR
                            </button>
                         </div>
                        </div>
                    </div>
                </li>
                ` 
        }
        document.getElementById("cat-list-container").innerHTML = htmlContentToAppend;
    }
}




const ORDER_ASC_BY_NAME = "AZ";
const ORDER_DESC_BY_NAME = "ZA";
const ORDER_BY_SOLD_COUNT = "Cant.";
let currentSortCriteria = undefined;
let minCount = undefined;
let maxCount = undefined;

function sortProducts(criteria, array){
    let result = [];
    if (criteria === ORDER_ASC_BY_NAME)
    {
        result = array.sort(function(a, b) {
            if ( a.name < b.name ){ return -1; }
            if ( a.name > b.name ){ return 1; }
            return 0;
        });
    }else if (criteria === ORDER_DESC_BY_NAME){
        result = array.sort(function(a, b) {
            if ( a.name > b.name ){ return -1; }
            if ( a.name < b.name ){ return 1; }
            return 0;
        });
    }else if (criteria === ORDER_BY_SOLD_COUNT){
        result = array.sort(function(a, b) {
            let aCount = parseInt(a.soldCount);
            let bCount = parseInt(b.soldCount);

            if ( aCount > bCount ){ return -1; }
            if ( aCount < bCount ){ return 1; }
            return 0;
        });
    }

    return result;
}
function sortAndShowProducts(sortCriteria, ProductsArray){
    currentSortCriteria = sortCriteria;

    if(ProductsArray != undefined){
        currentProductsArray = ProductsArray;
    }

    currentProductsArray = sortProducts(currentSortCriteria, currentProductsArray);

    //Muestro las categorías ordenadas
    showProductsList();
}



   
function sortFunction(){
    //Obtengo el mínimo y máximo de los intervalos para filtrar por cantidad
    //de productos por categoría.
    minCount = document.getElementById("rangeFilterCountMin").value;
    maxCount = document.getElementById("rangeFilterCountMax").value;

    if ((minCount != undefined) && (minCount != "") && (parseInt(minCount)) >= 0){
        minCount = parseInt(minCount);
    }
    else{
        minCount = undefined;
    }

    if ((maxCount != undefined) && (maxCount != "") && (parseInt(maxCount)) >= 0){
        maxCount = parseInt(maxCount);
    }
    else{
        maxCount = undefined;
    }

    showProductsList();
}



////

//Función que se ejecuta una vez que se haya lanzado el evento de que el documento se encuentra cargado, es decir, se encuentran todos los elementos HTML presentes.
document.addEventListener("DOMContentLoaded", function(e){
    let id = localStorage.catID;
    if(id){
        getJSONData("https://japceibal.github.io/emercado-api/cats_products/"+id+".json").then(function(resultObj){
        if (resultObj.status === "ok"){
            currentProductsArray = resultObj.data;
            categoryName = currentProductsArray.catName;
            currentProductsArray = currentProductsArray.products;
            showProductsList()
            //sortAndShowProducts(ORDER_ASC_BY_NAME, resultObj.data);
        }
    });
    }
    else{
        this.location.replace("../categories.html");
    }

});


function searchFunction() {
    // Declare variables
    var input, filter, ul, li, p, txtValueP, txtValueH4, h4;
    input = document.getElementById('search-input');
    filter = input.value.toUpperCase();
    ul = document.getElementById("cat-list-container");
    li = Object.values(ul.getElementsByTagName('li'));
  
    // Loop through all list items, and hide those who don't match the search query
    li.forEach(i => {
        // extraemos contenido de las descripciones
      p = i.getElementsByTagName("p")[0];
      txtValueP = p.textContent || p.innerText;
        // extraemos contenido de los títulos
      h4 = i.getElementsByTagName("h4")[0];
      txtValueH4 = h4.textContent || h4.innerText;

      if (txtValueP.toUpperCase().indexOf(filter) > -1 || txtValueH4.toUpperCase().indexOf(filter) > -1) {
        i.style.display = "";
      } else {
        i.style.display = "none";
      }
    });
  }