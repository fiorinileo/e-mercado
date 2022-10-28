import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-auth.js"
import { auth } from "./firebase.js"

const signupForm = document.querySelector("#signup-form")
signupForm.addEventListener("submit",async (e)=>{
    e.preventDefault();
    let email =  signupForm['signup-email'].value;
    let password = signupForm['signup-password'].value;

    try { 
        const userCredentials = await createUserWithEmailAndPassword(auth, email, password);
        console.log(userCredentials);
        
        const signupModal = document.querySelector("#signupModal")
        bootstrap.Modal.getInstance(signupModal).hide()
        /*  Logeamos automaticamente al usuario*/
        await signInWithEmailAndPassword(auth,email,password);
        document.getElementById("userName").innerHTML=email.substring(0,9)+"...";
        localStorage.setItem('userName',email);
        bootstrap.Modal.getInstance(document.querySelector("#signinModal")).hide()
        loadCart()
    } catch (error) {
        console.log(error);
    }

})