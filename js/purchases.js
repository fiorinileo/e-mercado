import { ticketLoader } from "./config/firebase.js";


document.addEventListener("DOMContentLoaded",async()=>{
    var tickets = await ticketLoader()
    let ticketContainer = document.getElementById("ticketContainer")
    let HTMLListItems = `
        <li class="bg-white text-dark p-4 m-4">
            <h3>
                Aún no has realizado ninguna compra
            </h3>
            <p>
                Vuelve luego
            </p>
        </li>
    `
    if (Object.keys(tickets).length>0) {   
        console.log("Existe paaa");
        for (const ticketId in tickets) {
            const ticket = tickets[ticketId];
            let payMethod = "tarjeta de crédito o débito"
            ticket.address.payMethod == "Bank Transfer"? payMethod = "Transferencia bancaria":{};
            HTMLListItems = `
            <li class="bg-white text-dark p-3 my-4">
                <h2 class="text-center">
                    ${ticketId}
                </h2>
                <div>
                    <h3 class="d-inline">
                        Información de pago:
                    </h3>
                    <p class="d-inline">
                        Pago realizado mediante ${payMethod}
                    </p>
                </div>
                <div>
                    <button type="button" 
                        class="btn btn-primary" 
                        data-bs-toggle="modal" 
                        data-bs-target="#ticketModal" 
                        data-bs-whatever="${ticketId}"
                        >
                        Ver ${ticketId}
                    </button>
                </div>
                <ul id="cart_${ticketId}">
                
                </ul>
            </li>
        `
        ticketContainer.innerHTML += HTMLListItems
        
        }
    }
    else{
        ticketContainer.innerHTML = HTMLListItems
    }
    var ticketModal = document.getElementById('ticketModal')
    ticketModal.addEventListener('show.bs.modal', function (event) {
    // Button that triggered the modal
    var button = event.relatedTarget
    // Extract info from data-bs-* attributes
    var ticketId = button.getAttribute('data-bs-whatever')
    // If necessary, you could initiate an AJAX request here
    // and then do the updating in a callback.
    //
    // Update the modal's content.
    let cartCostContainer = document.getElementById("cartCost");
    let addressTicket = tickets[ticketId].address
    let payMethod = "tarjeta de crédito o débito"
    addressTicket.payMethod == "Bank Transfer"? payMethod = "Transferencia bancaria":{};
    let billingInfo = `
        <li>
            <div class="row">
                <p class="col-12">
                    <span class="fw-bold">Método de pago:</span> 
                </p>
                <p>
                    ${payMethod}
                </p>
            <div class="row">
                <p class="col-12">
                    <span class="fw-bold">Dirección de envío:</span>
                </p>
                <p class="col-12">
                    <span>
                        Calle: ${addressTicket.street}
                    </span>
                </p>
                <p class="col-12">
                    <span>
                       Esquina: ${addressTicket.corner}
                    </span>
                </p>
                <p class="col-12">
                    <span>
                        Número de puerta: ${addressTicket.doorNum}
                    </span>
                </p>
            </div>
        </li>
    `
    let cart = tickets[ticketId].cart
    let cartContent="";
    let totalCost=0;
    for (const productId in cart) {
            const product = cart[productId];
            if (product.currency == "UYU") {
                totalCost += product.count*(product.cost/42);
                totalCost=parseInt(totalCost);
              }
            else{
                totalCost+=product.count*product.cost;
            }
            cartContent += `
            <li>
                <h4>${product.name}</h4>
                <p>
                    <span>
                        ${product.currency} ${product.cost}
                    </span>
                    <span>
                        x${product.count} unidades
                    </span>
                    <p>
                       <span class="fw-bold"> Subtotal:</span> ${product.currency} ${product.count*product.cost}
                    </p>
                </p>
            </li>
            `
    }
    let shipCost;
    switch(addressTicket.shipType){
        case("Premium"):
            shipCost=0.15;
        break;
        case("Express"):
            shipCost=0.07;
        break;
        case("Standar"):
            shipCost=0.05;
        break;
    }
    let HTMLCost = `
            <li class="row">
                <p class="col-5 fw-bold">
                    Subtotal:
                </p>
                <p class="col-6">
                     USD ${totalCost}
                </p>
            </li>
            <li class="row">
                <p class="col-5 fw-bold">
                    Tipo de envío ${addressTicket.shipType}(${shipCost}%):
                </p>
                <p class="col-6">
                    USD ${totalCost*shipCost}
                </p>
            </li>
            <li class="row">
                <p class="col-5 fw-bold">
                    Total:
                </p>
                <p class="col-6">
                   USD ${(totalCost*shipCost)+totalCost} 
                </p>
            </li>
    `
    var modalTitle = ticketModal.querySelector('.modal-title')
    var cartList = ticketModal.querySelector('#cartList')
    let payMethodInfo = ticketModal.querySelector('#payMethodInfo')
    payMethodInfo.innerHTML = billingInfo;
    modalTitle.textContent = 'Detallado de ' + ticketId
    cartList.innerHTML = cartContent
    cartCostContainer.innerHTML = HTMLCost;
})
})