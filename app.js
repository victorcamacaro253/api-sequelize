import express from "express";
import userRoutes from  "./routes/userRoutes.js";

const app =express()


app.use(express.json()); 

app.get('/',(req,res)=>{
    res.json({message:'hola mundo'})
})

app.use(userRoutes)


const PORT= process.env.PORT ?? 3010

app.listen(PORT,()=>{
    console.log(`Running on PORT ${PORT}`)
})