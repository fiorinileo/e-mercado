import { deleteProduct, saveUserPurchase } from "./config/firebase.js";
import { showMessage } from "./config/showMessage.js";
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
  if (document.getElementById("productListCart")) {
  totalCostUSD = 0;
    const cart = JSON.parse(localStorage.getItem("cart"));
    if (cart) {
      let cartItem= "";
      for (const productId in cart) {
                  let product = cart[productId]
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
                   <li class="row" id="id_${productId}" >
                     <div class="col-md-6 col-12" onclick="windowReplace(${productId},${product.catId})">
                           <img src=${product.image} class="img-thumbnail ">
                     </div>
                     
                     <div class="col-md-6 col-12 row">
                       <h4 class="col-11">
                         ${product.name}
                       </h4>
                       <span onclick="deleteItemCart(${productId})"class="col-1 justify-content-end d-flex pt-2 pe-0"><i class="fa fa-trash" aria-hidden="true"></i></span>

                       <p class="col-7">${product.currency}  ${product.cost}</p>
                       <p class="col-4" >
                         <span class="minorCant" onclick="chgCount(false,${productId})">-</span>
                         <span>x${product.count}</span>
                         <span class="moreCant" onclick="chgCount(true,${productId})">+</span>
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
             <p class="col-md-4 col-12">
              <b>Subtotal en USD:</b> $ ${totalCostUSD}
             </p>
             <p class="col-md-4 col-12">
                <b>Costo de envío:</b> $ <span id="shipCost"></span>
             </p>
             <p class="col-md-4 col-12">
              <b>Total: </b>$ <span id="totalCost"></span>
             </p>
       `
       printShipCost()
    }
  }
}
function paymentMethodSelected(){
  if (document.getElementById("productListCart")) {
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
}
function billingValidate(){ // Función que valida todos los campos de la factura electrónica
  document.getElementById("btn-finalizarCompra").addEventListener("click",(event)=>{ // una vez se ejecuta el botón comprar
    event.preventDefault() // se evita que se recargue la página
    event.stopPropagation()
    if (Object.keys(JSON.parse(localStorage.getItem("cart"))).length>0) { //  Si el carrito tiene artículos:
      // Se ejecuta =>
      let formPayMethod = document.getElementById("form-payMethod"); // traemos el formulario del modal que contiene el método de pago
      let formShipMethod = document.getElementsByTagName("form")[0];  // Traemos el formulario de metodo de envío
      formPayMethod.classList.add('was-validated')
      formShipMethod.classList.add('was-validated')
      if (!formShipMethod.checkValidity() || !formPayMethod.checkValidity()) { // si los formularios no cumplen con los campos solicitados:
        // Se ejecuta =>
        showMessage("Por favor, complete todos los campos.",false,"bottom","right");
        if (!formPayMethod.checkValidity()) { // si el formulario del modal no cumple con los requerimientos
          // se muestra un mensaje de campos invalidos
          document.getElementById("invalid-payMethod").style.display="block"
        }
        else{ // si el formulario del modal cumple con los requerimientos
           // se deja de mostrar el mensaje de campos invalidos
          document.getElementById("invalid-payMethod").style.display="none"
          
        }
      }
      else{ //si los dos formularios cumplen con los campos solicitados:
        // Se ejecuta =>
        document.getElementById("invalid-payMethod").style.display="none" // se deja de mostrar los mensajes inválidos
        showMessage("Se ha completado su pedido con EXITO!",true,"bottom","right") // se visualiza un toast con mensaje de Exito
        saveUserPurchase()
        setTimeout(() => {
          /* window.location.reload()   */
        }, 2000);
      } 
      // Se agregan a los dos formularios las clases de "was-validated" para darle feedback al usuario

    }
    else{ // Si el carrito NO contiene artículos:

      showMessage("Debes seleccionar un artículo primero",false,"top","center") // se visualiza un toast con mensaje de agregar un artículo, con link a "categories.html"
    }
    
    
  })
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
document.addEventListener("DOMContentLoaded",async ()=>{


    if (localStorage.getItem("userEmail")) {
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
      if (document.getElementById("btn-finalizarCompra")) {
        billingValidate()
      }
      
    }
    
    
});
export async function deleteCart(){
  let cart = JSON.parse(localStorage.getItem("cart"))
  let userEmail = localStorage.getItem("userEmail")

  for (const productId in cart) {
      await deleteProduct(userEmail,productId)
  }
  localStorage.setItem("cart",JSON.stringify({}))
}
window.windowReplace = windowReplace;