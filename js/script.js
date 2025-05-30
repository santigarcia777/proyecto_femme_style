// Función para cargar los datos del JSON
async function cargarProductos() {
    try {
        // Cargamos el JSON desde la carpeta /datos
        const respuesta = await fetch('../datos/datos.json');
        
        // Verificamos si la respuesta es correcta
        if (!respuesta.ok) {
            throw new Error(`Error HTTP: ${respuesta.status}`);
        }
        
        // Convertimos la respuesta a JSON
        const datos = await respuesta.json();
        return datos.productos;
    } catch (error) {
        console.error('Error al cargar los productos:', error);
        
        // En caso de error, mostramos un mensaje en la consola y devolvemos un array vacío
        console.log('Asegúrate de que el archivo /datos/productos.json existe y es accesible');
        return [];
    }
}

// Función para crear una card de producto que coincida con el estilo HTML existente
function crearCardProducto(producto) {
    // Crear elementos
    const cardProducto = document.createElement('div');
    cardProducto.className = 'producto'; // Cambiado a 'producto' para coincidir con el HTML
    
    // Crear enlace con imagen
    const enlaceProducto = document.createElement('a');
    enlaceProducto.href = `producto${producto.id}.html`;
    
    const imagenProducto = document.createElement('img');
    imagenProducto.src = producto.imagen || `img/card${producto.id}.png`; // Usar formato de imagen original
    imagenProducto.alt = producto.nombre;
    
    enlaceProducto.appendChild(imagenProducto);
    
    // Crear título del producto en mayúsculas
    const nombreProducto = document.createElement('h3');
    nombreProducto.textContent = producto.nombre.toUpperCase();
    
    // Crear párrafo de precio con formato específico
    const precioProducto = document.createElement('p');
    precioProducto.className = 'precio';
    precioProducto.textContent = `AHORA £${producto.precio.toFixed(2)}`;
    
    // Crear botón de compra con el mismo comportamiento
    const botonProducto = document.createElement('button');
    botonProducto.className = 'boton-comprar';
    botonProducto.textContent = 'Comprar';
    botonProducto.onclick = function() {
        location.href = `producto${producto.id}.html`;
    };
    
    // Construir la estructura de la card
    cardProducto.appendChild(enlaceProducto);
    cardProducto.appendChild(nombreProducto);
    cardProducto.appendChild(precioProducto);
    cardProducto.appendChild(botonProducto);
    
    return cardProducto;
}

// Función para mostrar todos los productos en el contenedor
async function mostrarProductos() {
    const contenedorProductos = document.querySelector('.productos'); // Seleccionar .productos en lugar de #productos-grid
    if (!contenedorProductos) {
        console.error('No se encontró el contenedor de productos con clase "productos"');
        return;
    }
    
    // Mostramos un mensaje de carga
    contenedorProductos.innerHTML = '<p>Cargando productos...</p>';
    
    const productos = await cargarProductos();
    
    // Limpiar el contenedor
    contenedorProductos.innerHTML = '';
    
    // Verificar si hay productos
    if (productos.length === 0) {
        contenedorProductos.innerHTML = '<p>No hay productos disponibles.</p>';
        return;
    }
    
    // Recorrer y añadir cada producto
    productos.forEach(producto => {
        const cardProducto = crearCardProducto(producto);
        contenedorProductos.appendChild(cardProducto);
    });
}








// Función para guardar un nuevo producto en el JSON
async function guardarNuevoProducto(producto) {
    try {
        // Validar que el producto tenga los campos requeridos
        if (!producto.nombre || !producto.descripcion || !producto.precio) {
            throw new Error('faltan camapos');
        }
        
        let productos = await cargarProductos();

        let nuevoId = productos.length > 0
            ? Math.max(...productos.map(p => p.id)) + 1
            : 1;

        const nuevoProducto = {
            id: nuevoId,
            nombre: producto.nombre,
            precio: parseFloat(producto.precio),
            imagen: producto.imagen || 'https://via.placeholder.com/300x200?text=Nuevo+Producto',
        };
        // Agregar el producto al array
        productos.push(nuevoProducto);
        
        // Guardar en localStorage para persistencia en modo desarrollo
        localStorage.setItem('productosData', JSON.stringify({ productos }));
        
        console.log('Producto guardado correctamente');

        return true;
    } catch (err) {
        console.error('Error al guardar:', err);
        alert('No se pudo guardar el producto. ' + err.message);
        return false;
    }
}

// Iniciar la app
document.addEventListener('DOMContentLoaded', () => {
    mostrarVista('catalogo');

    document.getElementById('btn-ver-productos').addEventListener('click', () => {
        mostrarVista('catalogo');
    });

    document.getElementById('btn-agregar-producto').addEventListener('click', () => {
        mostrarVista('formulario');
    });

    const form = document.getElementById('formulario-producto');
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const producto = {
            nombre: document.getElementById('nombre').value,
            precio: document.getElementById('precio').value,
            imagen: document.getElementById('imagen').value,
            
        };

        const exito = await guardarNuevoProducto(producto);
        if (exito) {
            form.reset();
            mostrarVista('catalogo');
        }
    });
});
