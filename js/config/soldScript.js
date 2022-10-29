import { getProductInfo } from "./firebase.js";


export const loadFirebaseProductInfo = async()=>{ // Obtenemos los datos almacenado en firebase de dicho producto 
    let productInfo = await getProductInfo(localStorage.getItem("productID"));
    return productInfo;
}

export const printProductSoldCount = (productInfo) =>{
    if (productInfo) {
        document.getElementById("soldCountSpan").innerHTML = "Nuevo | "+(productInfo.soldCount) +" vendidos"
    }
}