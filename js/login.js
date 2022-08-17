localStorage.getItem("session") == "false" ? 
    localStorage.setItem("session", false): 
    localStorage.setItem("session",true) ; 
    function cerrarSesion(){
        localStorage.setItem("session", false);
        document.getElementById("btn-cerrarSesion").style.display = "none";
    }


document.addEventListener("DOMContentLoaded", function(){
  if(localStorage.getItem("session") == "false" ){
    login();
  }
  else{
      document.getElementById("btn-cerrarSesion").style.display = "inline-block";
}
})


function login() {
  const btnCerrarSesion = document.getElementById("btn-cerrarSesion");
  const avisoExito =document.getElementById("alerta-aviso-exito");  
  const modalLogin = document.getElementById("modalLogin");
  const btningresar = document.getElementById("btn-ingresar");
    
  avisoExito.style.display = "none";
  modalLogin.style.display = "block";

  do {
    if (btningresar) {
      btningresar.addEventListener("click", (e) => {
        let email = document.getElementById("inputEmail").value;
        let password = document.getElementById("inputPassword").value;
        /* Validamos que haya ingresado datos en los inputs */
        if (email.trim() != "" && password.trim() != "") {
          
          modalLogin.style.display = "none"; // quitamos el modal login
          avisoExito.style.display = "block";
          setTimeout(() => {
            avisoExito.style.display =
              "none";
          }, 2000);
          localStorage.setItem("session", true);// almacenamos en el navegador que el usuario esta logeado
          btnCerrarSesion.style.display = "inline-block";
        } else {
          document.getElementById("alerta-aviso-atencion").style.display =
            "block";
          setTimeout(() => {
            document.getElementById("alerta-aviso-atencion").style.display =
              "none";
          }, 2000);
        }
      });
    } 
  } while (localStorage.getItem("session") == "true");

}
