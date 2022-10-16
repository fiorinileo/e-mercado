// Función que cargará únicamente el carrito del usuario logeado en Local Storage

import { getCart } from "./firebase.js"
import { drawCart } from "../init.js";

export const loadCart = async()=>{
    let cart = await getCart(localStorage.getItem("userName"));
    localStorage.setItem("cart",JSON.stringify(cart));
    drawCart()
}