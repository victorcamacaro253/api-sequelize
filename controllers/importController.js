import userModel from "../models/userModel.js";
import fs from 'fs'
import csvParser from "csv-parser"
import path from 'path';
import xlsx from 'xlsx';
import { hash,compare } from 'bcrypt';


class Import {
    
  static importUsers = async (req, res) => {
    const filePath= req.file.path;
    const users =[]
   
      try {
        const readStream= fs.createReadStream(filePath)
        const parseStream= readStream.pipe(csvParser())
   
   
        parseStream.on('data',(row)=>{
         const hashPassword = hash(row.contraseña,10)
         users.push({
           nombre : row.nombre,
           apellido: row.apellido,
           cedula: row.cedula,
           contraseña: hashPassword,
           rol: row.rol,
           imagen: row.imagen
         })
        })
   
        await new Promise ((resolve,reject)=>{
         parseStream.on('end',resolve),
         parseStream.on('error',reject)
        })
   
        const count = await userModel.bulkCreate(users)
   
        fs.unlinkSync(filePath)
        return res.json({message:'Usuarios importados Correctamente ',count})
   
      } catch (error) {
       if(fs.existsSync(filePath)){
         fs.unlinkSync(filePath)
       }
       console.error('Error al importar usuarios:', error);
       res.status(500).json({ error: 'Error interno del servidor', details: error})
       
      }
   
     }
   //----------------------------------------------------------------------------------------------------------------------------------
    static importUsersExcel=async(req,res)=>{
     const filePath = req.file.path
     const users=[]
    const errors=[]
   
     try {
       //verfica si el archivo es Excel (XLSX O XLS)
       const extname = path.extname(filePath).toLowerCase()
       if(extname !== '.xlsx' && extname !=='.xls'){
         return res.status(400).json({error:'El archivo debe ser un archivo Excel'})
       }
   
   
       const workbook = xlsx.readFile(filePath)
       const sheetName = workbook.SheetNames[0]
       const worksheet= workbook.Sheets[sheetName]
   
       const data = xlsx.utils.sheet_to_json(worksheet)
   //console.log(data)
        // Procesar cada fila
      
   const total = data.length
   console.log(total)
       for (const row of data){
   
        
           // Verificar si el usuario ya existe por cédula
           const existingUser  = await userModel.findOne({ where: { cedula: row.cedula } });
           if (existingUser ) {
             if (existingUser ) {
               console.log(`Usuario existente: ${row.cedula}`); // Solo registrar la cédula existente
               errors.push(row.cedula)
               continue; // Omitir este usuario
           }
               continue; // Omitir este usuario
           }
         //console.log(row.contraseña)
   
         const hashPassword = await hash(row['contraseña'].toString(), 10); // Convierte la contraseña a string
         
        // const name = String(row['nombre '.trim()]).trim();
   
   const name = row['nombre '].toString().trim()
      const estatus = 'activo'
   
         users.push({
           nombre: name,
           apellido: row.apellido.trim(),
           cedula: row.cedula,
           contraseña: hashPassword,
           rol: row.rol,
           imagen: row.imagen,
           estatus:estatus
         })
   
       }
   
       
   
       // Insertar usuarios en la base de datos
       const count = await userModel.bulkCreate(users);
       const cedulasImportadas = count.map(user => user.cedula).join(', ');
   
        // Eliminar el archivo temporal
        fs.unlinkSync(filePath);
       // return res.json({ message: 'Usuarios importados correctamente', count });
       if(errors.length=== total){
         return res.status(400).json({error:'No se pudo registrar ningun usuario debido que todos ya existen en la Base de datos'})
        }else{
         return res.json({ message: `Usuarios con la cedula ${cedulasImportadas} importados correctamente`, count });
        }
            
   
     } catch (error) {
       if (fs.existsSync(filePath)) {
         fs.unlinkSync(filePath);
     }
     console.error(error)
     return res.status(500).json({error:'Error interno del servidor'})
     }
      
   
   
   }

   
}


export default Import 