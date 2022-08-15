import express from "express";
import morgan from "morgan";
// importamos el metodo Server y lo renombramos para que no choche con el servidor que creamos con express
import { Server as Socketserver } from "socket.io";
//importamos el metodo http para generar un servidor que reconozca socket.io( un servidor http)
import http from 'http';
import cors from 'cors';
//creamos con stas importaciones el __dirname para servir archivos estaticos 
import {dirname, join} from "path";
import { fileURLToPath } from "url";

import { PORT } from "./config.js";

//! todo lo creado lo guardamos en variables app(express);server(http.createServer);io(nreSocket.io)

// creamos un servidor con express y le asignamos la variable app
const app = express();
// guardamos la direccion de nuestros archivos en una costante si la mostramos por consola vemos la direccion de nuestro proyecto o codigo fuente
const __dirname = dirname( fileURLToPath(import.meta.url));
console.log(__dirname);
// utilizamos el metodo http con su funcion createServer y le pasamos como parametro el servidor creado con express asi lo convertimos en un servidor http
const server = http.createServer(app);
// utilizamos el metodo servidor de socket.io al cual le pasamos el servidor convertido con http
const io = new Socketserver(server,{
    cors:{
        origin: 'http://localhost:3000',
    }
});

app.use(cors());
app.use(morgan('dev'));

io.on('connection', (socket) => {
    console.log(socket.id);
    console.log('Un usuario conectado');
    // el que escucha el evento tiene la funcion on y el que mite el veento emit!! todo con nuestra coneccion socket
    //socket.on('nombre utilizado al emitir el parametro', funcion(){}) un nombre y una funcion
    socket.on('mensaje', (mensaje) =>{
        console.log(mensaje);
        //ahora emitimos el mensaje resivido al resto de los clientes 
        //socket.broadcast.emit(emite el mensaje a todos los otros lcientes)
        socket.broadcast.emit('mensaje', {
            body: mensaje,
            from: socket.id
        });
        //envio un objeto con el mensaje como cuerpo y el from seria el socket.id
    });
});

app.use(express.static(join(__dirname, "../client/build")));

// como pasamos el servidor a un servidor http ya dejo de ser app quien usa o arranca nuestro servidor sino que ahora se llama server 
server.listen(PORT);
console.log("Servidor en el puerto", PORT);