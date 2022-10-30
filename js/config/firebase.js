//Archivo base que posee las credenciales para poder acceder a la base de datos de Firebase

import { getStorage,  ref, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-storage.js";
// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-app.js";
import { getAuth, setPersistence, signInWithEmailAndPassword, browserSessionPersistence } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-auth.js"
import { getFirestore, addDoc,collection, setDoc, doc, getDocs,getDoc, updateDoc, deleteField, deleteDoc } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-firestore.js"
import { deleteCart } from "../cart.js";
import { getJSONData, PRODUCT_INFO_URL } from "../init.js";
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

// Initialize Cloud Storage and get a reference to the service

const storage = getStorage(app);
export const firebaseGetImage= async (imageName)=>{
  const pathReference = ref(storage,imageName);
  console.log(pathReference);
  await getDownloadURL(pathReference)
  .then((url) => {
    console.log(url);
    return url;
  })
  .catch((error) => {
    // Handle any errors
  });

}


export const saveCart =  async (userEmail,productId,cost,count,productName,currency,image) =>{
  let docData={
      cost:cost,
      count:count,
      currency:currency,
      name:productName,
      image:image
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

export const saveProductInfo = async (product) =>{

  await setDoc(doc(db,"catInfo","catId_"+catId),
  product,{ merge: true })
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
export const getUserName = async ()=>{
  let userEmail = localStorage.getItem("userEmail")
  let credentials = {}
  const querySnapshot = await getDoc(doc(db, "usersInfo/"+userEmail));
  credentials = querySnapshot.data()
  console.log(credentials);
  localStorage.setItem("credentials",JSON.stringify(credentials))
  document.getElementById("userEmail").innerHTML=(credentials.userName+" "+credentials.userLastname).substring(0,9)+"...";

}

export const saveCategorieInfo = async (catGroup) =>{
  let catInfo ={}
  let catProducts = {};
  if (catGroup.products) { // Si la categoria tiene productos =>
    for  (const productId in catGroup.products) { // Recorremos la categoria 
      const product = catGroup.products[productId]; // Guardamos el producto de este ciclo


      let relatedProducts =  await getJSONData(PRODUCT_INFO_URL+productId+".json")
      relatedProducts=relatedProducts.data.relatedProducts // Guardamos el array de productos relacionados

      for (let i = 0; i < relatedProducts.length; i++) { // Recorremos el array de productos relacionados
        let relatedProduct = relatedProducts[i];
        let categoryOfRelatedProduct = await categoryOf(relatedProduct.id)  // Averiguamos la categoria del producto relacionado

          console.log(categoryOfRelatedProduct +" != "+ catGroup.id);
          relatedProducts[i]["catId"] = categoryOfRelatedProduct; // le agregamos un atributo al producto relacionado, que es la categoría a la que pertenece
        
        console.log(relatedProducts[i]);

      }// Fin de recorrer el array de productos relacionados
      catProducts[product.id]= {
        catId:catGroup.id,
        id:product.id,
        name:product.name,
        description:product.description,
        cost:product.cost,
        currency:product.currency,
        soldCount:product.soldCount,
        images:[product.images[0],product.images[1],product.images[2],product.images[3]],
        relatedProducts:relatedProducts
      }
    
    }// Fin recorrer categoria
    catInfo= {
      id:catGroup.id,
      name:catGroup.name,
      products: catProducts
    }
    console.log(catInfo);
    await setDoc(doc(db,"catInfo","catId_"+catGroup.id),
      catInfo,{ merge: true })
  }
  else{
    catGroup.forEach(async(cat)=>{
      catInfo= {
        id:cat.id,
        name:cat.name,
        description: cat.description,
        imgSrc:cat.imgSrc
      }
      console.log(catInfo);
      await setDoc(doc(db,"catInfo","catId_"+cat.id),
      catInfo,{ merge: true })
    })
  }

}

export const saveCategorie = async (catId) =>{

  let product = "!"
  await setDoc(doc(db,"catInfo","catId_"+catId),
  product,{ merge: true })
}

export const getCategoriesInfo = async()=>{
  const docSnap= await getDocs(collection(db,"catInfo"));
    return docSnap.docs;
  
}
export const getCategorieInfo = async(catId)=>{
  const docSnap= await getDoc(doc(db,"catInfo","catId_"+catId));
  if (docSnap.exists()){
    return docSnap.data();
  }
  
}

export const categoryOf = async (productId)=>{
  let categories = await getCategoriesInfo()
  for (let i = 0; i < categories.length; i++) { // recorremos las categorias

    const products = Object.keys(categories[i].data().products); // obtenemos todos los productos de una categoria
    
    if (products) { // si existen =>
      for (let j = 0; j < products.length; j++) { // Recorremos los productos
        const product = products[j];
        
        if (product == productId) {
         return (categories[i].data().id);
        }
      }
    }
  } // Fin de recorrer categorias
}