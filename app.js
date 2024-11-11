import express from "express";
import userRoutes from  "./routes/userRoutes.js";
import morgan from "morgan";
import cors from 'cors'

const app =express()


app.use(express.json()); 

app.get('/',(req,res)=>{
    res.json({message:'hola mundo'})
})

app.use(cors())
app.use(morgan('dev'))

app.use('/users',userRoutes)


const PORT= process.env.PORT ?? 3010

app.listen(PORT,()=>{
    console.log(`Running on PORT ${PORT}`)
})