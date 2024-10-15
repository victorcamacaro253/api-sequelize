import { Sequelize } from "sequelize";

const sequelize = new Sequelize('login','root','',{
    host:'localhost',
    dialect:'mysql'
})

if(sequelize){
    console.log('Conectado a la base de datos')
}
export default sequelize