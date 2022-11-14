//Archivo base que posee las credenciales y funciones CRUD para poder acceder a la base de datos de Firebase

import { getStorage,  ref, getDownloadURL,uploadBytes } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-storage.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-auth.js"
import { getFirestore,collection, setDoc, doc, getDocs,getDoc, updateDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-firestore.js"
import { deleteCart } from "../cart.js";
import { getJSONData, PRODUCT_INFO_URL } from "../init.js";
import { saveFirebaseComments } from "./postComments.js";
import { showMessage } from "./showMessage.js";

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

function dualDigits(num) { // recibe un numero como parámetro, si es menor que 10, le agrega un 0 adelante
  return parseInt(num) < 10 ? (num = "0" + num) : num;
}
function b64toBlob(b64Data, contentType, sliceSize) { // Función extraída de foros de internet ligeramente modificada recibe sus 3 parámetros y devuelve un array de bytes que es el formato que necesitamos
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
export const uploadFile = async (dataURL,fileName)=>{ // Funcion que sube una imágen Fire Storage para poder utilizarla posteriormente
  const storageRef = ref(storage, '/'+fileName) // guardamos la referencia de la imágen con su nombre
  let src; // variable que almacenará el string base64 de la imágen
  if (dataURL.type !== "image/jpeg" ) { // si el archivo es diferente a jpeg
    src = dataURL.dataURL.substring(23) // se retiran los primeros 23 caracteres de su dataURL
  }
  else{ // sino es diferente 
    src = dataURL.dataURL.substring(22) // se retiran los primeros 22 caracteres de su dataURL
  }
  let data=b64toBlob(src,dataURL.type) // luego eso se envía a la función b64toBlob, que devuelve el formato que acepta la función uploadBytes de Firease para subir archivos
  let snapshot = await uploadBytes(storageRef,data) // con el resultado se ejecuta uploadBytes y se envía ese archivo a la ruta que especificamos antes
}
export const firebaseGetImage= async (imageName)=>{ // Función para obtener la URL de una imagen pasandole el nombre como parametro
  const pathReference = ref(storage,imageName); // guardamos la referencia donde se encuentra la imágens
  let urlObj = await getDownloadURL(pathReference) // ejecutamos la funcion de Firebase con dicha referencia, y su response la almacenamos en la variable "url"
  let url =JSON.stringify(urlObj);
  return url; // retornamos la url de la imágen
}
export const saveCart =  async (userEmail,productId,cost,count,productName,currency,image,catId,stock) =>{ // Función que almacena un único producto en carrito del usuario en Firebase
  let docData={ // con los parámetros creamos el objeto del producto 
      cost:cost,
      count:count,
      currency:currency,
      name:productName,
      image:image,
      catId:catId,
      stock:stock,
};
  let ruta= doc(db,"usersInfo/"+userEmail+"/cartUser/"+productId); //creamos la ruta donde se almacenará ese producto dentro del carrito del usuario
  await setDoc(ruta,docData); // establecemos esa ruta y almacenamos en Firebase mediante la función setDoc
} 
export const deleteProduct = async (userEmail,productId)=>{ // Función que elimina un único producto del carrito del usuario en Firebase
  let ruta= doc(db,"usersInfo/"+userEmail+"/cartUser/"+productId); // Creamos la ruta donde se almacena ese artículo en Firebase
  await deleteDoc(ruta); // Eliminamos la ruta, por ende, el producto del carrito
}
export const getCart = async (userEmail)=>{ // Función que obtiene el carrito completo del usuario almacenado en Firebase
  let cart = {} // creamos el objeto cart, vacío
  const querySnapshot = await getDocs(collection(db, "usersInfo",userEmail,"cartUser")); // ejecutamos un getDocs de la ruta donde se encuentra el carrito y su response la almacenamos en una "querySnapshot"
  if (querySnapshot) { // si la "querySnapshot"(carrito) existe, lo recorremos generando cada instancia en el objeto carrito anteriormente creado
    querySnapshot.forEach((product) => {
      cart[product.id]=product.data()
    });
  }
  return cart // devolvemos el objeto cart completo
}
export const saveComment = async (userName,score,description,dateTime,productId,commentId) =>{ // Función que almacena un único comentario realizado por el usuario
  await setDoc(doc(db,"comments","comments_"+productId), // establecemos la ruta donde se almacenará dicho comentario
 {
     [commentId]:{userName,score,description,dateTime} //creamos el objeto comentario con sus parámetros y lo envíamos
   
 },{ merge: true }) // habilitamos el merge para que no hayan sobrescrituras
}
export const getComments = async (productId)=>{ // Función para traer comentarios de Firebase de un producto
  const docSnap= await getDoc(doc(db,"comments","comments_"+productId)); // establecemos la ruta donde se guardan los comentarios de ese producto
  if (docSnap.exists()){ // si existe la ruta 
    return docSnap.data(); // retornamos su respuesta
  }
}
export const getProductInfo = async(productId,catId)=>{ //Función para obtener la información de un producto
  catId ?{}: catId=  localStorage.getItem("catId"); // si catId no se pasó como parámetro, la obtenemos desde el LS,
  let categoryInfo = await getCategorieInfo(catId) // Ejecutamoos getCategorieInfo y almacenamos toda la información de esa categoría en categoryInfo
  return categoryInfo.products[productId]; //retornamos toda la información existente acerca de un producto
}
export const saveProductInfo = async (catId,product) =>{ // Función que almacena el producto que se le pase como parámetro, dentro de la categoría especificada
  await setDoc(doc(db,"catInfo","catId_"+catId+"/products/products"),
  product,{ merge: true })
}
export const saveUserPurchase = async () =>{ // almacena el carrito del usuario, en su historial de compras una vez la confirma
  let date = new Date();
  let purchaseDate = // creamos un string que almacena la fecha actual
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
  let shipType; // almacenamos el tipo de envío
  if (document.getElementById("Premium").checked) {
    shipType = "Premium"
  }
  else if (document.getElementById("Express").checked){
    shipType="Express"
  }
  else{
    shipType="Standard"
  }
  let cart = JSON.parse(localStorage.getItem("cart")) // traemos el carrito del usuario del LS
  let billingInfo = { // creamos un objeto con los datos de la compra
    street: document.getElementById("calle").value,
    doorNum: document.getElementById("numeroPuerta").value,
    corner: document.getElementById("esquina").value,
    payMethod:paymentMethod ,
    shipType:shipType,
    date:purchaseDate,
  } 
  let ticket = {} // generamos un objeto ticket con dos atributos, 
  ticket["billingInfo"]= billingInfo; //uno con la información referente a la compra
  ticket["cart"]= cart; // y otro con el carrito completo del usuario en ese momento
  saveSoldProduct(cart) // Función que se encarga de modificar y guardar la cantidad de productos vendidos en Firebase
  let userEmail = localStorage.getItem("userEmail") // extraemos el email del usuario
  let totalPurchases = await getDocs(collection(db,"usersInfo/"+userEmail+"/purchases")) // obtenemos todas la compras previas realizadas por el usuario para poder calcular el largo del array y asignarselo al ticket presente para tener un criterio a la hora de dar nombre
  let ruta=doc(collection(db,"usersInfo",userEmail,"purchases"),"ticket_"+totalPurchases.docs.length); // creamos la ruta donde se almacenara la presente compra
  await setDoc(ruta,ticket,{merge:true}); // almacenamos el objeto ticket en Firebase
  await deleteCart(); // Ejecutamos la función deleteCart para eliminar todos los carritos
  location.reload() // recargamos la página para que se refresquen todos los inputs y HTML
}
export const saveSoldProduct = async (cart)=>{ // Función que se ejecuta una vez el usuario realizó la compra para almacenar la cantidad de todos los productos vendidos en Firebase
  let hasStock = true;
  for (const productId in cart) { // recorremos el carrito del usuario
      const product = cart[productId]; // obtenemos los productos individualmente
      let catId = product.catId; // Obtenemos la categoria a la que pertenecen 
      let productsOfCategory = await getProductsOfCategory(catId); // Traemos toda la información de esa categoria
      let previusSoldCount  = productsOfCategory[productId].soldCount // Traemos la cantidad previa artículos de vendidos del artículo que estamos trabajando
      let cartSoldCount = cart[productId].count // Separamos la cantidad que el usuario desea comprar
      let newSoldCount = previusSoldCount+cartSoldCount; // sumamos esas dos cantidades en NewSoldCount
      productsOfCategory[productId].soldCount=newSoldCount; // establecemos esa cantidad resultante en el objeto de su producto, dentro de la categoria
      productsOfCategory[productId].stock = parseInt(productsOfCategory[productId].stock)-cartSoldCount; // Eliminamos el stock del producto
      if (productsOfCategory[productId].stock<0) { // Si el stock de productos resultante es menor a 0
        showMessage("No se pudo procesar su compra, el stock de: "+product.name+" es insuficiente.",false,"bottom","left");
        hasStock = false
      }
      else{
        const docRef = doc(collection(db,"catInfo/catId_"+catId+"/products"),"products"); //creamos la referencia hacia ese producto
        await updateDoc(docRef,productsOfCategory,{merge:true});// actualizamos dicho producto
      }
  }
  return hasStock;

}
export const saveUserName = async (name,secondName="",lastname,secondLastname="",email,phone="",photo="https://firebasestorage.googleapis.com/v0/b/emercado-359900.appspot.com/o/img_perfil.png?alt=media&token=214661d3-8e00-4ea3-8e87-325cdd903d68")=>{ // Función que se ejecuta una vez el usuario de logeo para almacenar sus credenciales en Firebase
  let credentials = { // creamos el objeto con las credenciales que almacenaremos
    userName:name,
    secondName:secondName,
    userLastname:lastname,
    secondLastname:secondLastname,
    photo:photo,
    phone:phone,
  }
  let ruta= doc(db,"usersInfo/"+email); //establecemos la ruta que es el email del usuario (identificador único)
  await setDoc(ruta,credentials) // seteamos sus credenciales
}
export const getUserName = async ()=>{ // Función que obtiene obtiene las credenciales desde Firebase una vez el usuario se logeó y las establece en el LocalStorage
  let userEmail = localStorage.getItem("userEmail")
  let credentials = {}
  const querySnapshot = await getDoc(doc(db, "usersInfo/"+userEmail));
  credentials = querySnapshot.data()
  credentials.withGoogle=false; // ya que se ejecuta esta finción significa que el usuario no inició sesión con google, por lo que la establecemos en false
  localStorage.setItem("credentials",JSON.stringify(credentials))
  document.getElementById("userName").innerHTML=(credentials.userName+" "+credentials.userLastname).substring(0,9)+"..."; // seteamos el nombre del usuario en el navbar
  document.getElementById("userEmail").getElementsByTagName("img")[0].src=credentials.photo; // junto con su foto de perfil

}
export const saveCategorieCount = async (catId) =>{// Función que se ejecuta una vez se ha puesto un nuevo artículo a la venta para incrementar su cantidad
  let categoryInfo = await getCategorieInfo(catId) // creamos una petición al servidor para obtener información acerca de la categoría de ese producto
  categoryInfo.productCount++; //incrementamos la cantidad de artículos en 1
  const docRef = doc(db,"catInfo/catId_"+catId);
  await updateDoc(docRef,categoryInfo,{merge:true}); // seteamos el objeto actualizado en Firebase
}
export const getCategoriesInfo = async()=>{ //Obtenemos TODAS las categorías existentes en Firebase
  const docSnap= await getDocs(collection(db,"catInfo"));
    return docSnap.docs;  
}
export const getProductsOfCategory = async (catId)=>{ // obtenemos un objeto con todos los artículos pertenecientes a una categoría 
  const docSnap = await getDoc(doc(collection(db,"catInfo/catId_"+catId+"/products"),"products"))
  return docSnap.data();
}
export const getCategorieInfo = async(catId)=>{ // Función que trae toda la información existente acerca de una categoría
  const docSnap= await getDoc(doc(db,"catInfo","catId_"+catId));
  if (docSnap.exists()){
    return docSnap.data();
  }
  
}
export const ticketLoader = async ()=>{ // Función que devuelve todas las compras realizadas por un usuario
  let userEmail = localStorage.getItem("userEmail")
  let tickets = {}
  const querySnapshot = await getDocs(collection(db, "usersInfo",userEmail,"purchases")); // obtenemos un array que contiene todas las compras
  if (querySnapshot) {
    querySnapshot.forEach((ticket) => { // pasamos el array que recibimos a objeto
      tickets["ticket_"+Object.keys(tickets).length]=ticket.data()
    });
  }
  return tickets; //devolvemos el objeto de todas las compras
}
export const saveUserSale =  async (userEmail,catId,productId,name,description,cost,currency,stock,images,status) =>{ // Función que almacena un único producto en carrito del usuario en Firebase
  let docData={
    catId:catId,
    id:productId,
    name:name,
    description:description,
    cost:cost,
    currency:currency,
    stock:stock,
    images:images,
    soldCount:0,
    status:status
  }
  let ruta= doc(db,"usersInfo/"+userEmail+"/sales/"+productId); //creamos la ruta donde se almacenará ese producto dentro del carrito del usuario
  await setDoc(ruta,docData); // establecemos esa ruta y almacenamos en Firebase mediante la función setDoc
} 