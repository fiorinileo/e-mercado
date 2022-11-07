import { drawCartList } from "./cart.js";
import {saveCart,deleteProduct} from "./config/firebase.js"
import { loadCart } from "./config/loadCart.js";
import { showMessage } from "./config/showMessage.js";
export const CATEGORIES_URL = "https://japceibal.github.io/emercado-api/cats/cat.json";
export const PUBLISH_PRODUCT_URL = "https://japceibal.github.io/emercado-api/sell/publish.json";
export const PRODUCTS_URL = "https://japceibal.github.io/emercado-api/cats_products/";
export const PRODUCT_INFO_URL = "https://japceibal.github.io/emercado-api/products/";
export const PRODUCT_INFO_COMMENTS_URL = "https://japceibal.github.io/emercado-api/products_comments/";
export const CART_INFO_URL = "https://japceibal.github.io/emercado-api/user_cart/";
export const CART_BUY_URL = "https://japceibal.github.io/emercado-api/cart/buy.json";
export const EXT_TYPE = ".json";
export let showSpinner = function(){
  document.getElementById("spinner-wrapper").style.display = "block";
}
export let hideSpinner = function(){
  document.getElementById("spinner-wrapper").style.display = "none";
}
export let getJSONData =  function (url){
    let result = {};
    showSpinner();
    return fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }else{
        throw Error(response.statusText);
      }
    })
    .then(function(response) {
          result.status = 'ok';
          result.data = response;
     //     hideSpinner();
          return result;
    })
    .catch(function(error) {
        result.status = 'error';
        result.data = error;
        hideSpinner();
        return result;
    });
}
export function chgCount(action,idProduct){ //cambia la cantidad del articulo en el carrito del usuario
  let userEmail = localStorage.getItem("userEmail");
  let cart = JSON.parse(localStorage.getItem("cart"));
  let product = cart[idProduct];

  if(action) {// en el caso de que la acción sea true se suma 1, en caso de que sea false, se resta
    if (product.stock == product.count) { // si el usuario quiere aumentar la cantidad del producto, pero la cantidad que tiene, es igual al stock que existe, le avisaremos que no podrá añadir más artículos
      showMessage("Lo sentimos, no disponemos de stock suficiente para su compra",false,"top","center")
    }
    else{ // es caso de que haya stock disponible, añadiremos la cantidad
      product.count++;
      saveCart(userEmail,idProduct,product.cost,product.count,product.name,product.currency,product.image,product.catId,product.stock)
    }
  }
  else{
    if (product.count==1) {//preguntamos si la cantidad que tiene de ese producto es igual a 1
      delete cart[idProduct];  //en el caso de que la cantidad sea igual a 1 eliminamos el producto directamente  
      deleteProduct(userEmail,idProduct)
    }
    else{
      product.count--; // en el caso que sea mayor, la reducimos en una unidad
      saveCart(userEmail,idProduct,product.cost,product.count,product.name,product.currency,product.image,product.catId,product.stock)
    } 
  }
  localStorage.setItem("cart",JSON.stringify(cart));
  drawCart();
  
  if (document.getElementById("productListCart")) { // cuando cambiamos la cantidad y nos encontramos en la pagina del carrito, tambien cambiaremos el carrito que se muestra en el Body del HTML
    drawCartList()
  } 
}
export function showProductInCart(){ //Muestra la cantidad total de productos que tiene en el carrito dentro del navbar en una burbuja roja
  let cart = {};
  cart = JSON.parse(localStorage.getItem("cart"));
  if (cart) {
            let totalCant=0;
            for (const idProduct in cart) {
             totalCant+=cart[idProduct].count;
            }
            document.getElementById("boxCart").getElementsByTagName("strong")[0].innerHTML=totalCant;
    }
  
}
export async function deleteItemCart(idProduct){  // Elimina un único artículo del carrito del usuario
  const userEmail = localStorage.getItem("userEmail"); // Extraemos el email del usuario
  let cart = JSON.parse(localStorage.getItem("cart")); // Extraemos su carrito
  delete cart[idProduct]; // Eliminamos la sentencia que tenga de ese artículo
  await deleteProduct(userEmail,idProduct) // Eliminamos ese producto tambien de Firebase
  localStorage.setItem("cart",JSON.stringify(cart)) // almacenamos el nuevo carrito en LS
  drawCart(); // Ejecutamos la función para reimprimir el carrio en el navbar
  if (document.getElementById("productListCart")) { // En el caso de que el usuario se encuentre en cart.html tambien lo eliminamos del body del HTML
    drawCartList() //reimprimimos el carrito del Body
  }  
}
export function drawCart(){ // Función que permite imprimir el carrito en el navbar 
  if (localStorage.getItem("userEmail")) {  // si el usuario se encuentra logueado
    let cart = JSON.parse(localStorage.getItem("cart")); // obtenemos su carrito
    let cartItem = "";
    let totalCostUSD = 0; // variable que almacenará el costo subtotal de todos los artículos 
    for (const productId in cart) { // recorremos el carrito
                let product = cart[productId]
                let totalCost = product.cost*product.count
                let name = product.name;
                name.length>19? // si el nombre del producto es mayor a 19 caracteres
                 name = (product.name).substring(0,20)+"...":{}; // lo limitamos y le concatenamos puntos suspensivos
                product.currency == "UYU"? // si la moneda del producto es UYU
                totalCostUSD += parseInt(totalCost/42): // dividimos su costo total entre 42 para calcularlo en dólares
                totalCostUSD += parseInt(totalCost); // en el caso de que la moneda sea UDS, simplemente se suma al subtotal 
                // String con formato HTML para mostrar cada producto en el carrito
                 cartItem += `
                        <li class="dropdown-item row d-flex">
                        <h4 class="col-12" style="width:300px">
                            ${name}
                          </h4>
                        <div class="col-6 p-0 text-center"  onclick="windowReplace(${productId},${product.catId})" title="Ir a ver producto: ${name}">
                              <img src=${product.image} class="img-thumbnail " style="max-height:100px;">
                        </div>
                        <div class="col-6 row">
                          <p class="col-10 articleCant " >
                          <span class="minorCant" onclick="chgCount(false,${productId})">-</span>
                            x${product.count}
                          <span class="moreCant" onclick="chgCount(true,${productId})">+</span>
                          </p>
                          <span onclick="deleteItemCart(${productId})"class="col-2 justify-content-end d-flex p-0 pt-1"><i class="fa fa-trash" aria-hidden="true"></i></span>
                          <p class="col" >
                            ${product.currency} ${totalCost}</div>
                      </li>
                    ` 
    } // Luego de recorrer todo el carrito, hacemos visible el costo subtotal
    document.getElementById("CartDropdown").innerHTML = `
     <ul id="listCartDropdown">
      <li class="dropdown-item row d-flex" id="EmptyCart">
        <h4 class="col-12">
          Carrito vacío
        </h4>
      </li>
    </ul>
    <div class="priceContainer">
      <div>
        <div>
          <p class="fw-bold">
            Subtotal en USD: $ ${totalCostUSD}
          </p>
        </div>
      </div>
      <div class="btn--verCarrito">
        <div>
          <a href="cart.html">
              Ver carrito
          </a>
        </div>
      </div>
    </div>
    `
    const boxCart = document.getElementById("listCartDropdown");
    boxCart.innerHTML = ""; // vaciamos el contenedor del navbar para asegurarnos de que está vacío
    boxCart.innerHTML += cartItem // luego concatenamos la lista de artículos 
    if (cart == undefined || JSON.stringify(cart).length<3) { // En el caso de que el carrito se encuentre vacío 
      //ejecutamos =>
      emptyCart();
    }
  }
  else{ // si el usuario no se encuentra logueado 
    //ejecutamos =>
    emptyCart();
  }
  // luego de imprimir o no el carrito, ejecutamos la función que muestra la cantidad de artículos en él
  showProductInCart();
}
export function emptyCart(){ // Función que nos permite saber si el carrito se encuentra vacío
  const listDropdown = document.getElementById("listCartDropdown"); //obtenemos el contenedor del carrito del navbar
  let liEmpty = ""; // seteamos un String que tendrá el formato HTML
    if(listDropdown.getElementsByTagName("li").length<1){ // si la cantidad de artículos en el carrito es inferior a 1 (0 artículos)
      // le asignamos que el carrito se encuentrá vacío
      liEmpty = `<li class="dropdown-item row d-flex" id="EmptyCart">
     <h4 class="col-12">
       Carrito vacío
     </h4>
   </li>`;
   listDropdown.innerHTML = liEmpty; //mostramos en el HTML que el carrito está vacío
   if (document.getElementById("productListCart")) { // Si el usuario se encuentra en la página cart.html 
    // también le mostramos que el carrito se encuentra vacío
     document.getElementById("productListCart").innerHTML=`
     <li class="row d-flex">
       <h4 class="col-12">
         Carrito vacío
       </h4>
     </li>
     `
    }
   }
   else{ // en el caso de que el carrito posea un artículo o más, eliminamos el cartel de carrito vacío 
     if(document.getElementById("EmptyCart")){
       document.getElementById("EmptyCart").remove();
     }
   }
  


}
export function windowReplace(productId,catId) { //Función que nos permite redireccionar a la página de un artículo
  localStorage.setItem("productId", productId);
  localStorage.setItem("catId",catId)
  window.location = "product-info.html";
}
document.addEventListener("DOMContentLoaded", async ()=>{ // Una vez se carga la página
  let userEmail = localStorage.getItem("userEmail"); //obtenemos el email del usuario
  if (userEmail) { // si se encuentra logueado
    await loadCart(); // cargamos su carrito de Firebase
    let credentials = JSON.parse(localStorage.getItem("credentials")); // obtenemos sus credenciales del LS
    document.getElementById("userName").innerHTML=(credentials.userName+" "+credentials.userLastname).substring(0,9)+"..."; // y las imprimimos en el navbar, esto sucede en todas las páginas
    document.getElementById("userEmail").getElementsByTagName("img")[0].src=credentials.photo;
  }
});
window.chgCount = chgCount;
window.deleteItemCart=deleteItemCart;




