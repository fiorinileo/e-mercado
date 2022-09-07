
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
                        <small class="text-muted">Nuevo | ${product.soldCount} vendidos </small>
                            <div class="d-flex w-100 justify-content-between">
                                <h4 class="mb-1 product-header">${product.name.toUpperCase()}</h4>
                            </div>
                            <p id="generalScore">Calificación promedio: 
                                <span class="fa "></span>
                                <span class="fa "></span>
                                <span class="fa "></span>
                                <span class="fa "></span>
                                <span class="fa "></span>
                            </p>
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

function drawComment(id,user,dateTime,description) {
    document.getElementById("commentList").innerHTML += `
    <li id="idComment_`+id+`" class="row comment-content">
        <div>
        <h4>`+user+`</h4>
        <p>`+dateTime+`</p>
        </div>
        <div id="Score-container">
            <span class="fa"></span>
            <span class="fa"></span>
            <span class="fa"></span>
            <span class="fa"></span>
            <span class="fa"></span>
        </div>
        <p>`+description+`</p>
        <div>
        </div>
    </li>`;
}

function products_comments(){
    for (let i = 0; i < productComments.length; i++) {
        let commentInfo = productComments[i];
       drawComment(i,commentInfo.user,commentInfo.dateTime,commentInfo.description);
    }
    let totalScore=0;

    for (let i = 0; i < productComments.length; i++) {

        let liScoreID=document.getElementById("idComment_"+i); // seleccionamos el <li>(comentario) para poder trabajar dentro de él
        let spanScore=liScoreID.getElementsByTagName("span"); // seleccionamos el array de <span> para ubicar cada una de las estrellas
        totalScore +=  parseInt(productComments[i].score); // almacenamos el total de las estrellas por comentario, y las sumamos todas para obtener el total, de esta forma tener el promedio
        drawScore(spanScore,productComments[i].score) // utilizamos la función DrawScore, y le pasamos como parámetro, el array de estrellas, y la cantidad.
    }

    totalScore= totalScore/ productComments.length;
    let generalScore = document.getElementById("generalScore");
    let spanGeneralScore = generalScore.getElementsByTagName("span");
    drawScore(spanGeneralScore,totalScore);
}
function dualDigits(num){
    if (parseInt(num)<10) {
       return num= "0"+num;
    }
    else{
        return num;
    }
}
document.getElementById("sendComment").addEventListener("click",e =>{

    let comment=document.getElementById("commentDescription").value;
    let commentScore=document.getElementById("selectedScore").value;
    let user=localStorage.getItem("userName");
    const date = new Date();
    let commentDate = 
                            date.getFullYear()+"-"+
                            dualDigits(date.getMonth())+"-"+
                            dualDigits(date.getDate())+" "+
                            dualDigits(date.getHours())+":"+
                            dualDigits(date.getMinutes())+":"+
                            dualDigits(date.getSeconds());
    let arrayComments= document.getElementById("commentList");
    arrayComments = arrayComments.getElementsByTagName("li");

    drawComment(arrayComments.length,user,commentDate,comment);

    let arraySpan = arrayComments[arrayComments.length-1].getElementsByTagName("span");
    drawScore(arraySpan,commentScore);

});

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
function setImage(imgIndex){
    //agregamos como imagen principal, la imagen con el índice seleccionado previamente (pasado por parámetro)
    document.getElementById("product-info-container").innerHTML = `
        <img src="${product.images[imgIndex]}">
        </img>
    `
    // recorremos todas las imágenes secundarias, le agregamos un box-shadow a la imágen que se muestra en grande, y a las demás se lo quitamos
    // para así de esta forma, el usuario puede identificar cuál está visualizando.
    for (let i = 0; i < product.images.length; i++) {
        i==imgIndex ? 
        document.getElementById("img"+i).classList.add("selected-img") :
        document.getElementById("img"+i).classList.remove("selected-img");
    }
}
function drawScore(place,value){
    for (let j = 0; j < (value); j++) {
       place[j].classList.add("checked");
       place[j].classList.add("fa-star");
       if ((value-1)-j>0 && (value-1)-j<1 ) {
        place[j+1].classList.add("fa-star-half");
       }
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
    getJSONData("https://japceibal.github.io/emercado-api/products_comments/"+id+".json").then(function(resultObj){
        if (resultObj.status === "ok"){
            productComments = resultObj.data;
            products_comments();
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
function scorePrint() {
    for (let i = 0; i < productComments.length; i++) {
        const scoreNum = productComments.score[i];

        
    }
}
