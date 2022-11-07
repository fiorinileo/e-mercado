import { deleteProduct, saveUserPurchase } from "./config/firebase.js";
import { showMessage } from "./config/showMessage.js";
import { windowReplace } from "./init.js";

var totalCostUSD = 0; // variable global que almacenará el costo final de todo el carrito en USD
function printShipCost(){ // Función que imprime el costo total de la compra
      let shipCost = document.getElementById("shipCost"); //obtenemos la etiqueta donde va el costo del envío
      let totalCost = document.getElementById("totalCost") // etiqueta de costo total final

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
       else{ //si no hay ningún tipo de envío seleccionado, no se imprime ningún número
        shipCost.innerHTML = "------";
        totalCost.innerHTML = "------";
       }
}
export function drawCartList() { // Función que imprime todos los artículos en la página del carrito
  if (document.getElementById("productListCart")) { // ya que el script se ejecuta siempre, comprobamos que exista la etiqueta contenedora del carrito, cuando devuelva "true" implica que el usuario se encuentra en cart.html, por lo que ejecutamos la función
  totalCostUSD = 0;
    const cart = JSON.parse(localStorage.getItem("cart")); //obtenemos el carrito del usuario del localStorage
    if (cart) { // si existe el carrito
      let cartItem= ""; 
      for (const productId in cart) { // recorremos el carrito, artículo por artículo
                  let product = cart[productId] // separamos el artículo a trabajar
                  let totalCostProduct = product.cost*product.count // calculamos el precio del lote del artículo, según su precio y la cantidad
                  if (product.currency == "UYU") { // si el precio del artículo está en pesos uruguayos, hacemos un paso a dolar con precio fijo, y lo añadimos al costo final
                    totalCostProduct = totalCostProduct/42;
                    totalCostProduct=parseInt(totalCostProduct);
                    totalCostUSD += totalCostProduct;
                  }
                  else{ // si el precio ya se encuentra en dólares, simplemente lo añadimos al costo total
                    totalCostUSD += totalCostProduct;
                  }
                  
                   // Estructuta HTML para presentar la tarjeta del producto en el carrito
                   cartItem += `
                   <li class="row" id="id_${productId}" >
                     <div class="col-md-6 col-12 text-center" onclick="windowReplace(${productId},${product.catId})">
                           <img src=${product.image} class="img-thumbnail my-1 " style="max-height:230px;">
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
                         USD ${totalCostProduct}
                       </p>
                         </div>
                   </li>
                 `  
                 
                  const boxCart = document.getElementById("productListCart");
                  boxCart.innerHTML = "";
                  boxCart.innerHTML += cartItem
                 
                     

        } // Una vez finalizamos de recorrer el carrito y recopilar la información agregamos el precio total a la sección de Costos
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
function paymentMethodSelected(){ // Función para saber el tipo de método de pago y así desactivar o activar los campos correspondientes 
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


    if (localStorage.getItem("userEmail")) { // si el usuario se encuentra logueado
      drawCartList(); // imprimimos su carrito
      paymentMethodSelected(); // verificamos su método de pago
      
      document.getElementsByName("paymentMethod").forEach((button)=>{ //creamos un evento de escucha a cada radio de método de pago
        button.addEventListener("click",()=>{ // de esta manera generamos feedback en tiempo real
          paymentMethodSelected();
        })
      })
      document.getElementsByName("delivery").forEach((button)=>{  // seleccionamos todos los radio de tipo de envío
        button.addEventListener("click",()=>{ // le agregamos un evento de escucha junto con la función que calcula el costo
          printShipCost() // de esta manera proporcionamos feedback en tiempo real
        })
      })
      if (document.getElementById("btn-finalizarCompra")) { // si existe el botón de finalizar compra, se ejecuta =>>
        billingValidate()
      }
      
    }
    
});
export async function deleteCart(){ // Función que elimina el carrito del usuario por completo, tanto del LocalStorage como de Firebase
  let cart = JSON.parse(localStorage.getItem("cart")) // Obtenemos el carrito del LS
  let userEmail = localStorage.getItem("userEmail")// Obtenemos el usuario que está operando
  for (const productId in cart) { // recorremos el carrito
      await deleteProduct(userEmail,productId) // eliminamos ese producto de la base de datos
  } // una vez eliminados todos los productos de la base de datos
  localStorage.setItem("cart",JSON.stringify({})) // sobreescribimos el carrito del usuario del LS
}
window.windowReplace = windowReplace;