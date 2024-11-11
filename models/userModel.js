    import sequelize from "../db/db.js"
    import { DataTypes } from "sequelize"
    import Role from "./rolesModel.js"



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
                    
                },
                rol: {
                    type: DataTypes.INTEGER,
                    references: {
                      model: 'roles', // El nombre de la tabla referenciada
                      key: 'id' // La columna clave primaria de la tabla `roles`
                    },
                    allowNull: true // Esta columna puede ser null si el rol no es obligatorio
                  }
                
        },{
            tableName: 'usuario',
            timestamps: false,
        
        },
        

        )

// Relación: Un usuario tiene un rol
user.belongsTo(Role, { foreignKey: 'rol', as: 'role' });


    export default user