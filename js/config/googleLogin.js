// Archivo que permite el logeo al sitio mediante la cuenta de google 
import { GoogleAuthProvider,signInWithPopup } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-auth.js"
import { auth, getUserName, saveUserName } from "./firebase.js"
import { loadCart } from "./loadCart.js";

const googlebtn = document.getElementById("googleLogin"); //obtenemos el botón de inicio de sesion con google 

if (googlebtn) { // si botón existe en la página
    googlebtn.addEventListener("click",async ()=>{ // creamos el evento de escucha
        const provider = new GoogleAuthProvider() //obtenemos el objeto que google nos proporciona para inciar sesion
            try {
                const credentials =  await signInWithPopup(auth,provider); //logeamos al usuario con las credenciales que nos proporciona google y las guardamos
                localStorage.setItem('userEmail',credentials.user.email); // seteamos en el LocalStorage el email del usuario
                splitName(credentials.user.displayName,credentials.user.email,credentials.user.photoURL) // ejecutamos la funcion SplitName con el nombre de usuario que nos proporciona google
                bootstrap.Modal.getInstance(document.querySelector("#signinModal")).hide() //ocultamos el modal de login
                await getUserName()
                await loadCart(); // cargamos el carrito de ese usuario
            } catch (error) {
                console.log(error);
            }    
    })
    async function splitName(nameGroup,email,photo){ // Funcion que obtiene el nombre de usuario proporcionado por google y separa nombre de apellido
        let localCredentials={};
        let flag = true
        let name = ""
        let lastname = ""
        for (let i = 0; i < nameGroup.length; i++) { //recorremos el string 
            const letra = nameGroup[i];
            if (letra == " ") { // si el caracter recorrido es un espacio   
                flag = false // seteamos la flag en false, para que los posteriores caracteres vayan al apellido
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
        localStorage.setItem("credentials",JSON.stringify(localCredentials)) //creamos el objeto credentials y lo guardamos en el LocalStorage
        await saveUserName(name,lastname,email,photo) // guardamos las credenciales en Firebase
    }
}