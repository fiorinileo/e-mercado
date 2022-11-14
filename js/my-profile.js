import { saveUserName } from "./config/firebase.js";
import { showMessage } from "./config/showMessage.js";
function getInputPhoto() {
    let inputPhoto = document.getElementById("inputPhoto");
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
        img.onload = async function(el) {
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
        let credentials = JSON.parse(localStorage.getItem("credentials"))
        credentials.photo = srcEncoded;
        localStorage.setItem("credentials",JSON.stringify(credentials));
        /*Now you can send "srcEncoded" to the server and
        convert it to a png o jpg. Also can send
        "el.target.name" that is the file's name.*/
        
        }
    }
}
document.addEventListener("DOMContentLoaded",async ()=>{ // una vez carga la página del perfil del usuario
    // cargamos todos sus datos desde el LS
        let credentials = JSON.parse(localStorage.getItem("credentials")); 
        let userEmail = localStorage.getItem("userEmail");
    // Obtenemos todos los campos del HTML donde se depositarán
        let inputPhoto = document.getElementById("inputPhoto");
        let inputName = document.getElementById("inputName"); 
        let inputSecondName = document.getElementById("inputSecondName");
        let inputLastname = document.getElementById("inputLastname");
        let inputSecondLastname = document.getElementById("inputSecondLastname");
        let inputEmail = document.getElementById("inputEmail");
        let inputPhone = document.getElementById("inputPhone");
        let photoChange = false;
    // Si el usuario se encuentra loguedo con google desactivamos los campos de nombre ya que no podemos alterar esos datos
        inputName.disabled=credentials.withGoogle 
        inputLastname.disabled=credentials.withGoogle
    // Mostramos los datos obtenidos en los campos
        if ( credentials.phone) {
            inputPhone.value = credentials.phone;
        }
        credentials.secondName? inputSecondName.value=credentials.secondName:{};
        credentials.secondLastname? inputSecondLastname.value=credentials.secondLastname:{};
        inputName.value = credentials.userName;
        inputLastname.value = credentials.userLastname;
        inputEmail.value = userEmail;
        let srcEncoded = credentials.photo; 
        document.querySelector('#perfilPhoto').src = credentials.photo;

    // Obtenemos el botón de guardar los cambios y le añadimos un evento de escucha
        document.getElementById("btnSaveChanges").addEventListener("click",async ()=>{
            if ( credentials.userName != inputName.value || 
                credentials.userLastname != inputLastname.value || 
                photoChange || inputPhone.value != credentials.phone ||
                inputSecondLastname.value != credentials.secondLastname || 
                inputSecondName.value != credentials.secondName) {  // en el caso de que los valores de los inputs, y las credenciales del usuario sean diferentes (HAY CAMBIOS)   
                if (inputName.value.length < 3) { // Nos aseguramos que los nuevos datos introducidos tengas un largo coherente
                    showMessage("El largo del nombre no puede ser menor a 2 caracteres",false,"top","center") 
                }
                else if (inputLastname.value.length <3) {
                    showMessage("El largo del apellido no puede ser menor a 2 caracteres",false,"top","center")
                }
                else{ // En caso de que los campos tengas 3 o más caracteres
                    // Almacenamos sus valores
                        credentials = JSON.parse(localStorage.getItem("credentials"))
                        credentials.secondLastname = inputSecondLastname.value;
                        credentials.secondName = inputSecondName.value;
                        credentials.userName =inputName.value; 
                        credentials.userLastname = inputLastname.value;
                        credentials.phone = inputPhone.value;
                        srcEncoded = credentials.photo;
                        localStorage.setItem("credentials",JSON.stringify(credentials));
                    // Lo guardamos en el LocalStorage y Firebase
                        
                        await saveUserName( (inputName.value).toLowerCase(),
                                            (inputSecondName.value).toLowerCase(),
                                            (inputLastname.value).toLowerCase(),
                                            (inputSecondLastname.value).toLowerCase(),
                                            userEmail,inputPhone.value,
                                            srcEncoded)
                    // Mostramos mensaje de cambios realziados con éxito
                        showMessage("Se han guardado los cambios!",true,"top","center")
                        
                    // Después de 1 segundo, actualizamos la página para cargar los nuevos datos en todos los sitios
                        setTimeout(() => {
                            location.reload()
                        }, 1500);
                }
            } // En el caso de que el valor de los campos y las credenciales del usuario sean iguales (NO HAY CAMBIOS)
            else{
                // Le avisamos
                    showMessage("No hay cambios para guardar",false,"top","center")
            }
        })
    //Al input file de la foto de perifl, le agregamos un evento de escucha cuando el usuario suba una imágen
        inputPhoto.addEventListener("change", async ()=>{
            await getInputPhoto();
            photoChange = true;
            credentials = JSON.parse(localStorage.getItem("credentials"))
            srcEncoded = credentials.photo;
            localStorage.setItem("credentials",JSON.stringify(credentials))
    })
})