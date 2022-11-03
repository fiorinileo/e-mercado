import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-auth.js"
import { auth, getUserName, saveUserName } from "./firebase.js"
import { loadCart } from "./loadCart.js";

const signupForm = document.querySelector("#signup-form")
signupForm.addEventListener("submit",async (e)=>{
    e.preventDefault();
    let email =  (signupForm['signup-email'].value).toLowerCase();
    let password = (signupForm['signup-password'].value).toLowerCase();
    let name = (signupForm['signup-name'].value).toLowerCase();
    let lastname = (signupForm['signup-lastname'].value).toLowerCase();
    try { 
        const userCredentials = await createUserWithEmailAndPassword(auth, email, password);
        const signupModal = document.querySelector("#signupModal")
        bootstrap.Modal.getInstance(signupModal).hide()
        await saveUserName(name,lastname,email)
        /*  Logeamos automaticamente al usuario*/
        await signInWithEmailAndPassword(auth,email,password);
        document.getElementById("userEmail").innerHTML=email.substring(0,9)+"...";
        localStorage.setItem('userEmail',email);
        await getUserName()
        if ( bootstrap.Modal.getInstance(document.querySelector("#signinModal"))) {
            bootstrap.Modal.getInstance(document.querySelector("#signinModal")).hide()
        }
        loadCart()
    } catch (error) {
        console.log(error);
    }

})