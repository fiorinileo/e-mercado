//Archivo base que posee las credenciales para poder acceder a la base de datos de Firebase

import { getStorage,  ref, getDownloadURL, uploadBytes } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-storage.js";
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

export const storage = getStorage(app);
export async function uploadFile(file){
  const storageRef = ref(storage, 'icons')
  let snapshot = await uploadBytes(storageRef,file)
  console.log(snapshot);
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
  saveSoldProduct(cart) // Función que se encarga de modificar y guardar la cantidad de productos vendidos en Firebase
  let userEmail = localStorage.getItem("userEmail") 
  let totalPurchases = await getDocs(collection(db,"usersInfo/"+userEmail+"/purchases"))
  let ruta=doc(collection(db,"usersInfo",userEmail,"purchases"),"ticket_"+totalPurchases.docs.length);
  await setDoc(ruta,ticket,{merge:true});
  /* deleteCart(); */
  
}
const saveSoldProduct = async (cart)=>{
  console.log("saveSoldProduct");
  for (const productId in cart) {
      const product = cart[productId]; // obtenemos los productos individualmente del carrito
      let catId = product.catId; // Obtenemos la categoria a la que pertenecen 
      let category = await getCategorieInfo(catId); // Traemos toda la información de esa categoria
      console.log(category.products[productId]); 
      let previusSoldCount  = category.products[productId].soldCount // Traemos la cantidad previa artículos de vendidos del artículo que estamos trabajando
      let cartSoldCount = cart[productId].count // Separamos la cantidad que el usuario desea comprar
      let newSoldCount = previusSoldCount+cartSoldCount; // sumamos esas dos cantidades en NewSoldCount
      console.log(newSoldCount);
      const docRef = doc(collection(db,"catInfo/catId_"+catId+"/products"),"products");
      await updateDoc(docRef,{
          [productId]:{
            catId:catId,
            id:productId,
            name:product.name,
            cost:product.cost,
            currency:product.currency,
            soldCount:newSoldCount,
            images:"imagesProduct",
          }   
      } 
      ,{merge:true});
    
  }

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
  let catId;
  let catName;
  let catInfo ={}
  let catProducts = {};
  console.log(catGroup);
  if (catGroup) { // Si la categoria tiene productos =>
    for  (const productId in catGroup) { // Recorremos la categoria 
      const product = catGroup[productId]; // Guardamos el producto de este ciclo
      let relatedProducts =  await getJSONData(PRODUCT_INFO_URL+productId+".json")
      relatedProducts=relatedProducts.data.relatedProducts // Guardamos el array de productos relacionados
      console.log(relatedProducts);
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
        console.log(categoryOfRelatedProduct);
        let imageURL = await firebaseGetImage("prod"+relatedProduct.id+"_1.jpg")
          console.log(categoryOfRelatedProduct +" != "+ product.catId);
          console.log(relatedProduct);
          catId = product.catId;
          relatedProduct["catId"] = categoryOfRelatedProduct; // le agregamos un atributo al producto relacionado, que es la categoría a la que pertenece
          relatedProduct["image"] = imageURL;
        console.log(relatedProducts);

      }// Fin de recorrer el array de productos relacionados

      let imagesProduct = [];
      for (let i = 0; i < product.images.length; i++) {
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
        relatedProducts:relatedProducts
      }
    
    }// Fin recorrer categoria
    let imgSrc = await firebaseGetImage("cat"+catId+"_1.jpg")
    catInfo= {
      productCount: Object.keys(catProducts).length,
      id:catId,
      name:catName,
      imgSrc: imgSrc,
    }
    console.log(catInfo);
    await setDoc(doc(db,"catInfo","catId_"+catId),
    catInfo,{ merge: true })
    await setDoc(doc(db,"catInfo","catId_"+catId+"/products/products"),
    catProducts,{ merge: true })
  }
  else{
    await getJSONData("https://japceibal.github.io/emercado-api/cats_products/"+catGroup.id+".json")
    .then(async (resultObj)=>{
      if (resultObj.status === "ok"){
        let currentProductsArray = resultObj.data;
        for  (let i = 0; i < currentProductsArray.products.length; i++) { // Recorremos la categoria 
          const product = currentProductsArray.products[i]; // Guardamos el producto de este ciclo

          let relatedProducts =  await getJSONData(PRODUCT_INFO_URL+product.id+".json")
          relatedProducts=relatedProducts.data.relatedProducts // Guardamos el array de productos relacionados
          
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
            let imageURL = await firebaseGetImage("prod"+relatedProduct.id+"_1.jpg")
              console.log(categoryOfRelatedProduct +" != "+ catGroup.id);
              console.log(relatedProduct);
              relatedProduct["catId"] = categoryOfRelatedProduct; // le agregamos un atributo al producto relacionado, que es la categoría a la que pertenece
              relatedProduct["image"] = imageURL;
            console.log(relatedProducts);
    
          }// Fin de recorrer el array de productos relacionados
    
          let imagesProduct = [];
          for (let i = 0; i < 3; i++) {
            let imageURL = await firebaseGetImage("prod"+product.id+"_"+(i+1)+".jpg")
            imagesProduct.push(imageURL)
          }
          catProducts[product.id]= {
            catId:currentProductsArray.catID,
            id:product.id,
            name:product.name,
            description:product.description,
            cost:product.cost,
            currency:product.currency,
            soldCount:product.soldCount,
            images:imagesProduct,
            relatedProducts:relatedProducts
          }
        
        }// Fin recorrer categoria
          console.log(catProducts);
          await setDoc(doc(db,"catInfo","catId_"+catGroup.id+"/products/products"),
          catProducts,{ merge: true })

        
        
    }
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
  console.log(docSnap.docs);
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
        console.log(catInfo);
        for (let i = 0; i < catInfo.products.length; i++) { // recorremos las categorias
          const product = catInfo.products[i]; // obtenemos todos los productos de una categoria
          if (product) { // si existen =>
              if (product.id == productId) {
                console.log("Producto: " + productId);
                console.log("retorna Categoria: " + catInfo.catID);
                categoryOfRelatedProduct = catInfo.catID;
             }
          }
        } // Fin de recorrer categorias
      }});
      if (categoryOfRelatedProduct) {
        return categoryOfRelatedProduct;
      }
}