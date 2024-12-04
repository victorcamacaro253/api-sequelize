import express, { json } from 'express';
import http from 'http';
import limiter from './middleware/rateLimiter.js';
import cors from 'cors'
import { setupWebSocket } from './services/websocketServer.js'; // Importa la función para configurar WebSocket
import routes from  './routes/index.js';
import morgan from 'morgan';


const app = express();


// Crear un servidor HTTP a partir de Express
const server = http.createServer(app);

// Configurar WebSocket
setupWebSocket(server);


app.use(cors())


app.use(limiter);
app.use(json());
app.disable('x-powered-by')

app.use(morgan('dev'))

app.get('/',(req,res)=>{
    res.json({ message : 'hola mundo' })
})


//Usa las rutas de usuarios 
app.use(routes);



const PORT = process.env.PORT ?? 3001

app.listen(PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})