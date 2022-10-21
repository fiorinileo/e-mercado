export function drawCartList() {
    const cart = JSON.parse(localStorage.getItem("cart"));
    console.log(cart);
    if (cart) {
      console.log(cart);
      let cartItem= "";
      let totalCostUYU = 0;
      let totalCostUSD = 0;
      for (const article in cart) {
                  let product = cart[article]
                  let totalCost = product.cost*product.count
                  product.currency == "UYU"?
                  totalCostUYU += totalCost:
                  totalCostUSD += totalCost;
                   cartItem += `
                   <li class="row" id="id_${article}" >
                     <div class="col-6" onclick="windowReplace(${article})">
                           <img src="./img/prod${article}_1.jpg" class="img-thumbnail ">
                     </div>
                     
                     <div class="col-6 row">
                       <h4 class="col-11">
                         ${product.name}
                       </h4>
                       <span onclick="deleteItemCart(${article})"class="col-1 justify-content-end d-flex pt-2 pe-0"><i class="fa fa-trash" aria-hidden="true"></i></span>

                       <p class="col-7">${product.currency}  ${product.cost}</p>
                       <p class="col-4" >
                         <span class="minorCant" onclick="chgCount(false,${article})">-</span>
                         <span>x${product.count}</span>
                         <span class="moreCant" onclick="chgCount(true,${article})">+</span>
                       </p>
                       <p class="col">
                         Total:
                         ${product.currency} ${totalCost}
                       </p>
                         </div>
                   </li>
                 `  
                      const boxCart = document.getElementById("productListCart");
                      boxCart.innerHTML = "";
                      boxCart.innerHTML += cartItem

        }
        document.getElementById("Prices").innerHTML = `
             <p>
               Total de UYU: $ ${totalCostUYU}
             </p>
             <p>
               Total de USD: $ ${totalCostUSD}
             </p>
       `
    }
}
document.addEventListener("DOMContentLoaded",()=>{
    drawCartList();
});