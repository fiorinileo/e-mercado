import {getJSONData} from "./init.js"
import {CATEGORIES_URL} from "./init.js"
//  Los comentarios de todos los documentos están realizados con el
// AJUSTE DE PÁRRAFO QUE OFRECE VISUAL STUDIO CODE,
// se recomienda encarecidamente activar esta opción  
// ATAJO DE TECLADO OFRECIDO:  Alt + Z 
document.getElementById("sortAsc").addEventListener("click", function(){
    sortAndShowProducts(ORDER_ASC_BY_PRICE);
});
document.getElementById("sortDesc").addEventListener("click", function(){
    sortAndShowProducts(ORDER_DESC_BY_PRICE);
});
if (document.getElementById("sortBySold")) {
    document.getElementById("sortBySold").addEventListener("click", function(){
        sortAndShowProducts(ORDER_BY_SOLD_COUNT);
    });
}

document.getElementById("clearRangeFilter").addEventListener("click", function(){
    document.getElementById("rangeFilterPriceMin").value = "";
    document.getElementById("rangeFilterPriceMax").value = "";
    document.getElementById('search-input').value="";
    minPrice = undefined;
    maxPrice = undefined;

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
        if (((minPrice == undefined) || (minPrice != undefined && parseInt(product.cost) >= minPrice)) &&
            ((maxPrice == undefined) || (maxPrice != undefined && parseInt(product.cost) <= maxPrice))){
                htmlContentToAppend += `
                <li class="cursor-active col-md-6 col-lg-4 p-4">
                    <div class="row pb-4 pt-2 px-1 product-card" onclick="windowReplace(${product.id})">
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
                                Ver producto
                                
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
const ORDER_ASC_BY_PRICE = "0-1";
const ORDER_DESC_BY_PRICE = "1-0";
const ORDER_BY_SOLD_COUNT = "Cant.";
let currentSortCriteria = undefined;
let minPrice = undefined;
let maxPrice = undefined;
export function sortProducts(criteria, array){
    let result = [];
    if (criteria === ORDER_DESC_BY_PRICE)
    {
        result = array.sort(function(a, b) {
            if ( a.cost < b.cost ){ return -1; }
            if ( a.cost > b.cost ){ return 1; }
            return 0;
        });
    }else if (criteria === ORDER_ASC_BY_PRICE){
        result = array.sort(function(a, b) {
            if ( a.cost > b.cost ){ return -1; }
            if ( a.cost < b.cost ){ return 1; }
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
export function sortAndShowProducts(sortCriteria, ProductsArray){
    currentSortCriteria = sortCriteria;

    if(ProductsArray != undefined){
        currentProductsArray = ProductsArray;
    }

    currentProductsArray = sortProducts(currentSortCriteria, currentProductsArray);

    //Muestro las categorías ordenadas
    showProductsList();
} 
export function sortFunction(){
    //Obtengo el mínimo y máximo de los intervalos para filtrar por cantidad
    //de productos por categoría.
    minPrice = document.getElementById("rangeFilterPriceMin").value;
    maxPrice = document.getElementById("rangeFilterPriceMax").value;

    if ((minPrice != undefined) && (minPrice != "") && (parseInt(minPrice)) >= 0){
        minPrice = parseInt(minPrice);
    }
    else{
        minPrice = undefined;
    }

    if ((maxPrice != undefined) && (maxPrice != "") && (parseInt(maxPrice)) >= 0){
        maxPrice = parseInt(maxPrice);
    }
    else{
        maxPrice = undefined;
    }

    showProductsList();
}
export function searchFunction() {
    // Declararamos variables
    var input, filter, ul, li, p, txtValueP, txtValueH4, h4;
    input = document.getElementById('search-input');
    filter = input.value.toUpperCase();
    ul = document.getElementById("cat-list-container");
    li = Object.values(ul.getElementsByTagName('li'));
  
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
export function windowReplace(id){
        localStorage.setItem("productID", id);
        window.location = "product-info.html"
}
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
            
        }
    });
    }
    else{
        this.location.replace("../categories.html");
    }

});

window.windowReplace=windowReplace;
window.searchFunction = searchFunction;
window.sortFunction=sortFunction;