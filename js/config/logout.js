import { signOut } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-auth.js"
import { drawCart, windowReplace } from "../init.js";
import { auth} from "./firebase.js"

const logout = document.querySelector('#logout');

logout.addEventListener("click", async()=>{
    await signOut(auth)
        document.getElementById("userName").innerHTML = "User";
        document.getElementById("boxCart").getElementsByTagName("strong")[0].innerHTML =  "0";
        localStorage.removeItem("cart")
        localStorage.removeItem("session");
        localStorage.removeItem("userName");
        localStorage.removeItem("catID");
        drawCart();
        location.replace("./index.html")
})

window.windowReplace=windowReplace;