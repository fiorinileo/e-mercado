// Archivo que permite el logeo al sitio mediante la cuenta de google 
import { GoogleAuthProvider,signInWithPopup } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-auth.js"
import { auth, getUserName, saveUserName } from "./firebase.js"
import { loadCart } from "./loadCart.js";


const googlebtn = document.getElementById("googleLogin");
googlebtn.addEventListener("click",async ()=>{
    const provider = new GoogleAuthProvider()
        try {
            const credentials =  await signInWithPopup(auth,provider);
            localStorage.setItem('userEmail',credentials.user.email);
            splitName(credentials.user.displayName,credentials.user.email)
            bootstrap.Modal.getInstance(document.querySelector("#signinModal")).hide()
            let userName = (credentials.user.displayName).substring(0,9)+"...";
            document.getElementById("userEmail").innerHTML= `<img class="img-thumbnail" src=${credentials.user.photoURL} width="24px"> <span>${userName}</span>`;
            loadCart();
        } catch (error) {
            console.log(error);
        }

    
})
function splitName(nameGroup,email){
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
    localCredentials["userName"]=name.trim()
    localCredentials["userLastname"]=lastname.trim()
    localCredentials["withGoogle"]=true;
    localStorage.setItem("credentials",JSON.stringify(localCredentials))
    saveUserName(name,lastname,email)
}