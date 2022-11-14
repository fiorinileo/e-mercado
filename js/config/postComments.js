// Función que cargará los comentarios realizados por los usuarios en Local Storage sobre el producto que se está visitando

import { getJSONData, PRODUCT_INFO_COMMENTS_URL } from "../init.js"
import { saveComment } from "./firebase.js";

export const saveFirebaseComments=async(oldProductId,newProductId)=>{ //Función de apoyo creada para cambiar los ID de los productos en Firebase por los nuevos ID asi son compatibles y se muestran
   let commentsProductArray = await getJSONData(PRODUCT_INFO_COMMENTS_URL+oldProductId+".json"); // traemos todos los comentarios del json viejo
   commentsProductArray = commentsProductArray.data; // guardamos el array
   let newCommentArray = (Object.assign({},commentsProductArray))
   for (const commentId in newCommentArray) {
        const commentInfo = newCommentArray[commentId];
        await saveComment(commentInfo.user,commentInfo.score,commentInfo.description,commentInfo.dateTime,newProductId,commentId);
   }
}