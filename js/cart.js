import { loadCart } from "./config/loadCart.js";
import { windowReplace } from "./init.js";

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
function paymentMethodSelected(){

  let inputsCard = document.getElementById("creditCardContainer").getElementsByTagName("input");
  let inputsBank = document.getElementById("bankTransferContainer").getElementsByTagName("input");

  if (document.getElementById("radio-creditCard").checked) { // cuando se le da al botón de tarjeta
    for (let i = 0; i < inputsCard.length; i++) {
      inputsCard[i].disabled=false; //se habilitan los campos (diabled=false) para tarjeta
    }
    for (let i = 0; i <inputsBank.length; i++) {
          inputsBank[i].disabled=true; //  y se deshabilitan los campos de bank 
    }
  } else if (document.getElementById("radio-bankTransfer").checked) { //cuando se le da al botón de bank
    for (let i = 0; i < inputsCard.length; i++) {
      inputsCard[i].disabled=true;  // se deshabilitan los campos de tarjeta
    }
    for (let i = 0; i <inputsBank.length; i++) {
      inputsBank[i].disabled=false; // y se habilitan los campos de bank (disabled = false)
    }
  } 
  else{
    for (let i = 0; i < inputsCard.length; i++) {
      inputsCard[i].disabled=true;  // se deshabilitan los campos de tarjeta
    }
    for (let i = 0; i <inputsBank.length; i++) {
      inputsBank[i].disabled=true; // y se habilitan los campos de bank (disabled = false)
    }
  }
  document.getElementById("bankTransferContainer").getElementsByTagName("input")[0].disabled=false;
  document.getElementById("creditCardContainer").getElementsByTagName("input")[0].disabled=false;
}
function addressValidate(){
  let street = document.getElementById("calle");
  let doorNum = document.getElementById("numeroPuerta");
  let streetCorner = document.getElementById("esquina");

  if (street.value.trim() == "") {
    alert("Por favor, no deje el campo vacío");
    street.style.border="solid 1px red";
  }
  if (doorNum.value.trim() == "") {
    
  }
  if ( streetCorner.value.trim() == "" ) {
    
  }
}
function payMethodValidate(){ //función que valida el método de pago
  let formPayMethod = document.getElementById("form-payMethod");

    if (!formPayMethod.checkValidity()) {
      document.getElementById("invalid-payMethod").style.display="block"
    }
    else{
      document.getElementById("invalid-payMethod").style.display="none"
    }
}
if (document.getElementById("paymentMethodModal")) {
  document.getElementById("paymentMethodModal").addEventListener("hidden.bs.modal",()=>{ // cuando se cierra el modal, se ejecuta la validación
    payMethodValidate();
  })
}


document.addEventListener("DOMContentLoaded",()=>{
  // Example starter JavaScript for disabling form submissions if there are invalid fields

    
    loadCart();
    drawCartList();
    paymentMethodSelected();
    document.getElementsByName("paymentMethod").forEach((button)=>{
      button.addEventListener("click",()=>{
        paymentMethodSelected();
      })
    })
    document.getElementsByName("delivery").forEach((button)=>{
      button.addEventListener("click",()=>{
        printShipCost()
      })
    })
    
    document.getElementById("btn-finalizarCompra").addEventListener("click",(event)=>{
      let formPayMethod = document.getElementById("form-payMethod");
      let form = document.getElementsByTagName("form")[0];
        if (!form.checkValidity() || !formPayMethod.checkValidity()) {
          event.preventDefault()
          event.stopPropagation()
          if (!formPayMethod.checkValidity()) {
            document.getElementById("invalid-payMethod").style.display="block"
          }
          else{
            document.getElementById("invalid-payMethod").style.display="none"
          }
        }
        else{
          document.getElementById("invalid-payMethod").style.display="none"
          alert("esta todo gucci")
        }
        formPayMethod.classList.add('was-validated')
        form.classList.add('was-validated')
      
    })
    
});