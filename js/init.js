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
function chgCount(action,idProduct){ //cambia la cantidad del articulo en el carrito del usuario
  let userName = localStorage.getItem("userName");
  let cartUsers = JSON.parse(localStorage.getItem("cartUsers"));
  let userCart = cartUsers[userName];
  if(action) {// en el caso de que la acción sea true se suma 1, en caso de que sea false, se resta
    userCart[idProduct].count++;
  }
  else{
    if (userCart[idProduct].count==1) {//preguntamos si la cantidad que tiene de ese producto es igual a 1
      delete userCart[idProduct];  //en el caso de que la cantidad sea igual a 1 eliminamos el producto directamente  
    }
    else{
      userCart[idProduct].count--; // en el caso que sea mayor, la reducimos en una unidad
    } 
  }
  
  cartUsers[userName] = userCart;
  localStorage.setItem("cartUsers",JSON.stringify(cartUsers));
  drawCart();
  
  if (document.getElementById("productListCart")) {
    drawCartList()
  } 

}
function showProductInCart(){ //m Muestra la cantidad total de productos que tiene en el carrito dentro del navbar en una burbuja roja

  let userName = localStorage.getItem("userName");
  let cartUsers = {};
  cartUsers = JSON.parse(localStorage.getItem("cartUsers"));
  if (cartUsers) {
  let userCart = cartUsers[userName];
            let totalCant=0;
            for (const idProduct in userCart) {
             totalCant+=userCart[idProduct].count;
            }
            document.getElementById("boxCart").getElementsByTagName("strong")[0].innerHTML=totalCant;
    }
  
}
function deleteItemCart(idProduct){
  const userName = localStorage.getItem("userName");
  let cartUsers = JSON.parse(localStorage.getItem("cartUsers"));
  let userCart = cartUsers[userName];
  delete userCart[idProduct];
  if (document.getElementById("productListCart")) { 
    document.getElementById("productListCart").removeChild(document.getElementById("id_"+idProduct)); //boramos el li del carrito que tenga como id ese producto
  } 
  cartUsers[userName] = userCart;
  localStorage.setItem("cartUsers",JSON.stringify(cartUsers))
  drawCart();  
}
function drawCart(){
  const userName = localStorage.getItem("userName");
  if (userName) {
    let userCart = JSON.parse(localStorage.getItem("cartUsers"))[userName];
    let cartItem = "";
    let totalCostUYU = 0;
    let totalCostUSD = 0;
    for (const article in userCart) {
                let product = userCart[article]
                let totalCost = product.cost*product.count
                let name = product.name;
                name.length>19?
                 name = (product.name).substring(0,20)+"...":{};
                product.currency == "UYU"?
                totalCostUYU += totalCost:
                totalCostUSD += totalCost;
                 cartItem += `
                        <li class="dropdown-item row d-flex">
                        <h4 class="col-12" style="width:300px">
                            ${name}
                          </h4>
                        <div class="col-6 p-0"  onclick="windowReplace(${article})" title="Ir a ver producto: ${name}">
                              <img src="./img/prod${article}_1.jpg" class="img-thumbnail ">
                        </div>
                        <div class="col-6 row">
                          <p class="col-10 articleCant " >
                          <span class="minorCant" onclick="chgCount(false,${article})">-</span>
                            x${product.count}
                          <span class="moreCant" onclick="chgCount(true,${article})">+</span>
                          </p>
                          <span onclick="deleteItemCart(${article})"class="col-2 justify-content-end d-flex p-0 pt-1"><i class="fa fa-trash" aria-hidden="true"></i></span>
                          <p class="col" >
                            ${product.currency} ${totalCost}</div>
                      </li>
                    ` 
    }
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
          <p>
            Total de UYU: $ ${totalCostUYU}
          </p>
        </div>
        <div>
          <p>
            Total de USD: $ ${totalCostUSD}
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
    boxCart.innerHTML = "";
    boxCart.innerHTML += cartItem

    if (userCart == undefined || JSON.stringify(userCart).length<3) {
      emptyCart();
    }
  }
  else{
    emptyCart();
  }
  showProductInCart();
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
  if (document.getElementById("productListCart")) {
    document.getElementById("productListCart").innerHTML=`
    <li class="row d-flex">
      <h4 class="col-12">
        Carrito vacío
      </h4>
    </li>
    `
   }
  }
  else{
    if(document.getElementById("EmptyCart")){
      document.getElementById("EmptyCart").remove();
    }
  }

}
function windowReplace(id) {
  localStorage.setItem("productID", id);
  window.location = "product-info.html";
}
document.addEventListener("DOMContentLoaded", ()=>{
  cartUsers = JSON.parse(localStorage.getItem("cartUsers"));
  if (cartUsers) {
    drawCart();
  }
  

});









