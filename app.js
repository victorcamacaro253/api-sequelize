import express from "express";
import morgan from "morgan";
import cors from 'cors'
import routes from './routes/index.js'
import helmet from "helmet";
import sequelize from "./db/db.js";
import './models/associations.js'; // Import associations after models

const app =express()


app.use(express.json()); 

app.get('/',(req,res)=>{
    res.json({message:'hola mundo'})
})
app.use(cors())
app.use(helmet())
app.use(morgan('dev'))


//const csrfProtection = csrf({cookie:true})

//.use(cookieParser());
//app.use(csrfProtection);

app.use(routes)


/*app.get('/csrftoken',csrfProtection,(req,res)=>{
    //  Envia el token CSRF en una cookie llamada 'XSRF-TOKEN'
    res.cookie('XSRF-TOKEN',req.csrfToken())
    res.json({csrfToken:req.csrfToken()})
})*/

app.use((req, res, next) => {
    res.status(404).json({ message: 'Ruta no encontrada' });
  });


const PORT= process.env.PORT ?? 3010


// Sync database and start server
sequelize.sync({ force: false }).then(() => {
    app.listen(PORT, () => {
        console.log('Server is running on port 3010');
    });
});