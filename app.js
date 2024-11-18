import express from "express";
import userRoutes from  "./routes/userRoutes.js";
import morgan from "morgan";
import cors from 'cors'
import productsRoutes from "./routes/productsRoutes.js";
import comprasRoutes from './routes/comprasRoutes.js'
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

app.use('/users',userRoutes)
app.use('/products',productsRoutes)
app.use('/compras',comprasRoutes)




const PORT= process.env.PORT ?? 3010
/*
app.listen(PORT,()=>{
    console.log(`Running on PORT ${PORT}`)
})
    */


// Sync database and start server
sequelize.sync({ force: false }).then(() => {
    app.listen(PORT, () => {
        console.log('Server is running on port 3000');
    });
});