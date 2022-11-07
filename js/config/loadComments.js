import { hideSpinner, showSpinner } from "../init.js";
import { loadComments } from "../product-info.js";
import { getComments } from "./firebase.js";
export const loadFirebaseComments = async()=>{ //Función que carga todos los comentarios realizados a un producto al LocalStorage
    showSpinner();
    let comments = await getComments(localStorage.getItem("productId")); //obtenemos el objeto comentario sobre un producto en especifico
    if (comments) { //si el objeto existe en Firebase (si hay comentarios) los cargamos al LocalStorage
            localStorage.setItem("comments",JSON.stringify(comments));
    }
    else{ //sino existen seteamos un objeto vacío para evitar errores
        localStorage.setItem("comments","{}")
    }
    loadComments(); // Ejecutamos la función que imprime los comentarios en el HTMl
    hideSpinner();
}