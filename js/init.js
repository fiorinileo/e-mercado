const CATEGORIES_URL = "https://japceibal.github.io/emercado-api/cats/cat.json";
const PUBLISH_PRODUCT_URL = "https://japceibal.github.io/emercado-api/sell/publish.json";
const PRODUCTS_URL = "https://japceibal.github.io/emercado-api/cats_products/";
const PRODUCT_INFO_URL = "https://japceibal.github.io/emercado-api/products/";
const PRODUCT_INFO_COMMENTS_URL = "https://japceibal.github.io/emercado-api/products_comments/";
const CART_INFO_URL = "https://japceibal.github.io/emercado-api/user_cart/";
const CART_BUY_URL = "https://japceibal.github.io/emercado-api/cart/buy.json";
const EXT_TYPE = ".json";
let showSpinner = function(){
  document.getElementById("spinner-wrapper").style.display = "block";
}

let hideSpinner = function(){
  document.getElementById("spinner-wrapper").style.display = "none";
}

let getJSONData = function(url){
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
          hideSpinner();
          return result;
    })
    .catch(function(error) {
        result.status = 'error';
        result.data = error;
        hideSpinner();
        return result;
    });
}
function showProductInCart(){

  let userName = localStorage.getItem("userName");
  let cartUsers = {};
  cartUsers = JSON.parse(localStorage.getItem("cartUsers"));
  let cart = cartUsers[userName];
            let totalCant=0;
            for (const idProduct in cart) {
             totalCant+=cart[idProduct];
            }
            document.getElementById("boxCart").getElementsByTagName("strong")[0].innerHTML=totalCant;
}
function deleteItemCart(idProduct){
  const userName = localStorage.getItem("userName");
  let cartUsers = JSON.parse(localStorage.getItem("cartUsers"));
  let userCart = cartUsers[userName];
  delete userCart[idProduct];
  cartUsers[userName] = userCart;
  localStorage.setItem("cartUsers",JSON.stringify(cartUsers))
  drawCart();
    showProductInCart();
    emptyCart();
  
  
}
function drawCart(){
  console.log(document.getElementById("listCartDropdown")+" primer log");
  const userName = localStorage.getItem("userName");
  const boxCart = document.getElementById("listCartDropdown");
  boxCart.innerHTML = "";
  let userCart = JSON.parse(localStorage.getItem("cartUsers"))[userName];
  for (const article in userCart) {
    getJSONData(
      "https://japceibal.github.io/emercado-api/products/" + article + ".json"
    ).then(function (resultObj) {
      console.log("entra hasat el fondo");
            if (resultObj.status === "ok") {
              product = resultObj.data;
              let articleCant = userCart[article];
              let totalCost = product.cost*articleCant;
              let cartItem = `
                      <li class="dropdown-item row d-flex">
                      <h4 class="col-12" style="width:300px">
                          ${product.name}
                        </h4>
                      <div class="col-6 p-0">
                            <img src="${product.images[0]}" class="img-thumbnail ">
                      </div>
                      <div class="col-6 row">
                        <p class="col-3 " >
                          x${articleCant}
                        </p>
                        <span onclick="deleteItemCart(${product.id})"class="col-9 justify-content-end d-flex pt-1"><i class="fa fa-trash" aria-hidden="true"></i></span>
                        <p class="col" >
                          ${product.currency}
                          ${totalCost}
                        </p>
                      </div>
                    </li>
                  ` 
                  boxCart.innerHTML += cartItem
                }
                
          }
          );
  }
  emptyCart();
}
function emptyCart(){
  const listDropdown = document.getElementById("listCartDropdown"); 
  let liEmpty = "";
  if(listDropdown.getElementsByTagName("li").length<1){
     liEmpty = `<li class="dropdown-item row d-flex" id="EmptyCart">
    <h4 class="col-12">
      Carrito vacío
    </h4>
  </li>`;
  listDropdown.innerHTML = liEmpty;
  console.log("SE IMPRIME");
  }
  else{
    if(document.getElementById("EmptyCart")){
      document.getElementById("EmptyCart").remove();
    }
  }

}
document.addEventListener("DOMContentLoaded", ()=>{
  showProductInCart();
  drawCart();
  emptyCart();
  
});









