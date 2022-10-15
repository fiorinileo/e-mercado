// Archivo que permite el logeo al sitio mediante la cuenta de google 
import { GoogleAuthProvider,signInWithPopup } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-auth.js"
import { auth } from "./firebase.js"


const googlebtn = document.getElementById("googleLogin");
console.log("carga google");
googlebtn.addEventListener("click",async ()=>{
    const provider = new GoogleAuthProvider()
        try {
            const credentials =  await signInWithPopup(auth,provider);
            bootstrap.Modal.getInstance(document.querySelector("#signinModal")).hide()
            console.log(credentials.user.displayName);
        } catch (error) {
            console.log(error);
        }

    
})