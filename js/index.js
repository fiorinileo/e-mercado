document.addEventListener("DOMContentLoaded", function(){

    document.getElementById("autos").addEventListener("click", function() {
        localStorage.setItem("catId", 101);
        window.location = "products.html"
    });
    document.getElementById("juguetes").addEventListener("click", function() {
        localStorage.setItem("catId", 102);
        window.location = "products.html"
    });
    document.getElementById("muebles").addEventListener("click", function() {
        localStorage.setItem("catId", 103);
        window.location = "products.html"
    });
    
    
});