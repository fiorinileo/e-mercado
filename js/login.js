
    /*
document.addEventListener("DOMContentLoaded", function(){
  const btningresar = document.getElementById("btn-ingresar");
  const btnCerrarSesion = document.getElementById("btn-cerrarSesion");
  const avisoExito =document.getElementById("alerta-aviso-exito");  
  const signinModal = document.getElementById("signinModal");
  const navbar = document.querySelectorAll("#navbarNav a");
  if(localStorage.getItem("session")){
    document.getElementById("btn-cerrarSesion").style.display = "inline-block";
    document.getElementById("userName").innerHTML = (localStorage.getItem("userName")).substring(0,9)+"...";   
  }
  else{
    document.getElementsByTagName("nav")[0].getElementsByTagName("div")[0].style.display = "none";
    login();
    
    
  }
  btningresar.addEventListener("click", (e) => {
    let email = document.getElementById("inputEmail").value;
    let password = document.getElementById("inputPassword").value;
    // Validamos que haya ingresado datos en los inputs 
    if (email.trim() != "" && password.trim() != "") {
      document.getElementsByTagName("nav")[0].getElementsByTagName("div")[0].style.display = "flex";
        localStorage.setItem("userName",email);
        document.getElementById("userName").innerHTML = localStorage.getItem("userName"); 
        navbar.forEach(link =>link.removeAttribute('hidden', 'hidden'));
        signinModal.style.display = "none"; // quitamos el modal login
          avisoExito.style.display = "block"; // mostramos el cartel de login exitoso
        setTimeout(() => {
          avisoExito.style.display =
            "none"; 
        }, 3000); // quitamos el cartel de login exitoso pasados 3 segundos (3000ms)
        
        localStorage.setItem("session", true);// almacenamos en el navegador que el usuario esta logeado
        btnCerrarSesion.style.display = "inline-block"; //hacemos visible el boton "cerrar sesión"

        if (email === "25801") {
          if ( !localStorage.getItem("cartUsers") || localStorage.getItem("cartUsers")[email] ) {
            getJSONData(CART_INFO_URL+"25801.json").then((resultObj)=>{
              if (resultObj.status == "ok") {
                let cartResponse = resultObj.data;
                let cartUsers = JSON.parse(localStorage.getItem("cartUsers"));
                if (!cartUsers) {
                  cartUsers = {}
                }
                let userCart = {};
                cartResponse.articles.forEach((article)=>{
                  let prodID = article.id
                   userCart[prodID] =  {
                                              name:article.name,
                                              count:article.count,
                                              cost:article.unitCost,
                                              currency:article.currency,
                                            }
                });
                
                cartUsers[cartResponse.user] = userCart;
                localStorage.setItem("cartUsers", JSON.stringify(cartUsers));
              }
              showProductInCart();
              drawCart();
            });
          }
          
        }
        document.getElementsByTagName("html")[0].classList.remove("overflow-hidden");
        cartUsers = JSON.parse(localStorage.getItem("cartUsers"));
        if (cartUsers) {
          showProductInCart();
          drawCart();
        }
    } else {
        document.getElementById("alerta-aviso-atencion").style.display =
          "block";
        setTimeout(() => {
          document.getElementById("alerta-aviso-atencion").style.display =
            "none";
        }, 3000);
    }
  });
})
function login() {
  document.getElementsByTagName("html")[0].classList.add("overflow-hidden");
  const signinModal = document.getElementById("signinModal");
  const navbar = document.querySelectorAll("#navbarNav a");

  signinModal.style.display = "block"
  navbar.forEach(link => link.setAttribute('hidden', 'hidden'));
    } 
 */