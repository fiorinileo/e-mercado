import {  getCategoriesInfo } from "./config/firebase.js";
import {  hideSpinner, showSpinner } from "./init.js";

const ORDER_ASC_BY_NAME = "AZ";
const ORDER_DESC_BY_NAME = "ZA";
const ORDER_BY_PROD_COUNT = "Cant.";
let currentCategoriesArray = [];
let currentSortCriteria = undefined;
let minCount = undefined;
let maxCount = undefined;

function sortCategories(criteria, array){
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
    }else if (criteria === ORDER_BY_PROD_COUNT){
        result = array.sort(function(a, b) {
            let aCount = parseInt(Object.keys(a.products || 0).length);
            let bCount = parseInt(Object.keys(b.products || 0).length);

            if ( aCount > bCount ){ return -1; }
            if ( aCount < bCount ){ return 1; }
            return 0;
        });
    }

    return result;
}
function setCatID(id) { // Establece la categoría seleccionada por el usuario en el LS
    localStorage.setItem("catId", id);
    window.location = "products.html"
}
async function showCategoriesList(){ // Muestra todas las categorías existentes en pantalla
    showSpinner() // Mostramos Spinner de carga
    let htmlContentToAppend = ""; // creamos STRING que almacenara el formato HTML a implementar
    if(currentCategoriesArray.length >= 0){ // si el array tiene elementos
        for(let i = 0; i < currentCategoriesArray.length; i++){ // recorremos el array de categorias
            let category = currentCategoriesArray[i]; // separamos la categoría correspondiente
            if (((minCount == undefined) || (minCount != undefined && parseInt(category.productCount) >= minCount)) &&
                ((maxCount == undefined) || (maxCount != undefined && parseInt(category.productCount) <= maxCount))){ // Comparador de filtros proporcionado por la Letra
                    // Estructura HTML individual para presentar cada tarjeta de categoría
                htmlContentToAppend += ` 
                <li class="cursor-active col-md-6 col-lg-4 p-4" onclick="setCatID(${category.id})" >
                        <div class="row pb-0 pt-2 product-card">
                            <div class="col- text-center">
                                <div>
                                    <img src=${category.imgSrc} class="img-thumbnail" alt="${category.description}">
                                </div>
                                
                            </div>
                            <div class="col mt-3">
                                <div class="d-flex w-100 justify-content-between">
                                    <h4 class="mb-1 product-header px-2">${category.name.toUpperCase()}</h4>
                                </div>
                                <p class="mb-1">${category.description}</p>
                            </div>
                            <div class="row pe-0  m-0 mt-1 bg-light py-2">
                             <p class="product-price col  m-0 align-self-center">${category.productCount} Artículos</p>
                             <div class="col category-cta-btn px-2 align-self-center">
                                <button>
                                    Ver más
                                </button>
                             </div>
                            </div>
                        </div>
                    </li>
                `
            }
        }
    }
    else{ //En el caso de que no hayan categorías con las especificaciones que el usuario quiere, mostramos lo siguiente 
        htmlContentToAppend = ` <div>
            <p>
            No hay categorías que cumplan con estos requisitos</p>
        </div>`
    }
    document.getElementById("cat-list-container").innerHTML = htmlContentToAppend; // enviamos el STRING HTML al documento para imprimirlo
    hideSpinner() // ocultamos Spinner de carga
}
function sortAndShowCategories(sortCriteria, categoriesArray){ // Función de filtrado proporcionada por la Letra
    currentSortCriteria = sortCriteria;
    
    if(categoriesArray != undefined){
        currentCategoriesArray = categoriesArray;
    }
    
    currentCategoriesArray = sortCategories(currentSortCriteria, currentCategoriesArray);

    //Muestro las categorías ordenadas
    showCategoriesList();
}
const sortFunction=()=>{ // Función de filtrado proporcionada por la Letra
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

    showCategoriesList();
}
//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
document.addEventListener("DOMContentLoaded",async  function(e){

        let categoryArray = await getCategoriesInfo() // Obtenemos todas las categorías de la base de datos
        
        for(let i = 0; i < categoryArray.length; i++){ // recorremos el array crudo de categorías que nos devuelve Firebase para filtrarlo y formar uno entendible y manejable
            let category = categoryArray[i].data();     //obtenemos la información de esa categoría 
            currentCategoriesArray[i]=category; // 
        }
        showCategoriesList()

    document.getElementById("sortAsc").addEventListener("click", function(){
        sortAndShowCategories(ORDER_ASC_BY_NAME);
    });

    document.getElementById("sortDesc").addEventListener("click", function(){
        sortAndShowCategories(ORDER_DESC_BY_NAME);
    });

    document.getElementById("sortByCount").addEventListener("click", function(){
        sortAndShowCategories(ORDER_BY_PROD_COUNT);
    });

    document.getElementById("clearRangeFilter").addEventListener("click", function(){
        document.getElementById("rangeFilterCountMin").value = "";
        document.getElementById("rangeFilterCountMax").value = "";

        minCount = undefined;
        maxCount = undefined;

        showCategoriesList();
    });
});

window.sortFunction = sortFunction;
window.sortAndShowCategories = sortAndShowCategories;
window.setCatID = setCatID;