//Archivo base que posee las credenciales para poder acceder a la base de datos de Firebase

// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-app.js";
import { getAuth, setPersistence, signInWithEmailAndPassword, browserSessionPersistence } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-auth.js"
import { getFirestore, addDoc,collection, setDoc, doc, getDocs,getDoc, updateDoc, deleteField } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-firestore.js"
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


export const saveCart = (userName,productId,cost,count,productName,currency) =>{
   setDoc(doc(db,"cartUsers",userName),
  {
      [productId]:{
        cost:cost,
        count:count,
        currency:currency,
        name:productName
      } 
    
  },{ merge: true })
}
export const deleteProduct = async (userName,productId)=>{
  const cart = doc(db,"cartUsers",userName);
  await updateDoc(cart, {
    [productId]: deleteField()
});
}
export const getCart = async (userName)=>{
  const docSnap= await getDoc(doc(db,"cartUsers",userName));
  if (docSnap.exists()){
    return docSnap.data();
  }
}
