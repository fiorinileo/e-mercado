import { getComments, saveCart,saveComment } from "./config/firebase.js"
import { loadCart } from "./config/loadCart.js";
import { loadFirebaseComments } from "./config/loadComments.js";
import { showMessage } from "./config/showMessage.js";
import {getJSONData, showProductInCart, windowReplace, drawCart } from "./init.js"

var date = new Date();
function drawScore(place, value) {
  document.getElementById("generalScore").innerHTML = `
                            Calificación: 
                                <span class="fa "></span>
                                <span class="fa "></span>
                                <span class="fa "></span>
                                <span class="fa "></span>
                                <span class="fa "></span>`;
  for (let j = 0; j < value; j++) {
    place[j].classList.add("checked");
    place[j].classList.add("fa-star");
    if (value - 1 - j > 0.24 && value - 1 - j < 0.76) {
      place[j + 1].classList.add("fa-star-half");
    }
  }
}
function imagesProduct(product) {
  let htmlContentToAppend = "";
  for (let i = 0; i < product.images.length; i++) {
    let image = product.images[i];
                if (i==0) {
                  htmlContentToAppend += `
                <li class="carousel-item active" data-bs-interval="2500">
                                <img src="${image}" class="img-thumbnail " onclick="setImage(${i})" id="img${i}">
                </li>
                `;
                } else {
                  htmlContentToAppend += `
                <li class="carousel-item" data-bs-interval="2500">
                                <img src="${image}" class="img-thumbnail " onclick="setImage(${i})" id="img${i}">
                </li>
                `;
                }
      document.getElementById("product-list-images").innerHTML=htmlContentToAppend;
  }
}
function showProductInfo(product) {
  // Reutilización del código ya creado en "Products", esto se debe a que la visualización que se solicita es idéntica, sustituyendo en este caso las distintas categorias, por los distintos productos pertenecientes a la categoría solicitada.
  let htmlContentToAppend = "";
  htmlContentToAppend += `
  
                      <div id="carouselExampleIndicators" class="carousel slide row col-7" data-bs-ride="carousel" >
                        <div class="carousel-indicators" >
                          <img src="${product.images[0]}" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="0" class="active" aria-current="true" aria-label="Slide 1"></img>
                          <img src="${product.images[1]}" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="1" aria-label="Slide 2"></img>
                          <img src="${product.images[2]}" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="2" aria-label="Slide 3"></img>
                          <img src="${product.images[3]}" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="3" aria-label="Slide 4"></img>
                        </div>
                        <ul class="carousel-inner" id="product-list-images">
                         
                        </ul>
                        <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="prev">
                          <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                          <span class="visually-hidden">Previous</span>
                        </button>
                        <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="next">
                          <span class="carousel-control-next-icon" aria-hidden="true"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 14" fill="#333"  ><path d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"/></svg></span>
                          <span class="visually-hidden">Next</span>
                        </button>
                    </div>

                <div class="row justify-content-center col-5">
                    
                    <div class="col-lg-12 p-5 product_info">
                        <div class="col mt-3">
                        <small class="text-muted">Nuevo | ${
                          product.soldCount
                        } vendidos </small>
                            <div class="d-flex w-100 justify-content-between">
                                <h4 class="mb-1 product-header">${product.name.toUpperCase()}</h4>
                            </div>
                            <p id="generalScore">
                            </p>
                            <h5>
                              Descripción: 
                            </h5>
                            <p class="mb-1">${product.description}</p>
                            
                        </div>
                        <div class="row pe-2 pb-3 ">
                            <div class="col-12 row ">
                                <p class="product-price col-12 mt-4">${product.currency} ${product.cost}</p>
                                <span id="inputCantidad" class="col-12">
                                <span> Cantidad: </span>
                                  <input class="col" type=number id="nudCant" min=1 max=100 value="1">                                
                                </span>
                            </div>
                            <div class="col-xl-3 col-lg-4 col-6 product-cta-btn px-0 mt-3 mx-auto">
                                <button id="buy_btn" class="hoverAnim-2">
                                COMPRAR
                                    <svg class="mb-1" viewBox="0 0 576 512"><path d="M253.3 35.1c6.1-11.8 1.5-26.3-10.2-32.4s-26.3-1.5-32.4 10.2L117.6 192H32c-17.7 0-32 14.3-32 32s14.3 32 32 32L83.9 463.5C91 492 116.6 512 146 512H430c29.4 0 55-20 62.1-48.5L544 256c17.7 0 32-14.3 32-32s-14.3-32-32-32H458.4L365.3 12.9C359.2 1.2 344.7-3.4 332.9 2.7s-16.3 20.6-10.2 32.4L404.3 192H171.7L253.3 35.1zM192 304v96c0 8.8-7.2 16-16 16s-16-7.2-16-16V304c0-8.8 7.2-16 16-16s16 7.2 16 16zm96-16c8.8 0 16 7.2 16 16v96c0 8.8-7.2 16-16 16s-16-7.2-16-16V304c0-8.8 7.2-16 16-16zm128 16v96c0 8.8-7.2 16-16 16s-16-7.2-16-16V304c0-8.8 7.2-16 16-16s16 7.2 16 16z"/></svg>
                                </button>
                            </div>
                        </div>
                    </div>  
                </div>
                
                `;
  document.getElementById("product-container").innerHTML = htmlContentToAppend;
  imagesProduct(product);
}
/*-----------------------------------------------------------------------------*/
export function drawComment(id, user, dateTime, description) {

  document.getElementById("commentList").innerHTML +=
    `
    <li id="idComment_` +
    id +
    `" class="row col-lg-5 hoverAnim-2 comment-content">
        <div>
        <h4>` +
    user +
    `</h4>
        <p>` +
    dateTime +
    `</p>
        </div>
        <div id="Score-container">
            <span class="fa"></span>
            <span class="fa"></span>
            <span class="fa"></span>
            <span class="fa"></span>
            <span class="fa"></span>
        </div>
        <p>` +
    description +
    `</p>
        <div>
        </div>
    </li>`;
}
function averageScore() {
  let totalScore = document
    .getElementById("commentList")
    .getElementsByClassName("checked").length;
  let totalComments = document
    .getElementById("commentList")
    .getElementsByTagName("li").length;
  let avgScore = totalScore / totalComments;
  let generalScore = document.getElementById("generalScore");
  let spanGeneralScore = generalScore.getElementsByTagName("span");
  drawScore(spanGeneralScore, avgScore);
}
function dualDigits(num) {
  return parseInt(num) < 10 ? (num = "0" + num) : num;
}
function showRelatedProducts(product) {
  const relatedProductList = document.getElementById("related-products");
  let htmlContentToAppend = "";
  for (let i = 0; i < product.relatedProducts.length; i++) {
    let relatedProduct = product.relatedProducts[i];
    htmlContentToAppend += `
                <li class="cursor-active col-12 col-md-6 col-lg-4 p-4">
                <div class="row pb-4 pt-2 px-1 product-card" onclick="windowReplace(${
                  relatedProduct.id
                })">
                    <div class="col-">
                        <div>
                            <img id="main-image-product" src="${
                              relatedProduct.image
                            }" class="img-thumbnail">
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
                `;

    document.getElementById("related-products").innerHTML = htmlContentToAppend;
  }
}

