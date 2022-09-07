const CATEGORIES_URL = "https://japceibal.github.io/emercado-api/cats/cat.json";
const PUBLISH_PRODUCT_URL = "https://japceibal.github.io/emercado-api/sell/publish.json";
const PRODUCTS_URL = "https://japceibal.github.io/emercado-api/cats_products/";
const PRODUCT_INFO_URL = "https://japceibal.github.io/emercado-api/products/";
const PRODUCT_INFO_COMMENTS_URL = "https://japceibal.github.io/emercado-api/products_comments/";
const CART_INFO_URL = "https://japceibal.github.io/emercado-api/user_cart/";
const CART_BUY_URL = "https://japceibal.github.io/emercado-api/cart/buy.json";
const EXT_TYPE = ".json";

let showSpinner = function(){
  document.getElementById("spinner-wrapper").style.display = "block";
}

let hideSpinner = function(){
  document.getElementById("spinner-wrapper").style.display = "none";
}

let getJSONData = function(url){
    let result = {};
    showSpinner();
    return fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }else{
        throw Error(response.statusText);
      }
    })
    .then(function(response) {
          result.status = 'ok';
          result.data = response;
          hideSpinner();
          return result;
    })
    .catch(function(error) {
        result.status = 'error';
        result.data = error;
        hideSpinner();
        return result;
    });
}

/* 
  result{
    status:'ok';
    data:{
        "product": 50921,
        "score": 3,
        "description": "Ya llevo un año con este auto y la verdad que tiene sus ventajas y desventajas",
        "user": "juan_pedro",
        "dateTime": "2020-02-25 18:03:52"
    },
    {
        "product": 50921,
        "score": 5,
        "description": "Es un auto muy cómodo y en relación precio/calidad vale la pena!",
        "user": "maria_sanchez",
        "dateTime": "2020-01-17 13:42:18"
    },
    {
        "product": 50921,
        "score": 4,
        "description": "Casi todo bien!, excepto por algún detalle de gusto personal",
        "user": "paola_perez",
        "dateTime": "2020-03-14 09:05:13"
    },
    {
        "product": 50921,
        "score": 5,
        "description": "Un espectáculo el auto!",
        "user": "gustavo_trelles",
        "dateTime": "2020-02-21 15:05:22"
    };
  }

*/