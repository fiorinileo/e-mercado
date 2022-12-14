import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-auth.js"
import { loginCheck } from "./config/loginCheck.js"
import "./config/loginCheck.js"
import "./config/signupForm.js" 
import "./config/signinForm.js" 
import "./config/googleLogin.js"
import "./config/logout.js"
import "./init.js"
import { auth } from "./config/firebase.js"

onAuthStateChanged(auth, async (user)=>{
    if (user) {
        loginCheck(user);
    } else {
        loginCheck(user);
    }
})


