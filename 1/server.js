const express = require('express')
const { Server: IOServer } = require('socket.io')
const { Server: HttpServer } = require('http')
const app = express()
const server = new HttpServer(app)
const io = new IOServer(server)
const { faker } = require('@faker-js/faker')

const PORT = 8080

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/api/productos-test', express.static('public'))

const generateData = (num) => {
    const productos = []
    for (let i = 0; i < num; i++) {
        productos.push({
            id: i,
            nombre: faker.commerce.productName(),
            precio: faker.commerce.price(),
            imagen: faker.image.image()
        })
    }
    return productos
}

app.get('/api/productos-test', (req, res) => {
    res.render('index')
})

io.on('connection', () => {
    console.log('Nueva conexion')
    io.sockets.emit('productos', generateData(5))

})

server.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto: ${PORT}`)
})
server.on("error", (error) => console.log(error))