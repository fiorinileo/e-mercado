
function showProductInfo(){
    // Se extrae el nombre de la categoria almacenado dentro del objeto del JSON dependiendo del ID que esta almacene, siendo variable para todas las categorias existentes.    Se emplea el mismo formato de "Products" para presentar su nombre.
    document.getElementById("title-product").innerHTML = `
        <h2>${product.name}</h2>
        `;
    // Reutilización del código ya creado en "Products", esto se debe a que la visualización que se solicita es idéntica, sustituyendo en este caso las distintas categorias, por los distintos productos pertenecientes a la categoría solicitada.
    let htmlContentToAppend = "";
                htmlContentToAppend += `
                <div class="row">
                    <div class="col-8" id="product-info-container">
                    </div>
                    <div class="col-4">
                        <div class="col mt-3">
                            <div class="d-flex w-100 justify-content-between">
                                <h4 class="mb-1 product-header">${product.name.toUpperCase()}</h4>
                                <small class="text-muted">${product.soldCount} vendidos</small>
                            </div>
                            <p class="mb-1">${product.description}</p>
                        </div>
                        <div class="row pe-2 pb-3">
                            <p class="product-price col">${product.currency} ${product.cost}</p>
                            <div class="col product-cta-btn pe-0">
                                <button>
                                    COMPRAR
                                    <svg class="mb-1" viewBox="0 0 576 512"><path d="M253.3 35.1c6.1-11.8 1.5-26.3-10.2-32.4s-26.3-1.5-32.4 10.2L117.6 192H32c-17.7 0-32 14.3-32 32s14.3 32 32 32L83.9 463.5C91 492 116.6 512 146 512H430c29.4 0 55-20 62.1-48.5L544 256c17.7 0 32-14.3 32-32s-14.3-32-32-32H458.4L365.3 12.9C359.2 1.2 344.7-3.4 332.9 2.7s-16.3 20.6-10.2 32.4L404.3 192H171.7L253.3 35.1zM192 304v96c0 8.8-7.2 16-16 16s-16-7.2-16-16V304c0-8.8 7.2-16 16-16s16 7.2 16 16zm96-16c8.8 0 16 7.2 16 16v96c0 8.8-7.2 16-16 16s-16-7.2-16-16V304c0-8.8 7.2-16 16-16zm128 16v96c0 8.8-7.2 16-16 16s-16-7.2-16-16V304c0-8.8 7.2-16 16-16s16 7.2 16 16z"/></svg>
                                </button>
                            </div>
                        </div>
                    </div>  
                </div>
                <div class="row" >
                    <ul class="row p-0" id="product-list-images">
                    </ul>
                </div>
                ` 
        document.getElementById("product-container").innerHTML = htmlContentToAppend;
        imagesProduct();
    
}

function showRelatedProducts(){
    const relatedProductList = document.getElementById("related-products");
    let htmlContentToAppend = "";
    for(let i = 0; i < product.relatedProducts.length; i++){
        let relatedProduct = product.relatedProducts[i];
                htmlContentToAppend += `
                <li class="cursor-active col-md-6 col-lg-4 p-4">
                <div class="row pb-4 pt-2 px-1 product-card" onclick="windowReplace(${relatedProduct.id})">
                    <div class="col-">
                        <div>
                            <img id="main-image-product" src="${relatedProduct.image}" class="img-thumbnail">
                        </div>
                    </div>
                    <div class="col mt-3">
                        <div class="d-flex w-100 justify-content-between flex-column">
                            <h4 class="mb-1 product-header">${relatedProduct.name.toUpperCase()}</h4>
                            <a class="btn-productRelated mt-4"> Ver más</a>
                        </div>
                    </div>
                    </div>
                </div>
            </li>
                ` 
        
        document.getElementById("related-products").innerHTML = htmlContentToAppend;
        setImage(0);
    }
}
function windowReplace(id){
    localStorage.setItem("productID", id);
    window.location = "product-info.html"
}
function setImage(index){
    document.getElementById("product-info-container").innerHTML = `
        <img src="${product.images[index]}">
        </img>
    `
    for (let i = 0; i < product.images.length; i++) {
        let image = product.images[i];
        image==product.images[index]? document.getElementById("img"+i).classList.add("selected-img") :
        document.getElementById("img"+i).classList.remove("selected-img");
    }
}






document.addEventListener("DOMContentLoaded", function(e){
    let id = localStorage.productID;
    if(id){
        getJSONData("https://japceibal.github.io/emercado-api/products/"+id+".json").then(function(resultObj){
        if (resultObj.status === "ok"){
            product = resultObj.data;
            showProductInfo();
            showRelatedProducts();
        }
    });
    }
    else{
        this.location.replace("../categories.html");
    }

});

function imagesProduct(){
    let htmlContentToAppend = "";
    for(let i = 0; i < product.images.length; i++){
        let image = product.images[i];
                htmlContentToAppend += `
                <li class="cursor-active col-2 d-flex">
                        <div class="col-">
                                <img src="${image}" class="img-thumbnail" onclick="setImage(${i})" id="img${i}">
                        </div>
                </li>
                ` 
        
        document.getElementById("product-list-images").innerHTML = htmlContentToAppend;
    }
}
