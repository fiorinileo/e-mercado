import { firebaseGetImage, getProductsOfCategory, saveCart,saveComment } from "./config/firebase.js"
import { loadFirebaseComments } from "./config/loadComments.js";
import { showMessage } from "./config/showMessage.js";
import { showProductInCart, windowReplace, drawCart} from "./init.js"

var date = new Date();

function drawScore(place, value) { // Función que nos permite imprimir la calificación promedio en tiempo real según cambien los comentarios
  if (isNaN(value)) {
    document.getElementById("generalScore").innerHTML = `Aún sin calificación`
  }
  else{
    document.getElementById("generalScore").innerHTML = `
                              Calificación: 
                                  <span class="fa "></span>
                                  <span class="fa "></span>
                                  <span class="fa "></span>
                                  <span class="fa "></span>
                                  <span class="fa "></span>`;
    for (let j = 0; j < value; j++) { // imprimimos estrellas hasta el valor que el usuario haya escogido
      place[j].classList.add("checked");
      place[j].classList.add("fa-star");
      if (value - 1 - j > 0.24 && value - 1 - j < 0.76) { // Para la calificación promedio, si la división entrega un decimal, dependiendo de su valor, agregará la mitad de la estrella siguiente, o no
        place[j + 1].classList.add("fa-star-half");
      }
    }
  }
}
async function imagesProduct(product) { // Función que imprime el carousel de imágenes del producto que se está visualziando
  let htmlContentToAppend = "";
  let carouselContainer = document.getElementsByClassName("carousel-indicators")[0]; //obtenemos el contenedor
  for (let i = 0; i < product.images.length; i++) { // recorremos todas las imágenes
    let imageURL = await firebaseGetImage("prod"+product.id+"_"+(i+1)+".jpg") // obtenemos las URL de las imágenes del producto
    // Creamos el formato HTML necesario para mostrarlas 
    carouselContainer.innerHTML+=`
                      <img src=${imageURL}
                        type="button" data-bs-target="#carouselExampleIndicators"
                        data-bs-slide-to="${i}" class="active" aria-current="true"
                        aria-label="Slide ${i+1}">
                      </img>`
                if (i==0) {
                  htmlContentToAppend += `
                <li class="carousel-item active" data-bs-interval="2500">
                                <img src=${imageURL} class="img-thumbnail " onclick="setImage(${i})" id="img${i}">
                </li>
                `;
                } else {
                  htmlContentToAppend += `
                <li class="carousel-item" data-bs-interval="2500">
                                <img src=${imageURL} class="img-thumbnail " onclick="setImage(${i})" id="img${i}">
                </li>
                `;
                }
      document.getElementById("product-list-images").innerHTML=htmlContentToAppend;
  }
}
function showProductInfo(product) { // Función que imprime las características del producto en el Body
    let countStatus; // variable que almacena el Stock de ese producto
    if (parseInt(product.stock) > 0) { // si hay Stock se muestra la cantidad disponible
      countStatus =  product.stock + " artículos disponibles";
    }
    else{ // si no hay stock se muestra "Agotado"
      countStatus = "Agotado"
    }
  // String almacenador del formato HTML
  let htmlContentToAppend = "";
  htmlContentToAppend += `
  
                      <div id="carouselExampleIndicators" class="carousel slide row col-12 col-lg-7" data-bs-ride="carousel" >
                        <div class="carousel-indicators" >
                          
                        </div>
                        <ul class="carousel-inner" id="product-list-images">
                         
                        </ul>
                        <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="prev">
                          <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                          <span class="visually-hidden">Previous</span>
                        </button>
                        <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="next">
                          <span class="carousel-control-next-icon" aria-hidden="true"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 14" fill="#fff"  ><path d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"/></svg></span>
                          <span class="visually-hidden">Next</span>
                        </button>
                    </div>

                <div class="row justify-content-center col-lg-5  p-lg-4 col-12">
                    
                    <div class="col-lg-12 p-1 p-md-5 product_info p-4">
                        <div class="col mt-3">
                        <p>
                          Vendedor: <span id="seller">${product.seller?product.seller:"E-Mercado"}</span>
                        </p>
                          <small id="soldCountSpan">${product.status?product.status:"Nuevo"} | ${
                            product.soldCount
                            } vendidos
                          </small>
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
                                  <p> Stock | <small>${countStatus}</small>
                                  </p>
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
export function drawComment(id, user, dateTime, description) { // Función que imprime el comentario realizado por el usuario
  document.getElementById("commentList").innerHTML +=
    `
    <li id="idComment_` +
    id +
    `" class="row col-lg-5 hoverAnim-2 mx-0 comment-content">
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
function averageScore() { // Función que calcula la calificación promedio del artículo
  let totalScore = document // obtenemos todos las estiquetas que contienen estrellas
    .getElementById("commentList")
    .getElementsByClassName("checked").length;  
  let totalComments = document // obtenemos la cantidad de comentarios realizados
    .getElementById("commentList")
    .getElementsByTagName("li").length;
  let avgScore = totalScore / totalComments; // obtenemos el promedio de votos realizado por comentario
  let generalScore = document.getElementById("generalScore");
  let spanGeneralScore = generalScore.getElementsByTagName("span"); // obtenemos el array de span que contienen las estrellas de calificación promedio
  drawScore(spanGeneralScore, avgScore); // se lo pasamos como parámetro para  que lo imprima
}
function dualDigits(num) {
  return parseInt(num) < 10 ? (num = "0" + num) : num;
}
async function showRelatedProducts(relatedProducts) { // Imprime las tarjetas de los productos relacionados 
  let htmlContentToAppend = "";
  for (let i = 0; i < relatedProducts.length; i++) {
    let relatedProduct = relatedProducts[i];
    let imageURL = await firebaseGetImage("prod"+relatedProduct.id+"_1.jpg") //obtenemos las URL de la imágen de los productos relacionados
    htmlContentToAppend += `
                <li class="cursor-active col-12 col-md-6 col-lg-4 p-4">
                <div class="row pb-4 pt-2 px-1 product-card" onclick="windowReplace(${
                  relatedProduct.id
                },${relatedProduct.catId})">
                    <div class="col-">
                        <div class="text-center">
                            <img id="main-image-product" src=${imageURL} class="img-thumbnail">
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
export function loadComments() { // Función que carga todos los comentarios realizados
  let comments = JSON.parse(localStorage.getItem("comments")); // obtenemos todos los comentarios realizados en el sitio  
  for (const idComment in comments) { // recorremos el objeto que los almacena
      const comment = comments[idComment];
      drawComment( // los imprimimos en le HTML
        idComment,
        comment.userName,
        comment.dateTime,
        comment.description
      );
      let span = document
        .getElementById("idComment_" + idComment) 
        .getElementsByTagName("span"); //obtenemos los span para imprimir las estrellas
      drawScore(span, comment.score); // lo pasamos como parámetro para que se impriman
  }
}
function printScoreselected(submitScore, index) { // Función que pinta en el campo de realizar un comentario la cantidad de estrellas que el usuario selecciona en tiempo real 
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
function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}
document.getElementById("sendComment").addEventListener("click", () => {

  if (JSON.parse(localStorage.getItem("credentials"))) {
    var date = new Date();
  let comment = document.getElementById("commentDescription").value;
  if (comment) {
    let credentials = JSON.parse(localStorage.getItem("credentials"));
    let userName = credentials.userName+"_"+credentials.userLastname
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
    
    
    let productId = localStorage.getItem("productId");
    drawScore(arraySpan, score);
    document.getElementById("commentDescription").value = "";
    averageScore();

    saveComment(userName,score,comment,commentDate,productId,commentId);

  } else {
    alert("Ingrese un comentario para enviarlo.");
  }

  }
  else{
    showMessage("Necesitas estar Logeado para hacer eso",false,"top","center");
  }
  
});
document.addEventListener("DOMContentLoaded", async ()=> {
  let catId = localStorage.getItem("catId");
  let productId = localStorage.getItem("productId");
  if (productId) { // comprobamos que el usuario realmente haya escogido un producto
          let credentials = JSON.parse(localStorage.getItem("credentials"));
          let userName;
          credentials?userName = credentials.userName+"_"+credentials.userLastname :userName= "Anonymus";
          let category = await getProductsOfCategory(catId);
          var product = category[productId];
          delete category[productId]
          let relatedProducts = [] // Arrays que almacenará los productos relacionados que genere esta función
          let randomIndex=[];
          const RelatedCategories = {
              /*  ESTRUCTURA Y CRITERIO
              CatId principal : {
                  CatId relacionada : (porcentaje de categoría relacionada - rango : 1-100),
                  Otra CatId relacionada : (otro porcentaje de categoría relacionada - rango : 1-100),

                  // Entre todos los elementos, la suma de sus porcentajes siempre dará 100
                  // El porcentaje representaría que tan similar es esa categoría a la principal
                  // Las categoría no pueden NO tener categorías relacionadas, si la categoría no tiene similitud con ninguna, se relacionará con ella misma en un 100% 
              }, 
              */
              101:{
                  101:100, // Autos sólo lo relacionamos con él mismo
              }, 
              102:{ // A "Juguetes" relacionamos con "Computadora" y "Celulares"
                  105:60,
                  109:40 ,
              },   
              103:{ // A "Muebles" relacionamos con "Herramientas" y "Electrodomésticos"
                  104:30,
                  107:70,
              }, 
              104:{ // A "Herramientas" relacionamos con "Muebles" y "Electrodomésticos"
                  103:50,
                  107:50, 
              }, 
              105:{ // A "Computadora" relacionamos con "Celulares" y "Electrodomésticos"
                  109:80,
                  107:20,
              }, 
              106:{ // A "Vestimenta" relacionamos con "Muebles" y "Deporte"
                  103:20,
                  108:80,
              }, 
              107:{ // A "Electrodomésticos" relacionamos con "Herramientas" y "Muebles"
                  104:30,
                  103:70,
              }, 
              108:{  // A "Deporte" relacionamos con "Vestimenta"
                  106: 100,
              },
              109:{  // A "Celulares" relacionamos con "Computadora" y "Juguetes"
                  105:70,
                  107:30,
              },
          }
          let contador = 0;
            const obtainRandProdOfCategory = async (catId,isOtherCategory=false) =>{ //obtiene un producto random de la categoría a la que pertenece
                contador++;
                if (contador < 8) {
                  let randProducts = category;
                  if (isOtherCategory) {
                      randProducts = await getProductsOfCategory(catId); // En el caso que sea una categoría relacionada, traemos sus productos
                  }
                  let randIndex = getRandomInt(Object.keys(randProducts).length) // Obtenemos un producto random de la cateogría, el número máximo que le pasamos como parámetro es el largo del objeto.
                  if (randIndex>=0) { //comprobamos que la categoŕia tenga productos
                    let randProduct = randProducts[Object.keys(randProducts)[randIndex]]
                      /* Componemos el id del producto, gracias a los tres primeros dígitos de la categoría, cancatenándole el índice random resultante: 
                      //EJ:   
                              Jugetes tiene ID 102;
                              products[String(catId)+(randIndex+1)]   
                              products[String(102)+(2+1)]  = products[1023] = el arículo Playstation 5 tiene ID 1023*/
                      if (Object.keys(randProducts).length != 0) {
                        const found = relatedProducts.find(i => i.id==randProduct.id); // Buscamos en el array de productos si ya se ha agregado ese artículo
                        if (!found && productId != randProduct.id) { //En el caso de que el array de productos relacionados no posea el artículo sugerido, se agregará
                            relatedProducts[relatedProducts.length] = { // establecemos el índice según el largo del array
                                catId:catId,
                                //entramos al artículo y extraemos sus atributos
                                id: randProduct.id, 
                                image:randProduct.images[0],
                                name:randProduct.name,
                            }
                        }
                        else{ //En el caso de que se repita el id: Ejecutamos =>
                            if (Object.keys(randProducts).length<2) {
                              obtainRandProdOfRelatedCategory(catId)
                            } 
                            else{
                              obtainRandProdOfCategory(catId,true); //Ejecutamos la misma función hasta que se agregue uno diferente (Problema de eficiencia)
                            }
                        }
                      }
                  }
                  else{
                      obtainRandProdOfRelatedCategory(catId)
                      obtainRandProdOfRelatedCategory(catId)
                  }
                }
              }
              const obtainRandProdOfRelatedCategory = async (catId) =>{ // Obtiene productos random, de una categoría relacionada, ya con sus porcentajes de probabilidad
                  let numRand = getRandomInt(100)
                  if(numRand<=Object.values(RelatedCategories[catId])[0]){ //Si el número random del 1 al 100 es menor o igual al procentaje almacenado en la primer categoría relacionada se ejecuta =>
                      await obtainRandProdOfCategory(Object.keys(RelatedCategories[catId])[0],true) // Se busca producto random en la primer categoría relacionada
                  }
                  else{
                      await obtainRandProdOfCategory(Object.keys(RelatedCategories[catId])[1],true)
                  }
              }

              if ((Object.keys(category).length)>0) { // En el caso de que la categoría principal tenga al menos un producto 
                  if (Object.keys(category).length>1) { // En el caso que la categoría principal tenga más de 1 producto, trabajamos con esa categoría
                      await  obtainRandProdOfCategory(catId);
                      await  obtainRandProdOfCategory(catId);
                      await  obtainRandProdOfRelatedCategory(catId)
                  }
                  else{ // Pero si sólo tiene un producto, lo agregamos y luego agregamos otro de una categoría relacionada
                      await  obtainRandProdOfCategory(catId);
                      await  obtainRandProdOfRelatedCategory(catId)
                      await  obtainRandProdOfRelatedCategory(catId)

                  }
              }
              else{ //En caso de que la categoría NO posea productos, haremos el siguiente procedimiento
                  await  obtainRandProdOfRelatedCategory(catId)
                  await  obtainRandProdOfRelatedCategory(catId)
                  await  obtainRandProdOfRelatedCategory(catId)

              }
          var currentProduct = String(productId);
          showProductInfo(product);
          showRelatedProducts(relatedProducts);
          // Cargamos información del producto desde Firebase (más actualizada)
          
          await loadFirebaseComments(); // cargamos los comentiarios realizados
          // Sentencias para darle vida y animación a las estrellas de "realizar un comentario"
              let submitScore = document.getElementsByClassName("submitScore"); //creamos un array que contiene todos los span(estrellas)
              let selectedscore = false; // booleano que almacena si el usuario ya seleccionó un puntaje (empieza en false)
              for (let index = 0; index < submitScore.length; index++) { // recorremos el array de estrellas
                let element = submitScore[index];
                element.addEventListener("click", () => { // le agregamos un evento de escucha a cada estrella
                  if (!selectedscore) {  // cuando le da click, si el usuario no había seleccionado estrellas 
                    selectedscore = true; // almacenamos que lo ha seleccionado
                  }
                  printScoreselected(submitScore, index); // pintamos o despintamos las demas estrellas
                });
                element.addEventListener("mouseover", () => { //agregamos un evento de moseover
                  //agregamos evento "mouseover" a cada una de las estrellas
                  if (!selectedscore) { //cuando el usuario pase el cursor por encima de la estrella, pintaremos las estrellas con la condición de que no haya seleccionado una calificación antes 
                    printScoreselected(submitScore, index);
                  }
                });
              }
          averageScore() // imprimimos la calificación promedio
          document.getElementById("commentUser").innerHTML=userName || "Anonymus"; 
          document.getElementById("buy_btn").addEventListener("click", async () => {//creamos el evento de escucha a "click" en el boton de comprar
              if (localStorage.getItem("userEmail")) { //comprobamos que el usuario está logeado
                
                if (product.stock >= document.getElementById("nudCant").value) { // Si hay artículos en stock suficientes, se ejecuta el codigo
                  if (document.getElementById("nudCant").value>0) { // Si la cantidad seleccionada por el usuario es mayor a 0, se ejecuta ==>>
                    let userEmail = localStorage.getItem("userEmail");//cargamos el nombre de usuario en [userEmail]
                    let cart = JSON.parse(localStorage.getItem("cart"));//declaramos el objeto cartUser
                    let count = parseInt(document.getElementById("nudCant").value);//sumamos la cantidad previa de dicho producto con la seleccionada previamente en el nud(numeric Up Down)
                    let flag = true;
                    if (cart) { // si existe el carrito
                      // se ejecuta =>
                            if (cart[currentProduct]) { // Si el producto existe en el carrito
                              // se ejecuta =>
                                    if (product.stock > (cart[currentProduct].count+count) ) { // si hay stock suficiente a la venta 
                                      // se suma la cantidad previa, más la cantidad seleccionada
                                      count+=cart[currentProduct].count;
                                      cart[currentProduct] = {
                                        cost:product.cost,
                                        count:count,
                                        name:product.name,
                                        currency: product.currency,
                                        image:product.images[0],
                                        catId:product.catId,
                                        stock:product.stock,
                                      }
                                    }
                                    else{ // si NO hay stock suficiente a la venta
                                      // Le mostramos el mensaje 
                                      flag = false; // establecemos nuestra flag en false, para que no se ejecute nada más
                                      showMessage("Lo sentimos, no disponemos de stock suficiente para su compra",false,"top","center")
                                    }
                            }
                            else{ // Si el producto NO existe en el carrito
                              // lo agregamos por primera vez y no le sumamos cantidad previa
                                cart[currentProduct] = {
                                  cost:product.cost,
                                  count:count,
                                  name:product.name,
                                  currency: product.currency,
                                  image:product.images[0],
                                  catId:product.catId,
                                  stock:product.stock,
                                }
                            }
                    } 
                    else{ // Si el carrito NO existe en el LS
                      // creamos el objeto cart y le agregamos el producto, más la cantidad que seleccionó el usuario
                      cart = {}
                      cart[currentProduct] = {
                        cost:product.cost,
                        count:count,
                        name:product.name,
                        currency: product.currency,
                        image:product.images[0],
                        catId:product.catId,
                        stock:product.stock,
                      }
                    }
                    if (flag) { // si nuestra bandera permite ejecutar código
                      // Almacenamos el cart en Firebase Y en el LS
                        saveCart(userEmail,currentProduct,product.cost,count,product.name,product.currency,product.images[0],product.catId,product.stock)
                        localStorage.setItem("cart", JSON.stringify(cart));//guardamos el carrito general(con todos los usuarios) en localStorage
                      //Ejecutamos nuestras funciones que brindan información visual sobre el carrito
                        drawCart();
                        showProductInCart();
                      // Damos feedback de que se agregó el producto exitosamente
                        showMessage("Se ha agregado su producto al carrito",true,"top","center")
                    }
                  }
                  else{// Si la cantidad seleccionada por el usuario es igual o menor a 0, se ejecuta ==>>
                    // El mensaje dandole feedback al usuario
                    showMessage("Debes ingresar un valor positivo entero",false,"top","center");
                  }
                }
                else{ // Si NO hay stock suficiente para la cantidad que solicitó el usuario
                  // Le avisamos que no se dispone del stock
                  showMessage("Lo sentimos, no hay artículos suficientes a la venta",false,"top","center");
                } 
            }
            else{
              // Si el usuario no se encuentra logueado
              // Le informamos que debe estarlo para poder agregar productos a un carrito
              showMessage("Necesitas estar Logeado para hacer eso",false,"top","center");
            }
          });// FIN BOTÓN COMPRAR
      }
  else { //En el caso de que no haya escogido un producto, lo redirigimos a cateogires.html
    window.location.replace("./categories.html");
  }
});
window.windowReplace=windowReplace;