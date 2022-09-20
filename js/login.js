
function cerrarSesion(){
        document.getElementById("btn-cerrarSesion").style.display = "none";
        document.getElementById("userName").innerHTML = "";
      document.getElementById("boxCart").getElementsByTagName("strong")[0].innerHTML =  "0";
        localStorage.removeItem("session");
        localStorage.removeItem("userName");
        localStorage.removeItem("catID");
        drawCart();
        login();
    }


document.addEventListener("DOMContentLoaded", function(){

  if(localStorage.getItem("session")){
    document.getElementById("btn-cerrarSesion").style.display = "inline-block";
    document.getElementById("userName").innerHTML = localStorage.getItem("userName");   
  }
  else{
    login();
  }
})


function login() {
  document.getElementsByTagName("html")[0].classList.add("overflow-hidden");
  const btnCerrarSesion = document.getElementById("btn-cerrarSesion");
  const avisoExito =document.getElementById("alerta-aviso-exito");  
  const modalLogin = document.getElementById("modalLogin");
  const btningresar = document.getElementById("btn-ingresar");
  const navbar = document.querySelectorAll("#navbarNav a");

  modalLogin.style.display = "block"
  navbar.forEach(link => link.setAttribute('hidden', 'hidden'));

  
  do {
    if (btningresar) { // ingrese en el caso que no sea null 

      btningresar.addEventListener("click", (e) => {
        let email = document.getElementById("inputEmail").value;
        let password = document.getElementById("inputPassword").value;

        /* Validamos que haya ingresado datos en los inputs */
        if (email.trim() != "" && password.trim() != "") {
            
        
            localStorage.setItem("userName",email);
            document.getElementById("userName").innerHTML = localStorage.getItem("userName"); 
            navbar.forEach(link =>link.removeAttribute('hidden', 'hidden'));
            modalLogin.style.display = "none"; // quitamos el modal login
              avisoExito.style.display = "block"; // mostramos el cartel de login exitoso
            setTimeout(() => {
              avisoExito.style.display =
                "none"; 
            }, 3000); // quitamos el cartel de login exitoso pasados 3 segundos (3000ms)
            
            localStorage.setItem("session", true);// almacenamos en el navegador que el usuario esta logeado
            btnCerrarSesion.style.display = "inline-block"; //hacemos visible el boton "cerrar sesión"

            document.getElementsByTagName("html")[0].classList.remove("overflow-hidden");
            
            showProductInCart();
            drawCart();
            
        } else {

            document.getElementById("alerta-aviso-atencion").style.display =
              "block";
            setTimeout(() => {
              document.getElementById("alerta-aviso-atencion").style.display =
                "none";
            }, 3000);
        }
      });
    } 
  } while (localStorage.getItem("session") == "true");

}
