import { signOut } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-auth.js"
import { drawCart, windowReplace } from "../init.js";
import { auth} from "./firebase.js"

const logout = document.querySelector('#logout');

logout.addEventListener("click", async()=>{ //Agregamos un evento de escucha la botón de cerrar sesion
    await signOut(auth) //cerramos su sesion en Firebase
        document.getElementById("userEmail").innerHTML = "User"; // Seteamos el nombre de usuario en el navbar por "user" (genérico)
        document.getElementById("boxCart").getElementsByTagName("strong")[0].innerHTML =  "0"; // articulos del carrito en 0
        //Removemos todos los elementos del LocalStorage que almacenen información sobre el usuario
        localStorage.removeItem("cart") 
        localStorage.removeItem("session");
        localStorage.removeItem("userEmail");
        localStorage.removeItem("catID");
        localStorage.removeItem("credentials")
        
        drawCart(); //Ejecutamos la función de dibujar el carrito para que se muestre carrito vacío (aunque posteriormente lo ocultemos del navbar y no se pueda acceder a él)
        location.replace("./index.html") // redirigimos al index para que no se quedé en páginas que solo lo puedan hacer usuarios logeado
})

window.windowReplace=windowReplace;