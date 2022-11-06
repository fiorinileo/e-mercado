// Archivo que permite el logeo al sitio mediante la cuenta de google 
import { GoogleAuthProvider,signInWithPopup } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-auth.js"
import { auth, saveUserName } from "./firebase.js"
import { loadCart } from "./loadCart.js";


const googlebtn = document.getElementById("googleLogin");
if (googlebtn) {
    googlebtn.addEventListener("click",async ()=>{
        const provider = new GoogleAuthProvider()
            try {
                const credentials =  await signInWithPopup(auth,provider);
                localStorage.setItem('userEmail',credentials.user.email);
                splitName(credentials.user.displayName,credentials.user.email,credentials.user.photoURL)
                bootstrap.Modal.getInstance(document.querySelector("#signinModal")).hide()
                let userName = (credentials.user.displayName).substring(0,9)+"...";
                document.getElementById("userName").innerHTML=userName;
                document.getElementById("userEmail").getElementsByTagName("img")[0].src=credentials.user.photoURL;
                loadCart();
            } catch (error) {
                console.log(error);
            }
    
        
    })
    function splitName(nameGroup,email,photo){
        let localCredentials={};
        let flag = true
        let name = ""
        let lastname = ""
        for (let i = 0; i < nameGroup.length; i++) {
            const letra = nameGroup[i];
            if (letra == " ") {
                flag = false
            }
            if (flag) {
                name+=letra;
            }
            else{
                lastname+=letra;
            }
        }
        localCredentials["userName"]=name.trim();
        localCredentials["userLastname"]=lastname.trim();
        localCredentials["photo"]=photo;
        localCredentials["withGoogle"]=true;
        localStorage.setItem("credentials",JSON.stringify(localCredentials))
        saveUserName(name,lastname,email,photo)
    }
}