export function loadComments() {
  let comments = JSON.parse(localStorage.getItem("comments")); // obtenemos todos los comentarios realizados en el sitio  
  for (const idComment in comments) {
      const comment = comments[idComment];
      drawComment(
        idComment,
        comment.userName,
        comment.dateTime,
        comment.description
      );
      let span = document
        .getElementById("idComment_" + idComment)
        .getElementsByTagName("span");
      drawScore(span, comment.score);
  }
}
function printScoreselected(submitScore, index) {
  for (let i = index; i < submitScore.length; i++) {
    // este ForLoop recorre todas las estrellas del mismo o mayor indice para eliminarle la clase checked
    let elementNotChecked = submitScore[i];
    elementNotChecked.classList.remove("checked");
  }
  for (let i = index; i > -1; i--) {
    // este ForLoop recorre todas las estrellas del mismo o menor indice para agregarle la clase checked
    let elementChecked = submitScore[i];
    elementChecked.classList.add("checked");
  }
}
function printSelectedScore() {
  let submitScore = document.getElementsByClassName("submitScore"); //creamos un array que contiene todos los span(estrellas)
  let selectedscore = true;
  for (let index = 0; index < submitScore.length; index++) {
    let element = submitScore[index];
    element.addEventListener("click", () => {
      if (selectedscore) {
        selectedscore = false;
      }
      printScoreselected(submitScore, index);
      let numberScore = document.getElementsByClassName(
        "submitScore checked"
      ).length;
    });
    element.addEventListener("mouseover", () => {
      //agregamos evento "mouseover" a cada una de las estrellas
      if (selectedscore) {
        printScoreselected(submitScore, index);
      }
    });
  }
}
function scorePrint(productComments) {
  for (let i = 0; i < productComments.length; i++) {
    const scoreNum = productComments.score[i];
  }
}
document.getElementById("sendComment").addEventListener("click", () => {

  if (localStorage.getItem("userName")) {
    var date = new Date();
  let comment = document.getElementById("commentDescription").value;
  if (comment) {
    let userName = localStorage.getItem("userName");

    let commentDate =
      date.getFullYear() +
      "-" +
      (parseInt(dualDigits(date.getMonth())) + 1) +
      "-" +
      dualDigits(date.getDate()) +
      " " +
      dualDigits(date.getHours()) +
      ":" +
      dualDigits(date.getMinutes()) +
      ":" +
      dualDigits(date.getSeconds());
    let arrayComments = document.getElementById("commentList");
    arrayComments = arrayComments.getElementsByTagName("li");
    let score = document.getElementsByClassName("submitScore checked").length;
    drawComment(arrayComments.length, userName, commentDate, comment);
    let commentId = arrayComments.length;
    let arraySpan =
      arrayComments[arrayComments.length - 1].getElementsByTagName("span");
    
    
    let productId = localStorage.getItem("productID");
    drawScore(arraySpan, score);
    document.getElementById("commentDescription").value = "";
    averageScore();

    saveComment(userName,score,comment,commentDate,productId,commentId);

  } else {
    alert("Ingrese un comentario para enviarlo.");
  }

  }
  else{
    showMessage("Necesitas estar Logeado para hacer eso",false);
  }
  
});
document.addEventListener("DOMContentLoaded", ()=> {
  let id = localStorage.productID;
  if (id) {
    getJSONData(
      "https://japceibal.github.io/emercado-api/products/" + id + ".json"
    )
      .then(async function (resultObj) {
        if (resultObj.status === "ok") {
          var product = resultObj.data;
          var currentProduct = String(product.id);
          showProductInfo(product);
          showRelatedProducts(product);
          
          await loadFirebaseComments();
          printSelectedScore();
          document.getElementById("commentUser").innerHTML=localStorage.getItem("userName") || "Anonymus";
          document.getElementById("buy_btn").addEventListener("click", () => {//creamos el evento de escucha a "click" en el boton de comprar
              if (localStorage.getItem("userName")) { //comprobamos que el usuario está logeado
                loadCart();
                if (document.getElementById("nudCant").value>0) {

                  let userName = localStorage.getItem("userName");//cargamos el nombre de usuario en [userName]
                  let cart = JSON.parse(localStorage.getItem("cart"));//declaramos el objeto cartUser
                  let count = parseInt(document.getElementById("nudCant").value);//sumamos la cantidad previa de dicho producto con la seleccionada previamente en el nud(numeric Up Down)
                  if (cart) { // si existe en el carrito, le sumamos a count, la cantidad previa
                    if (cart[currentProduct]) {
                      count+=cart[currentProduct].count;
                      cart[currentProduct] = {
                        cost:product.cost,
                        count:count,
                        name:product.name,
                        currency: product.currency
                      }
                    }
                    else{
                      cart[currentProduct] = {
                      cost:product.cost,
                      count:count,
                      name:product.name,
                      currency: product.currency
                    }
                    }
                    
                  }
                  else{
                    cart = {}
                    cart[currentProduct] = {
                      cost:product.cost,
                      count:count,
                      name:product.name,
                      currency: product.currency
                    }
                  }
                  saveCart(userName,currentProduct,product.cost,count,product.name,product.currency)
                  localStorage.setItem("cart", JSON.stringify(cart));//guardamos el carrito general(con todos los usuarios) en localStorage
                  showProductInCart();
                  drawCart();
                }
                else{
                  alert("Debes ingresar un valor positivo entero");
                }
            }
            else{
              showMessage("Necesitas estar Logeado para hacer eso",false);
            }
          }
            );
        }
      });
  } else {
    this.location.replace("../categories.html");
  }
});

window.windowReplace=windowReplace;