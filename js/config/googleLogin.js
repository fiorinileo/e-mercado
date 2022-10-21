// Archivo que permite el logeo al sitio mediante la cuenta de google 
import { GoogleAuthProvider,signInWithPopup } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-auth.js"
import { auth } from "./firebase.js"
import { loadCart } from "./loadCart.js";


const googlebtn = document.getElementById("googleLogin");
googlebtn.addEventListener("click",async ()=>{
    const provider = new GoogleAuthProvider()
        try {
            const credentials =  await signInWithPopup(auth,provider);
            bootstrap.Modal.getInstance(document.querySelector("#signinModal")).hide()
            document.getElementById("userName").innerHTML= `<img class="img-thumbnail" src=${credentials.user.photoURL} width="24px"> <span>${credentials.user.displayName}</span>`;
            
            localStorage.setItem('userName',credentials.user.email);
            loadCart();
        } catch (error) {
            console.log(error);
        }

    
})