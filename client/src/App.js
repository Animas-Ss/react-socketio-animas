import './App.css';
import io from 'socket.io-client';
import { useState, useEffect } from 'react';


const socket = io('http://localhost:4000');

function App() {

  const [mensaje, setMensaje] = useState('');
  const [mensajes, setMensajes] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault()
    //console.log(mensaje);
    //colocamos nuestra conexion con la base de datos o servidor 
    //socket.emit('nombre', valor) podemos poner el nombre que nosotros queramnos
    socket.emit('mensaje', mensaje);
    const newMensaje = {
      body: mensaje,
      from: "Yo"
    }
    setMensajes([newMensaje, ...mensajes])
    setMensaje('');
  }

  useEffect(() => {
    const reciveMensaje = (mensaje) => {
      //console.log(mensaje)
      setMensajes([mensaje, ...mensajes])
      // el mensaje se resive del backend en forma de objeto 
    }
    //escucha el mensaje que viene desde el backend no del frontend , useefect nos srive apra estar escuchando el evento de envio de mensajes 
    socket.on('mensaje', reciveMensaje)
    return () => {
      socket.off('mensaje', reciveMensaje) 
    }   
  }, [mensajes])

  return (
    <div className="h-screen bg-zinc-800 text-white flex items-center justify-center">
     <form onSubmit={handleSubmit} className="bg-zinc-900 p-10">
      <input type="text" onChange={e => setMensaje(e.target.value)} value={mensaje} className="border-2 border-zinc-500 p-2 text-black w-full"/>
      <button type='submit' className='bg-blue-500 px-3 py-2 my-2'>
        enviar
      </button>

      <ul className="h-80 overflow-y-auto">
     {mensajes.map((mensaje, index) => (
      <li key={index} className={`m-2 p-2 table text-sm rounded-md ${mensaje.from === "Yo" ? "bg-sky-700 ml-auto" : "bg-black"}`}>
        <p>{mensaje.from}:{mensaje.body}</p>
      </li>
     ))}
     </ul>
     </form>
    </div>
  );
}

export default App;
