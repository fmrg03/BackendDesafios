const express = require('express')
const app = express()
require('dotenv').config()
const normalizr = require('normalizr')
const normalizado = normalizr.normalize
const schema = normalizr.schema
const handlerbars = require('express-handlebars')
const { Server: IOServer } = require('socket.io')
const { Server: HttpServer } = require('http')
const server = new HttpServer(app)
const io = new IOServer(server)

const mensajeria = process.env.DB === 'mongodb' ? require('./daos/DaosMongo') :
    process.env.DB === 'firebase' ? require('./daos/DaosFirebase') :
        require('./daos/DaosArchivo')

const mensajes = []

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))

app.engine(
    'hbs',
    handlerbars.engine({
        extname: 'hbs',
        defaultLayout: 'index.hbs',
    })
)

app.set('view engine', 'hbs')
app.set('views', 'views')

app.get('/', (req, res) => {
    res.render('main')
})

io.on('connection', (socket) => {
    console.log('Nuevo cliente conectado')
    io.sockets.emit('mensajes', mensajes)
    socket.on('mensaje', data => {
        const hoy = new Date()
        const fecha = `${hoy.getDate()}/${hoy.getMonth() + 1}/${hoy.getFullYear()}`
        const hora = `${hoy.getHours()}:${hoy.getMinutes()}:${hoy.getSeconds()}`
        const mensaje = { ...data, fecha, hora }
        mensajes.push(mensaje)
        io.sockets.emit('mensajes', mensajes)
        mensajeria.guardar(mensaje)
    })
})

const PORT = 3000 || process.env.PORT
server.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto: ${PORT}`)
})
server.on("error", (error) => console.log(error))