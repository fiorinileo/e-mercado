export function showMessage(message,caso,gravity,position){ // Función de utilidad que nos permite mostrar mensajes personalizados en cualquier sitio
    let color;
    if (caso){
        color="var(--primary-color)";
    }else{
        color="#db4912"
    }
    
    Toastify({
        text: message,
        duration: 3000,
        destination: "#",
        newWindow: true,
        close: true,
        gravity: gravity, // `top` or `bottom`
        position: position, // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
          "margin-top":"80px",
          background: color,
        },
        onClick: function(){} // Callback after click
      }).showToast();
}