import { saveUserName, ticketLoader } from "./config/firebase.js";
import { showMessage } from "./config/showMessage.js";

document.addEventListener("DOMContentLoaded",async ()=>{
    let credentials = JSON.parse(localStorage.getItem("credentials"));
    let userEmail = localStorage.getItem("userEmail");
    let inputName = document.getElementById("inputName");
    let inputLastname = document.getElementById("inputLastname");
    let inputEmail = document.getElementById("inputEmail");
    inputName.disabled=credentials.withGoogle
    inputLastname.disabled=credentials.withGoogle
    inputName.value = credentials.userName;
    inputLastname.value = credentials.userLastname;
    inputEmail.value = userEmail;
    
    const btnSaveChanges = document.getElementById("btnSaveChanges")
    btnSaveChanges.addEventListener("click",async ()=>{
        if ( credentials.userName != inputName.value || credentials.userLastname != inputLastname.value ) {    
            if (inputName.value.length < 3) {
                showMessage("El largo del nombre no puede ser menor a 2 caracteres",false,"top","center")
            }
            else if (inputLastname.value.length <3) {
                showMessage("El largo del apellido no puede ser menor a 2 caracteres",false,"top","center")
            }
            else{
                credentials.userName =inputName.value;
                credentials.userLastname = inputLastname.value;
                localStorage.setItem("credentials",JSON.stringify(credentials))
                await saveUserName((inputName.value).toLowerCase(),(inputLastname.value).toLowerCase(),userEmail)
                showMessage("Se han guardado los cambios!",true,"top","center")
                setTimeout(() => {
                    location.reload()
                }, 1000);
            }
        }
        else{

            showMessage("No hay cambios para guardar",false,"top","center")
        }
    })
})