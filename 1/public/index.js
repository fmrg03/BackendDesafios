const socket = io.connect()
const sinPro = document.querySelector('#sinProd')

socket.on('productos', productos => {
    if (productos.length > 0) {
        sinPro.innerText = ''
        productos.forEach(producto => {
            const tr = document.createElement('tr')
            tr.innerHTML = `
            <td class="letrasTabla">${producto.nombre}</td>
            <td class="letrasTabla">${producto.precio}</td>
            <td><img width="150x150" src="${producto.imagen}" alt=""></td>
            `
            document.querySelector('#tablaProductos').appendChild(tr)
        })
    }
    else {
        sinPro.innerText = 'No hay Productos'
    }
})