import { saveUserName, ticketLoader } from "./config/firebase.js";
import { showMessage } from "./config/showMessage.js";

document.addEventListener("DOMContentLoaded",async ()=>{
    let credentials = JSON.parse(localStorage.getItem("credentials"));
    let userEmail = localStorage.getItem("userEmail");
    let inputName = document.getElementById("inputName");
    let inputLastname = document.getElementById("inputLastname");
    let inputEmail = document.getElementById("inputEmail");
    let inputPhoto = document.getElementById("inputPhoto");
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
    inputPhoto.addEventListener("change",()=>{
            //define the width to resize e.g 24px
            var resize_width = 120;//without px

            //get the image selected
            var item = inputPhoto.files[0];

            //create a FileReader
            var reader = new FileReader();

            //image turned to base64-encoded Data URI.
            reader.readAsDataURL(item);
            reader.name = item.name;//get the image's name
            reader.size = item.size; //get the image's size
            reader.onload = function(event) {
                var img = new Image();//create a image
                img.src = event.target.result;//result is base64-encoded Data URI
                img.name = "photo_"+inputEmail.value;//set name (optional)
                img.size = event.target.size;//set size (optional)
                img.onload = function(el) {
                var elem = document.createElement('canvas');//create a canvas

                //scale the image to 24 (width) and keep aspect ratio
                var scaleFactor = resize_width / el.target.width;
                elem.width = resize_width;
                elem.height = el.target.height * scaleFactor;

                //draw in canvas
                var ctx = elem.getContext('2d');
                ctx.drawImage(el.target, 0, 0, elem.width, elem.height);

                //get the base64-encoded Data URI from the resize image
                var srcEncoded = ctx.canvas.toDataURL('image/png', 1);

                //assign it to thumb src
                document.querySelector('#perfilPhoto').src = srcEncoded;
                document.querySelector('#userEmail').getElementsByTagName("img")[0].src = srcEncoded;
                saveUserName(inputName.value,inputLastname.value,inputEmail.value,srcEncoded)
                /*Now you can send "srcEncoded" to the server and
                convert it to a png o jpg. Also can send
                "el.target.name" that is the file's name.*/

                }
            }
    })
})