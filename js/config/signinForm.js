import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-auth.js"
import { drawCart } from "../init.js";
import { auth, getUserName } from "./firebase.js"
import { loadCart } from "./loadCart.js";
import { showMessage } from "./showMessage.js";

const signinForm = document.querySelector("#signin-Form");
if (signinForm) {
    signinForm.addEventListener("submit", async (e)=>{
        e.preventDefault();
        const email =  (signinForm["signin-email"].value).toLowerCase();
        const password = (signinForm["signin-password"].value).toLowerCase();
        try {
            await signInWithEmailAndPassword(auth,email,password);
            localStorage.setItem('userEmail',email);
            await getUserName()
            bootstrap.Modal.getInstance(document.querySelector("#signinModal")).hide()
            loadCart()
        } catch (error) {
            if (error.code=="auth/wrong-password") {
                showMessage("Contraseña erronea.",false,"top")
            }
            else if (error.code=="auth/user-not-found") {
                showMessage("Usuario erróneo.",false,"top")
            }
            console.log(error);
        }
    })
}