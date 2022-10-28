// Función que cargará únicamente el carrito del usuario logeado en Local Storage

import { getCart } from "./firebase.js"
import { drawCart, hideSpinner, showSpinner } from "../init.js";
import { drawCartList } from "../cart.js";

export const loadCart = async()=>{

    showSpinner();
    let cart = await getCart(localStorage.getItem("userName"));
    if (cart) {   
        localStorage.setItem("cart",JSON.stringify(cart));
    }
    drawCart()
    hideSpinner();
}
window.drawCartList = drawCartList;