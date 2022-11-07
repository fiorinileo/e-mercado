// Función que cargará únicamente el carrito del usuario logeado en Local Storage

import { getCart } from "./firebase.js"
import { drawCart, hideSpinner, showSpinner } from "../init.js";
import { drawCartList } from "../cart.js";

export const loadCart = async()=>{ // Función que trae el carrito de Firebase al localStorage
    showSpinner();
    let cart = await getCart(localStorage.getItem("userEmail"));
    if (cart) {   
        localStorage.setItem("cart",JSON.stringify(cart));
    }
    drawCart() // una vez cargado el carrito, ejecutamos la función que lo imprime en el navbar
    hideSpinner();
}
window.drawCartList = drawCartList;