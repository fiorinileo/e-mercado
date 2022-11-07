const loggedOutLi = document.querySelectorAll(".logged-out");
const loggedInLi  = document.querySelectorAll(".logged-in");

export const loginCheck = user =>{ //Simple función que oculta los botones de "sign In","sign Up", carrito y nombre de usuario segun corresponda el estado del usuario 
    if (user) {// si el usuario existe, significa que está logueado
        loggedOutLi.forEach(li => li.style.display="none")
        loggedInLi.forEach(li => li.style.display="block")
    }
    else{
        loggedInLi.forEach(li => li.style.display="none")
        loggedOutLi.forEach(li => li.style.display="block")
    }
}