import { hideSpinner, showSpinner } from "../init.js";
import { loadComments } from "../product-info.js";
import { getComments } from "./firebase.js";
export const loadFirebaseComments = async()=>{
    showSpinner();

    let comments = await getComments(localStorage.getItem("productId"));
    if (comments) {
            localStorage.setItem("comments",JSON.stringify(comments));
    }
    else{
        localStorage.setItem("comments","{}")
    }
    loadComments();
    hideSpinner();
}