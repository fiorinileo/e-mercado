document.addEventListener("DOMContentLoaded",()=>{
    let credentials = JSON.parse(localStorage.getItem("credentials"));
    let userEmail = localStorage.getItem("userEmail");
    let inputName = document.getElementById("inputName");
    let inputLastname = document.getElementById("inputLastname");
    let inputEmail = document.getElementById("inputEmail");
    console.log(credentials.withGoogle);
    inputName.disabled=credentials.withGoogle
    inputLastname.disabled=credentials.withGoogle
    inputName.value = credentials.userName;
    inputLastname.value = credentials.userLastname;
    inputEmail.value = userEmail;
    
})