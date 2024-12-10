import pkg from 'jsonwebtoken'
const {verify}= pkg

const authenticateToken = (req,res,next)=>{
    const authHeader= req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if(token == null) return res.status(401).json({error:'Token no proporcionado'})

        verify(token,process.env.JWT_SECRET,(error,user)=>{
            if(error) return res.status(403).josn({error:'Token no valido'})
                req.user = user
            next()
        })
}

export default authenticateToken