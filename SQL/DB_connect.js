const dotenv = require('dotenv')
dotenv.config()

const mysql = require('mysql')
exports.DB_connect= () => {
    const connexion = mysql.createConnection({
        host: process.env.HOST,
        user: process.env.USER,
        password: process.env.PASSWORD,
        database: process.env.DATABASE
    })
    connexion.connect((error)=>{ if(error){ return error } })
    return connexion
}