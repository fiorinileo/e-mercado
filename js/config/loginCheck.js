const loggedOutLi = document.querySelectorAll(".logged-out");
const loggedInLi  = document.querySelectorAll(".logged-in");

export const loginCheck = user =>{
    if (user) {
        loggedOutLi.forEach(li => li.style.display="none")
        loggedInLi.forEach(li => li.style.display="block")
    }
    else{
        loggedInLi.forEach(li => li.style.display="none")
        loggedOutLi.forEach(li => li.style.display="block")
    }
}