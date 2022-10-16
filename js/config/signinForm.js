import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-auth.js"
import { drawCart } from "../init.js";
import { auth } from "./firebase.js"
import { loadCart } from "./loadCart.js";

const signinForm = document.querySelector("#signin-Form");

signinForm.addEventListener("submit", async (e)=>{
    e.preventDefault();

    const email = signinForm["signin-email"].value;
    const password = signinForm["signin-password"].value;
    
    try {
        await signInWithEmailAndPassword(auth,email,password);
        document.getElementById("userName").innerHTML=email.substring(0,9)+"...";
        localStorage.setItem('userName',email);
        bootstrap.Modal.getInstance(document.querySelector("#signinModal")).hide()
        loadCart()
    } catch (error) {
        if (error.code=="auth/wrong-password") {
            alert("contraseña erronea")
        }
        else if (error.code=="auth/user-not-found") {
            alert("usuario erroneo")

        }
        console.log(error);
    }
})