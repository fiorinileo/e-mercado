export function showMessage(message,caso){
    let color;
    if (caso){
        color="var(--primary-color)";
    }else{
        color="#db4912"
    }
    
    Toastify({
        text: message,
        duration: 3000,
        destination: "../categories.html",
        newWindow: true,
        close: true,
        gravity: "bottom", // `top` or `bottom`
        position: "left", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
          background: color,
        },
        onClick: function(){} // Callback after click
      }).showToast();
}