





//  Los comentarios de todos los documentos están realizados con el
// AJUSTE DE PÁRRAFO QUE OFRECE VISUAL STUDIO CODE,
// se recomienda encarecidamente activar esta opción  
// ATAJO DE TECLADO OFRECIDO:  Alt + Z 






// Se crea listado para guardar el JSON de una categoria de productos brindado por el servidor.
let currentProductsArray = [];

function showProductsList(){
    // Se extrae el nombre de la categoria almacenado dentro del objeto del JSON dependiendo del ID que esta almacene, siendo variable para todas las categorias existentes.    Se emplea el mismo formato de "Categories" para presentar su nombre.
    let categoryName = currentProductsArray.catName;
    document.getElementById("title-product").innerHTML = `
        <h2>Productos</h2>
        <p class="lead" >Verás aquí todos la categoría ${categoryName}</p>
        `;
    // Reutilización del código ya creado en "Categories", esto se debe a que la visualización que se solicita es idéntica, sustituyendo en este caso las distintas categorias, por los distintos productos pertenecientes a la categoría solicitada.
    let htmlContentToAppend = "";
    for(let i = 0; i < currentProductsArray.products.length; i++){
        let product = currentProductsArray.products[i];
        
            htmlContentToAppend += `
            <div class="list-group-item list-group-item-action cursor-active">
                <div class="row">
                    <div class="col-3">
                        <img src="${product.image}" class="img-thumbnail">
                    </div>
                    <div class="col">
                        <div class="d-flex w-100 justify-content-between">
                            <h4 class="mb-1">${product.name} - ${product.currency} ${product.cost}</h4>
                            <small class="text-muted">${product.soldCount} vendidos</small>
                        </div>
                        <p class="mb-1">${product.description}</p>
                    </div>
                </div>
            </div>
            ` 
        document.getElementById("cat-list-container").innerHTML = htmlContentToAppend;
    }
}


//Función que se ejecuta una vez que se haya lanzado el evento de que el documento se encuentra cargado, es decir, se encuentran todos los elementos HTML presentes.
document.addEventListener("DOMContentLoaded", function(e){
    let id = localStorage.catID;
    getJSONData("https://japceibal.github.io/emercado-api/cats_products/"+id+".json").then(function(resultObj){
        if (resultObj.status === "ok"){
            currentProductsArray = resultObj.data
            showProductsList()
            //sortAndShowProducts(ORDER_ASC_BY_NAME, resultObj.data);
        }
    });

});