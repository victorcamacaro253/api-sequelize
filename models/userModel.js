    import sequelize from "../db/db.js"
    import { Sequelize,DataTypes } from "sequelize"




        const user = sequelize.define('usuario',{

            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            nombre:{
                type: DataTypes.STRING(250),
            },
            apellido:{
                type: DataTypes.STRING(250)
            },
            cedula:{
                type: DataTypes.STRING(250),
                unique: true // Para asegurar que no haya duplicados
            },
            
            correo:{
                type: DataTypes.STRING(250),
          
            },

           
            
                contraseña:{
                    type: DataTypes.STRING(250),
                    
                }
                
        },{
            tableName: 'usuario',
            timestamps: false,
        
        },
        

        )




    export default {user}