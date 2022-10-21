var totalCostUSD = 0;
function printShipCost(){
      let shipCost = document.getElementById("shipCost");
      let totalCost = document.getElementById("totalCost")

       if (document.getElementById("Premium").checked) {
        shipCost.innerHTML= parseInt(totalCostUSD*0.15)
        totalCost.innerHTML= totalCostUSD+parseInt(totalCostUSD*0.15)
       }
       else if(document.getElementById("Express").checked){
        shipCost.innerHTML= parseInt(totalCostUSD*0.07)
        totalCost.innerHTML= totalCostUSD+parseInt(totalCostUSD*0.07)
       }
       else if(document.getElementById("Standard").checked){
        shipCost.innerHTML= parseInt(totalCostUSD*0.05)
        totalCost.innerHTML= totalCostUSD+parseInt(totalCostUSD*0.05)
       }
       else{
        shipCost.innerHTML = "------";
        totalCost.innerHTML = "------";
       }
}
export function drawCartList() {
  totalCostUSD = 0;
    const cart = JSON.parse(localStorage.getItem("cart"));
    if (cart) {
      let cartItem= "";
      for (const article in cart) {
                  let product = cart[article]
                  let totalCost = product.cost*product.count
                  if (product.currency == "UYU") {
                    totalCost = totalCost/42;
                    totalCost=parseInt(totalCost);
                    totalCostUSD += totalCost;
                  }
                  else{
                    totalCostUSD += totalCost;
                  }
                  
                   
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
                         USD ${totalCost}
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
               Subtotal en USD: $ ${totalCostUSD}
             </p>
             <p>
                Costo de envío: $ <span id="shipCost"></span>
             </p>
             <p>
                Total: $ <span id="totalCost"></span>
             </p>
       `
       printShipCost()
    }
}
document.addEventListener("DOMContentLoaded",()=>{
    drawCartList();
    
    document.getElementsByName("delivery").forEach((button)=>{
      button.addEventListener("click",()=>{
        printShipCost()
      })
    })
    
});