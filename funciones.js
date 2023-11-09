const consumirJSON = () => {
    fetch("productos.json")
        .then(respuesta => respuesta.json())
        .then(data => {
            guardarProductosLS(data); 
            renderProductos(); 
        })
        .catch(error => {
            console.log("Error al cargar productos desde el archivo JSON:", error);
        });
}

const renderProductos = () => {
    const productos = cargarProductosLS(); 
    let contenidoHTML = "";

    productos.forEach(producto => {
        contenidoHTML += `
            <div class="col-md-2 ms-5 text-center">
                <div class="card">
                    <img src="${producto.imagen}" class="card-img-top" alt="${producto.nombre}">
                    <div class="card-body">
                        <h5 class="card-title">${producto.nombre}</h5>
                        <p class="card-text">$${producto.precio}.</p>
                        <a href="#" class="btn btn-dark" onclick="agregarAlCarrito(${producto.id})">Agregar al carrito (+)</a>
                    </div>
                </div>
            </div>`;
    });

    document.getElementById("productos").innerHTML = contenidoHTML;
}

document.addEventListener("DOMContentLoaded", () => {
    consumirJSON(); 
    renderCarrito();
});




const guardarProductosLS = (productos) => {
    localStorage.setItem("productos", JSON.stringify(productos));
}

const cargarProductosLS = () => {
    return JSON.parse(localStorage.getItem("productos")) || [];
}

const vaciarCarrito = () => {
    localStorage.removeItem("carrito");
    renderCarrito();
    actualizarNumeroCarrito();
    Swal.fire({
        title: 'El carrito ha sido vaciado',

        imagewidth: 20,
        
    });
}



const renderCarrito = () => {
    const productos = cargarCarritoLS();
    let contenidoHTML = `<table class="table">`;

    productos.forEach(producto => {
        contenidoHTML += `<tr class="mt-3">
            <td> <img src="${producto.imagen}" alt="${producto.nombre}" width="120"></td> 
            <td class="align-middle">${producto.nombre}</td> 
            <td class="align-middle">$${producto.precio}</td> 
            <td class="align-middle"><img src="basura.png" alt="Eliminar" width="24" onclick="eliminarProducto(${producto.id})" </td>
        </tr>`;
    });

   document.getElementById("productosCarrito").innerHTML = `<table class="table my-4">${contenidoHTML}</table>`;

    contenidoHTML += `<tr class="align-middle">
    <td></td> 
    <td>Suma Total</td> 
    <td class="align-middle">$${sumaProductosCarrito()}</td>
    <td class="align-middle"><button type="button" class="btn btn-secondary" onclick="vaciarCarrito()">Vaciar Carrito</button></td>
</tr>`;


    contenidoHTML += '</table>'

    document.getElementById("productosCarrito").innerHTML = contenidoHTML;
    

}



const guardarCarritoLS = (carrito) => {
    localStorage.setItem("carrito", JSON.stringify(carrito));
}

const cargarCarritoLS = () => {
    return JSON.parse(localStorage.getItem("carrito")) || [];
}

const agregarAlCarrito = (id) => {
    const carrito = cargarCarritoLS();
    const producto = buscarProducto(id);
    carrito.push(producto);
    guardarCarritoLS(carrito);
    actualizarNumeroCarrito();

    console.log("estoy aca");
    Swal.fire(
        'Producto agregado al carrito',
        '¡Gracias!',
        'success'
      );

} 

const actualizarNumeroCarrito = () => {
    const carrito = cargarCarritoLS();
    const numeroCarrito = carrito.length;
    const numeroCarritoElemento = document.querySelector("#botonCarrito .numero-carrito");
    numeroCarritoElemento.innerHTML = numeroCarrito;
   // document.getElementById(numero-carrito).innerHTML = numeroCarrito;
} 

document.addEventListener("DOMContentLoaded", () => {
    renderCarrito();
    

});


const buscarProducto = (id) => {
    const productos = cargarProductosLS();
    let producto = productos.find(item => item.id === id);

    return producto;
}

const estaEnElCarrito = (id) => {
    
    const productos = cargarProductosLS();
    return productos.some(item => item.id === id)

}

const cantProductosCarrito = () => {
    const carrito = cargarCarritoLS();

    return carrito.length;
}


const sumaProductosCarrito = () => {
    const carrito = cargarCarritoLS();

    return carrito.reduce((acumulador, item) => acumulador += item.precio, 0);
}

const eliminarProducto = (id) => {
    const carrito = cargarCarritoLS();
    const nuevoCarrito = carrito.filter(item => item.id !== id);
    guardarCarritoLS(nuevoCarrito);
    renderCarrito();
    actualizarNumeroCarrito();

    Swal.fire({
        icon: 'error',
        title: 'Producto eliminado',
        text: 'El producto se quitara de tu carrito',
        
      });

}