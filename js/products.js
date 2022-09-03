





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

document.getElementById("sortBySold").addEventListener("click", function(){
    sortAndShowProducts(ORDER_BY_SOLD_COUNT);
});

document.getElementById("clearRangeFilter").addEventListener("click", function(){
    document.getElementById("rangeFilterPriceMin").value = "";
    document.getElementById("rangeFilterPriceMax").value = "";

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
                                <svg class="mb-1" viewBox="0 0 576 512"><path d="M253.3 35.1c6.1-11.8 1.5-26.3-10.2-32.4s-26.3-1.5-32.4 10.2L117.6 192H32c-17.7 0-32 14.3-32 32s14.3 32 32 32L83.9 463.5C91 492 116.6 512 146 512H430c29.4 0 55-20 62.1-48.5L544 256c17.7 0 32-14.3 32-32s-14.3-32-32-32H458.4L365.3 12.9C359.2 1.2 344.7-3.4 332.9 2.7s-16.3 20.6-10.2 32.4L404.3 192H171.7L253.3 35.1zM192 304v96c0 8.8-7.2 16-16 16s-16-7.2-16-16V304c0-8.8 7.2-16 16-16s16 7.2 16 16zm96-16c8.8 0 16 7.2 16 16v96c0 8.8-7.2 16-16 16s-16-7.2-16-16V304c0-8.8 7.2-16 16-16zm128 16v96c0 8.8-7.2 16-16 16s-16-7.2-16-16V304c0-8.8 7.2-16 16-16s16 7.2 16 16z"/></svg>
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




const ORDER_ASC_BY_PRICE = null;
const ORDER_DESC_BY_PRICE = undefined;
const ORDER_BY_SOLD_COUNT = "Cant.";
let currentSortCriteria = undefined;
let minPrice = undefined;
let maxPrice = undefined;

function sortProducts(criteria, array){
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