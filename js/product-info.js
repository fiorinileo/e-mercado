var date = new Date();
function drawScore(place, value) {
  console.log(document.getElementById("generalScore"));
  document.getElementById("generalScore").innerHTML = `
                            Calificación promedio: 
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
function imagesProduct() {
  let htmlContentToAppend = "";
  for (let i = 0; i < product.images.length; i++) {
    let image = product.images[i];
    htmlContentToAppend += `
                <li class="cursor-active  col-2 d-flex">
                        <div class="col-">
                                <img src="${image}" class="img-thumbnail hoverAnim" onclick="setImage(${i})" id="img${i}">
                        </div>
                </li>
                `;

    document.getElementById("product-list-images").innerHTML =
      htmlContentToAppend;
  }
}
function showProductInfo() {
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
                        <small class="text-muted">Nuevo | ${
                          product.soldCount
                        } vendidos </small>
                            <div class="d-flex w-100 justify-content-between">
                                <h4 class="mb-1 product-header">${product.name.toUpperCase()}</h4>
                            </div>
                            <p id="generalScore">
                            </p>
                            <p class="mb-1">${product.description}</p>
                            
                        </div>
                        <div class="row pe-2 pb-3">
                            <p class="product-price col">${product.currency} ${
    product.cost
  }</p>
                            <div class=" col product-cta-btn pe-0">
                                <button class="hoverAnim-2">
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
                `;
  document.getElementById("product-container").innerHTML = htmlContentToAppend;
  imagesProduct();
}
/*-----------------------------------------------------------------------------*/

function drawComment(id, user, dateTime, description) {
  document.getElementById("commentList").innerHTML +=
    `
    <li id="idComment_` +
    id +
    `" class="row col-6 hoverAnim-2 comment-content">
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
function products_comments() {
  for (let i = 0; i < productComments.length; i++) {
    let commentInfo = productComments[i];
    drawComment(
      i,
      commentInfo.user,
      commentInfo.dateTime,
      commentInfo.description
    );
  }

  for (let i = 0; i < productComments.length; i++) {
    let liScoreID = document.getElementById("idComment_" + i); // seleccionamos el <li>(comentario) para poder trabajar dentro de él
    let spanScore = liScoreID.getElementsByTagName("span"); // seleccionamos el array de <span> para ubicar cada una de las estrellas
    drawScore(spanScore, productComments[i].score); // utilizamos la función DrawScore, y le pasamos como parámetro, el array de estrellas, y la cantidad.
  }
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
function showRelatedProducts() {
  const relatedProductList = document.getElementById("related-products");
  let htmlContentToAppend = "";
  for (let i = 0; i < product.relatedProducts.length; i++) {
    let relatedProduct = product.relatedProducts[i];
    htmlContentToAppend += `
                <li class="cursor-active col-md-6 col-lg-4 p-4">
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
    setImage(0);
  }
}
function windowReplace(id) {
  localStorage.setItem("productID", id);
  window.location = "product-info.html";
}
function setImage(imgIndex) {
  //agregamos como imagen principal, la imagen con el índice seleccionado previamente (pasado por parámetro)
  document.getElementById("product-info-container").innerHTML = `
        <img src="${product.images[imgIndex]}">
        </img>
    `;
  // recorremos todas las imágenes secundarias, le agregamos un box-shadow a la imágen que se muestra en grande, y a las demás se lo quitamos
  // para así de esta forma, el usuario puede identificar cuál está visualizando.
  for (let i = 0; i < product.images.length; i++) {
    i == imgIndex
      ? document.getElementById("img" + i).classList.add("selected-img")
      : document.getElementById("img" + i).classList.remove("selected-img");
  }
}
function saveComment(id, user, dateTime, description, score) {
  let saveComments = [];
  if (localStorage.getItem("saveComments")) {
    saveComments = JSON.parse(localStorage.getItem("saveComments"));
  }

  lastcomment = {
    productID: localStorage.getItem("productID"),
    id: id,
    user: user,
    dateTime: dateTime,
    description: description,
    score: score,
  };

  saveComments.push(lastcomment);

  localStorage.setItem("saveComments", JSON.stringify(saveComments));
}
function loadComments() {
  let comments = JSON.parse(localStorage.getItem("saveComments")); // obtenemos todos los comentarios realizados en el sitio
  let saveComments = []; // almacena los comentarios del localstorage que sean únicamente del producto visitado

  comments.forEach((comment) => {
    if (comment.productID == localStorage.getItem("productID")) {
      saveComments.push(comment); // agrega el comentario a saveComments, cuando este coincida con el producto visitado
    }
  });

  saveComments.forEach((comment) => {
    drawComment(
      comment.id,
      comment.user,
      comment.dateTime,
      comment.description
    );
    let span = document
      .getElementById("idComment_" + comment.id)
      .getElementsByTagName("span");
    drawScore(span, comment.score);
  });
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
      numberScore = document.getElementsByClassName(
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
function scorePrint() {
  for (let i = 0; i < productComments.length; i++) {
    const scoreNum = productComments.score[i];
  }
}
document.getElementById("sendComment").addEventListener("click", (e) => {
  let comment = document.getElementById("commentDescription").value;
  if (comment) {
    let user = localStorage.getItem("userName");

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
    numberScore = document.getElementsByClassName("submitScore checked").length;
    drawComment(arrayComments.length, user, commentDate, comment);
    saveComment(
      arrayComments.length - 1,
      user,
      commentDate,
      comment,
      numberScore
    );
    let arraySpan =
      arrayComments[arrayComments.length - 1].getElementsByTagName("span");
    drawScore(arraySpan, numberScore);
    document.getElementById("commentDescription").value = "";
    averageScore();
  } else {
    alert("Ingrese un comentario para enviarlo.");
  }
});

document.addEventListener("DOMContentLoaded", function (e) {
  let id = localStorage.productID;
  if (id) {
    getJSONData(
      "https://japceibal.github.io/emercado-api/products/" + id + ".json"
    )
      .then(function (resultObj) {
        if (resultObj.status === "ok") {
          product = resultObj.data;
          showProductInfo();
          showRelatedProducts();
        }
      })
      .then(() => {
        getJSONData(
          "https://japceibal.github.io/emercado-api/products_comments/" +
            id +
            ".json"
        ).then(function (resultObj) {
          if (resultObj.status === "ok") {
            productComments = resultObj.data;

            products_comments();

            if (localStorage.getItem("saveComments")) {
              loadComments();
            }
            averageScore();
          }
          printSelectedScore();
          document.getElementById("commentUser").innerHTML =
            localStorage.userName;
          document.getElementById("commentDate").innerHTML =
            date.getFullYear() +
            "-" +
            (parseInt(dualDigits(date.getMonth())) + 1) +
            "-" +
            dualDigits(date.getDate());
        });
      });
  } else {
    this.location.replace("../categories.html");
  }
});
