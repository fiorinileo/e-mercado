function drawCartList() {
    const userName = localStorage.getItem("userName");
    if (userName) {
      
      let userCart = JSON.parse(localStorage.getItem("cartUsers"))[userName];
      let cartItem= "";
      let totalCostUYU = 0;
      let totalCostUSD = 0;
      for (const article in userCart) {
                  let product = userCart[article]
                  console.log(userCart[article]+" producto")
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
                            <h4 class="col-12">
                              ${product.name}
                            </h4>
                            <p class="col-10" >
                            <span class="minorCant" onclick="chgCount(false,${article})">-</span>
                              <span>x${product.count}</span>
                            <span class="moreCant" onclick="chgCount(true,${article})">+</span>
                            </p>
                            <span onclick="deleteItemCart(${article})"class="col-2 justify-content-end d-flex p-0 pt-1"><i class="fa fa-trash" aria-hidden="true"></i></span>
                            <p class="col" >
                              ${product.currency} ${totalCost}</div>
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