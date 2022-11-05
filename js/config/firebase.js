//Archivo base que posee las credenciales para poder acceder a la base de datos de Firebase

import { getStorage,  ref, getDownloadURL, uploadString,uploadBytes } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-storage.js";
// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-app.js";
import { getAuth, setPersistence, signInWithEmailAndPassword, browserSessionPersistence } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-auth.js"
import { getFirestore, addDoc,collection, setDoc, doc, getDocs,getDoc, updateDoc, deleteField, deleteDoc } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-firestore.js"
import { deleteCart } from "../cart.js";
import { getJSONData, PRODUCT_INFO_URL } from "../init.js";
import { saveFirebaseComments } from "./postComments.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
      
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC4uWhBDz6xTJe4CQUv98u-oJ_QyUR3S5c",
  authDomain: "emercado-359900.firebaseapp.com",
  projectId: "emercado-359900",
  storageBucket: "emercado-359900.appspot.com",
  messagingSenderId: "723615790319",
  appId: "1:723615790319:web:fdaa67572b3245b656571a"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db= getFirestore(app);
export const storage = getStorage(app);

function dualDigits(num) {
  return parseInt(num) < 10 ? (num = "0" + num) : num;
}
export async function uploadFile(dataURL,fileName){
  const storageRef = ref(storage, '/'+fileName)
  let src;
  if (dataURL.type !== "image/jpeg" ) {
    src = dataURL.dataURL.substring(23)
  }
  else{
    src = dataURL.dataURL.substring(22)
  }
  let data=b64toBlob(src,dataURL.type)
  let snapshot = await uploadBytes(storageRef,data)
}
function b64toBlob(b64Data, contentType, sliceSize) {
  contentType = contentType || "";
  sliceSize = sliceSize || 512;

  var byteCharacters = atob(b64Data);
  var byteArrays = [];

  for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    var slice = byteCharacters.slice(offset, offset + sliceSize);

    var byteNumbers = new Array(slice.length);
    for (var i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    var byteArray = new Uint8Array(byteNumbers);

    byteArrays.push(byteArray);
  }


  return new File(byteArrays, "pot", { type: contentType });
}
export const firebaseGetImage= async (imageName)=>{ // Función para obtener la URL de una imagen pasandole el nombre como parametro
  const pathReference = ref(storage,imageName);
  let urlObj = await getDownloadURL(pathReference)
  let url =JSON.stringify(urlObj);
  return url;
  
  

}
export const saveCart =  async (userEmail,productId,cost,count,productName,currency,image,catId) =>{
  let docData={
      cost:cost,
      count:count,
      currency:currency,
      name:productName,
      image:image,
      catId:catId,
};
  let ruta= doc(db,"usersInfo/"+userEmail+"/cartUser/"+productId);
  await setDoc(ruta,docData);
} 
export const deleteProduct = async (userEmail,productId)=>{
  let ruta= doc(db,"usersInfo/"+userEmail+"/cartUser/"+productId);
  await deleteDoc(ruta);
}
export const getCart = async (userEmail)=>{
  let cart = {}
  const querySnapshot = await getDocs(collection(db, "usersInfo",userEmail,"cartUser"));
  if (querySnapshot) {
    querySnapshot.forEach((product) => {
      cart[product.id]=product.data()
    });
  }
  return cart
}
/* Función para guardar comentarios en Firebase */
export const saveComment = async (userName,score,description,dateTime,productId,commentId) =>{
  await setDoc(doc(db,"comments","comments_"+productId),
 {
     [commentId]:{userName,score,description,dateTime} 
   
 },{ merge: true })
}
/*Función para traer comentarios de Firebase*/
export const getComments = async (productId)=>{
  const docSnap= await getDoc(doc(db,"comments","comments_"+productId));
  if (docSnap.exists()){
    return docSnap.data();
  }
}
export const getProductInfo = async(productId,catId)=>{
  catId ?{}: catId=  localStorage.getItem("catId");
  let categoryInfo = await getCategorieInfo(catId)
  return categoryInfo.products[productId];
}
export const saveProductInfo = async (catId,product) =>{

  await setDoc(doc(db,"catInfo","catId_"+catId+"/products/products"),
  product,{ merge: true })
}
// almacena el carrito del usuario, en su historial de compras una vez la confirma
export const saveUserPurchase = async () =>{
  let date = new Date();
  let purchaseDate =
      date.getFullYear() +
      "-" +
      (parseInt(dualDigits(date.getMonth())) + 1) +
      "-" +
      dualDigits(date.getDate())+
      " " +
      dualDigits(date.getHours()) +
      ":" +
      dualDigits(date.getMinutes());
 
  let paymentMethod ="Credit Card" // El método de pago comienza teniendo el valor de tarjeta de credito
  document.getElementById("radio-bankTransfer").checked ? paymentMethod = "Bank Transfer":{}; // si está checkeado el campo de banco, se cambia a transferencia bancaria
  let shipType;
  if (document.getElementById("Premium").checked) {
    shipType = "Premium"
  }
  else if (document.getElementById("Express").checked){
    shipType="Express"
  }
  else{
    shipType="Standard"
  }

  let cart = JSON.parse(localStorage.getItem("cart")) // traemos el carrito del usuario
  let billingInfo = {
    street: document.getElementById("calle").value,
    doorNum: document.getElementById("numeroPuerta").value,
    corner: document.getElementById("esquina").value,
    payMethod:paymentMethod ,
    shipType:shipType,
    date:purchaseDate,
  } 
  let ticket = {}
  ticket["billingInfo"]= billingInfo;
  ticket["cart"]= cart;
  saveSoldProduct(cart) // Función que se encarga de modificar y guardar la cantidad de productos vendidos en Firebase
  let userEmail = localStorage.getItem("userEmail") 
  let totalPurchases = await getDocs(collection(db,"usersInfo/"+userEmail+"/purchases"))
  let ruta=doc(collection(db,"usersInfo",userEmail,"purchases"),"ticket_"+totalPurchases.docs.length);
  await setDoc(ruta,ticket,{merge:true});
  await deleteCart();
  location.reload()
  
}
const saveSoldProduct = async (cart)=>{
  for (const productId in cart) {
      const product = cart[productId]; // obtenemos los productos individualmente del carrito
      let catId = product.catId; // Obtenemos la categoria a la que pertenecen 
      let productsOfCategory = await getProductsOfCategory(catId); // Traemos toda la información de esa categoria
      let previusSoldCount  = productsOfCategory[productId].soldCount // Traemos la cantidad previa artículos de vendidos del artículo que estamos trabajando
      let cartSoldCount = cart[productId].count // Separamos la cantidad que el usuario desea comprar
      let newSoldCount = previusSoldCount+cartSoldCount; // sumamos esas dos cantidades en NewSoldCount
      productsOfCategory[productId].soldCount=newSoldCount;
      const docRef = doc(collection(db,"catInfo/catId_"+catId+"/products"),"products");
      await updateDoc(docRef,productsOfCategory,{merge:true});
  }

}
export const saveUserName = async (name,lastname,email,photo)=>{
  let credentials = {
    userName:name,
    userLastname:lastname,
    photo:photo,
  }
  let ruta= doc(db,"usersInfo/"+email); 
  setDoc(ruta,credentials)
  return 
}
export const getUserName = async ()=>{
  let userEmail = localStorage.getItem("userEmail")
  let credentials = {}
  const querySnapshot = await getDoc(doc(db, "usersInfo/"+userEmail));
  credentials = querySnapshot.data()
  credentials["withGoogle"]=false;
  localStorage.setItem("credentials",JSON.stringify(credentials))
  document.getElementById("userName").innerHTML=(credentials.userName+" "+credentials.userLastname).substring(0,9)+"...";
  document.getElementById("userEmail").getElementsByTagName("img")[0].src=credentials.photo;

}
export const saveCategorieInfo = async (catGroup) =>{
  
  let catId = localStorage.getItem("catId");
  let catName;
  let catInfo ={}
  let catProducts = {};
  if (null) { // Si la categoria tiene productos =>
    for  (const productId in catGroup) { // Recorremos la categoria 
      const product = catGroup[productId]; // Guardamos el producto de este ciclo
       
      let relatedProducts =  await getJSONData(PRODUCT_INFO_URL+productId+".json")
      relatedProducts=relatedProducts.data.relatedProducts // Guardamos el array de productos relacionados
      for (let i = 0; i < relatedProducts.length; i++) { // Recorremos el array de productos relacionados
        let relatedProduct = relatedProducts[i];
        let categoryOfRelatedProduct;
        for (let i = 101; i < 109; i++) {
          let respuesta = await categoryOf(relatedProduct.id,i)
          if (respuesta) {
            categoryOfRelatedProduct = respuesta
            catName = await getCategorieInfo(categoryOfRelatedProduct)
            catName = catName.name;
          }
             // Averiguamos la categoria del producto relacionado
        }
        let imageURL = await firebaseGetImage("prod"+relatedProduct.id+"_1.jpg")
          catId = product.catId;
          relatedProduct["catId"] = categoryOfRelatedProduct; // le agregamos un atributo al producto relacionado, que es la categoría a la que pertenece
          relatedProduct["image"] = imageURL;

      }// Fin de recorrer el array de productos relacionados

      let imagesProduct = [];
      for (let i = 0; i < 4; i++) {
        let imageURL = await firebaseGetImage("prod"+product.id+"_"+(i+1)+".jpg")
        imagesProduct.push(imageURL)
      }
      catProducts[product.id]= {
        catId:product.catId,
        id:product.id,
        name:product.name,
        description:product.description,
        cost:product.cost,
        currency:product.currency,
        soldCount:product.soldCount,
        images:imagesProduct,
        stock:undefined,
        relatedProducts:relatedProducts,
      }
    
    }// Fin recorrer categoria
    let imgSrc = await firebaseGetImage("cat"+catId+"_1.jpg")
    catInfo= {
      productCount: Object.keys(catProducts).length,
      id:catId,
      name:catName,
      imgSrc: imgSrc,
    }
    await setDoc(doc(db,"catInfo","catId_"+catId),
    catInfo,{ merge: true })
    await setDoc(doc(db,"catInfo","catId_"+catId+"/products/products"),
    catProducts,{ merge: true })
  }
  else{
    await getJSONData("https://japceibal.github.io/emercado-api/cats_products/"+catId+".json")
    .then(async (resultObj)=>{
      if (resultObj.status === "ok"){
        let currentProductsArray = resultObj.data;
        for  (let i = 0; i < currentProductsArray.products.length; i++) { // Recorremos la categoria 
          const product = currentProductsArray.products[i]; // Guardamos el producto de este ciclo
          console.log(product);
          const productId = String(catId)+(i+1)
          let relatedProducts =  await getJSONData(PRODUCT_INFO_URL+product.id+".json")
          relatedProducts=relatedProducts.data.relatedProducts // Guardamos el array de productos relacionados
          /* relatedProducts = [] */
          for (let i = 0; i < relatedProducts.length; i++) { // Recorremos el array de productos relacionados
            let relatedProduct = relatedProducts[i];
            let categoryOfRelatedProduct;
            for (let i = 101; i < 109; i++) {
              let respuesta = await categoryOf(relatedProduct.id,i)
              if (respuesta) {
                categoryOfRelatedProduct = respuesta
              }
                 // Averiguamos la categoria del producto relacionado
            }
            console.log(categoryOfRelatedProduct);
            console.log(relatedProduct);
            let productIndex = String(relatedProduct.id).substring(4)
            let relatedProductId = String(categoryOfRelatedProduct)+String(productIndex)
            console.log("relatedProductId"+relatedProductId);
            let imageURL = await firebaseGetImage("prod"+relatedProductId+"_1.jpg")
              relatedProduct["catId"] = categoryOfRelatedProduct; // le agregamos un atributo al producto relacionado, que es la categoría a la que pertenece
              relatedProduct["image"] = imageURL;
              relatedProduct.id=relatedProductId;
    
          }// Fin de recorrer el array de productos relacionados
          
          await saveFirebaseComments(product.id,productId);
          let imagesProduct = [];
          for (let i = 0; i < 4; i++) {
            let imageURL = await firebaseGetImage("prod"+productId+"_"+(i+1)+".jpg")
            imagesProduct.push(imageURL)
          }
          catProducts[productId]= {
            catId:currentProductsArray.catID,
            id:productId,
            name:product.name,
            description:product.description,
            cost:product.cost,
            currency:product.currency,
            soldCount:product.soldCount,
            images:imagesProduct,
            relatedProducts:relatedProducts,
            stock:40,
          }
        
        }// Fin recorrer categoria
          await setDoc(doc(db,"catInfo","catId_"+catId+"/products/products"),
          catProducts,{ merge: true })

        
        
    }
    })
    
  }

}
export const saveCategorieCount = async (catId) =>{
  let categoryInfo = await getCategorieInfo(catId)
  categoryInfo.productCount += 1;
  const docRef = doc(db,"catInfo/catId_"+catId);
  await updateDoc(docRef,categoryInfo,{merge:true});
}
export const getCategoriesInfo = async()=>{
  const docSnap= await getDocs(collection(db,"catInfo"));
    return docSnap.docs;  
}
export const getProductsOfCategory = async (catId)=>{
  const docSnap = await getDoc(doc(collection(db,"catInfo/catId_"+catId+"/products"),"products"))
  return docSnap.data();
}
export const getCategorieInfo = async(catId)=>{
  const docSnap= await getDoc(doc(db,"catInfo","catId_"+catId));
  if (docSnap.exists()){
    return docSnap.data();
  }
  
}
export const categoryOf = async (productId,catId)=>{
  let categoryOfRelatedProduct;
  await getJSONData("https://japceibal.github.io/emercado-api/cats_products/"+catId+".json")
    .then(async (resultObj)=>{
      if (resultObj.status === "ok"){
        let catInfo = resultObj.data
        for (let i = 0; i < catInfo.products.length; i++) { // recorremos las categorias
          const product = catInfo.products[i]; // obtenemos todos los productos de una categoria
          if (product) { // si existen =>
              if (product.id == productId) {
                categoryOfRelatedProduct = catInfo.catID;
             }
          }
        } // Fin de recorrer categorias
      }});
      if (categoryOfRelatedProduct) {
        return categoryOfRelatedProduct;
      }
}
export const ticketLoader = async ()=>{
  let userEmail = localStorage.getItem("userEmail")
  let tickets = {}
  const querySnapshot = await getDocs(collection(db, "usersInfo",userEmail,"purchases"));
  if (querySnapshot) {
    querySnapshot.forEach((ticket) => {
      tickets["ticket_"+Object.keys(tickets).length]=ticket.data()
    });
  }
  return tickets;
}
