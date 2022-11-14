import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-auth.js"
import { auth, getUserName, saveUserName } from "./firebase.js"
import { loadCart } from "./loadCart.js";
import { showMessage } from "./showMessage.js";

const signupForm = document.querySelector("#signup-form")
if (signupForm) {
    signupForm.addEventListener("submit",async (e)=>{
        e.preventDefault();
    let email =  (signupForm['signup-email'].value).toLowerCase();
    let password = (signupForm['signup-password'].value).toLowerCase();
    let name = (signupForm['signup-name'].value).toLowerCase();
    let lastname = (signupForm['signup-lastname'].value).toLowerCase();
    if (email.value !=null && password.value  != null && name.value !=null && lastname.value  != null) {
        try { 
            const userCredentials = await createUserWithEmailAndPassword(auth, email, password);
            const signupModal = document.querySelector("#signupModal")
            bootstrap.Modal.getInstance(signupModal).hide()
            let URLphotoDefault = "https://firebasestorage.googleapis.com/v0/b/emercado-359900.appspot.com/o/img_perfil.png?alt=media&token=214661d3-8e00-4ea3-8e87-325cdd903d68";
            await saveUserName(name,"",lastname,"",email,"",URLphotoDefault)
            /*  Logeamos automaticamente al usuario*/
            await signInWithEmailAndPassword(auth,email,password);
            document.getElementById("userName").innerHTML=email.substring(0,9)+"...";
            document.getElementById("userEmail").getElementsByTagName("img")[0].src=URLphotoDefault
            localStorage.setItem('userEmail',email);
            await getUserName()
            if ( bootstrap.Modal.getInstance(document.querySelector("#signinModal"))) {
                bootstrap.Modal.getInstance(document.querySelector("#signinModal")).hide()
            }
            loadCart()
        } catch (error) {
            console.log(error);
            if (error.code == "auth/weak-password") {
                showMessage("Contraseña muy débil, escribe más de 6 caracteres",false,"top","center")
            }
            if (error.code == "auth/weak-password") {
                showMessage("Contraseña muy débil, escribe más de 6 caracteres",false,"top","center")
            }
            if (error.code == "auth/internal-error") {
                showMessage("Este email ya se encuentra en uso, por favor, inicia sesión con 'Sing In'",false,"top","center")
            }
            
        }
    }
    else{
        showMessage("Por favor, verifica que los campos estén correctamente",false,"top","center")
    }

})
    
}