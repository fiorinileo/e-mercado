//Archivo base que posee las credenciales para poder acceder a la base de datos de Firebase

// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-app.js";
import { getAuth, setPersistence, signInWithEmailAndPassword, browserSessionPersistence } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-auth.js"
import { getFirestore, addDoc,collection, setDoc, doc, getDocs,getDoc, updateDoc, deleteField, deleteDoc } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-firestore.js"
import { deleteCart } from "../cart.js";
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

export const saveCart =  async (userEmail,productId,cost,count,productName,currency) =>{
  let docData={
      cost:cost,
      count:count,
      currency:currency,
      name:productName
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

export const getProductInfo = async(productId)=>{
  const docSnap= await getDoc(doc(db,"productsInfo","productId_"+productId));
  if (docSnap.exists()){
    return docSnap.data();
  }
}

export const saveProductInfo = async (productId,soldCount) =>{
  await setDoc(doc(db,"productsInfo","productId_"+productId),
 {
     "soldCount":soldCount 
   
 },{ merge: true })
}

// almacena el carrito del usuario, en su historial de compras una vez la confirma
export const saveUserPurchase = async () =>{

  let paymentMethod ="Credit Card" // El método de pago comienza teniendo el valor de tarjeta de credito
  document.getElementById("radio-bankTransfer").checked ? paymentMethod = "Bank Transfer":{}; // si está checkeado el campo de banco, se cambia a transferencia bancaria

  let cart = JSON.parse(localStorage.getItem("cart")) // traemos el carrito del usuario
  let address = {
    street: document.getElementById("calle").value,
    doorNum: document.getElementById("numeroPuerta").value,
    corner: document.getElementById("esquina").value,
    payMethod:paymentMethod
  } 
  let ticket = {}
  ticket["address"]= address;
  ticket["cart"]= cart;
  let userEmail = localStorage.getItem("userEmail") 
  let totalPurchases = await getDocs(collection(db,"usersInfo/"+userEmail+"/purchases"))
  let ruta=doc(collection(db,"usersInfo",userEmail,"purchases"),"ticket_"+totalPurchases.docs.length);
  await setDoc(ruta,ticket,{merge:true});
  deleteCart();
  
}

export const saveUserName = async (name,lastname,email)=>{
  let credentials = {
    userName:name,
    userLastname:lastname
  }
  let ruta= doc(db,"usersInfo/"+email); 
  setDoc(ruta,credentials)
}