const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { DB_connect } = require('../SQL/DB_connect')
const fs = require('fs')

exports.signup = (req, res, next) => {
    const connexion = DB_connect()
    connexion.query(`SELECT * FROM users WHERE email="${req.body.email}";`, (error, result_email) => {
        if (error) {
            console.error('SQL error: ', error)
            return res.status(403).json({
                error:error
            })
        }
        if (result_email.length != 0) {
            res.status(403).json({
                error: '⚠️ Already existing user! ⚠️'
            })
        }else{
            connexion.query(`SELECT * FROM users WHERE pseudo="${req.body.pseudo}";`, (error, result_pseudo) => {
                if (error) {
                    console.error('SQL error: ', error)
                    return res.status(403).json({
                        error:error
                    })
                }
                if (result_pseudo.length != 0) {
                    res.status(403).json({
                        error: '⚠️ Already existing Pseudo! ⚠️'
                    })
                }else{
                    bcrypt.hash(req.body.password, 10)
                    .then(hash => {
                        connexion.query(`INSERT INTO users (email,password,pseudo,rank) VALUES ("${req.body.email}","${hash}","${req.body.pseudo}","${"SOLDIER"}");`, (error) => {
                            if (error) {
                                console.error('❌SQL error❌: ', error);
                                return next(error);
                            }
                            res.status(201).json({
                                message: '✅ Registered user ! ✅'
                            })
                        })
                    })
                    .catch(error => res.status(500).json({
                        error: error
                    }))
                }
            })
        }
    })
}
exports.login = (req, res, next) => {
    const connexion = DB_connect()
    connexion.query(`SELECT * FROM users WHERE email="${req.body.email}"`, (error, result) => {
        if (error) {
            console.error('SQL error: ', error);
            return next(error);
        }
        if (result.length == 0) {
            return res.status(401).json({
                error: '🛑⚠️ The identifiers are wrong ! ⚠️🛑'
            })
        }
        bcrypt.compare(req.body.password, result[0].password)
            .then(valid => {
                if (!valid) {
                    return res.status(401).json({
                        error: '🛑⚠️ The identifiers are wrong ! ⚠️🛑'
                    })
                }
                return res.status(200).json({
                    message: " 🛂✔️ Logged in successfully 🟢",
                    userId:result[0].id,
                    rank: result[0].rank,
                    token: jwt.sign({
                        id: result[0].id,
                        rank: result[0].rank
                    }, "RANDOM_TOKEN_SECRET", {
                        expiresIn: '24h'
                    })
                });
            })

            .catch(error => res.status(500).json({
                error
            }))
    })

}
exports.retrieve_users = (req, res, next) => {
    const connection = DB_connect()
    connection.query('SELECT * FROM users', (error, users) => {
        if (error) {
            console.error('SQL error: ', error);
            return next(error);
        }
        return res.status(200).json({
            users
        })
    })
}
exports.retrieve_user = (req, res, next) => {
    const connection = DB_connect()
    connection.query(`SELECT * FROM users WHERE id="${req.body.id}"`, (error, user) => {
        if (error) {
            console.error('SQL error: ', error);
            return next(error);
        }
        if (user.length === 0) {
            res.status(403).json({
                error:"❓ This user does not exist! ❓"
            })
        }
        return res.status(200).json({user})
    })
}
exports.modify_pseudo = (req, res, next) => {
    const connexion = DB_connect() 
    connexion.query(`SELECT * FROM users WHERE pseudo="${req.body.pseudo}";`, (error, result) => {
        if (error) {
            console.error('SQL error: ', error)
            return res.status(403).json({
                error:error
            })
        }
        if (result.length != 0) {
            res.status(403).json({
                error: '⚠️ Already existing Pseudo! ⚠️'
            })
        }else{
            if(res.locals.currentUserId === req.body.id){
                connexion.query(`UPDATE users SET pseudo="${req.body.pseudo}" WHERE id="${req.body.id}"`, (error, result) => {
                    if(error) {
                        console.error('SQL error: ', error);
                        return next(error);
                    }
                    connexion.query(`UPDATE articles SET oldpseudo="${req.body.pseudo}" WHERE pseudo="${req.body.oldPseudo}"`, (error, result) => {
                        if(error) {
                            console.error('SQL error: ', error);
                            return next(error);
                        }
                    })
                    connexion.query(`UPDATE articles SET pseudo="${req.body.pseudo}" WHERE creatorId="${req.body.id}"`, (error, result) => {
                        if(error) {
                            console.error('SQL error: ', error);
                            return next(error);
                        }
                    })
                    connexion.query(`UPDATE comments SET pseudo="${req.body.pseudo}" WHERE creatorId="${req.body.id}"`, (error, result) => {
                        if(error) {
                            console.error('SQL error: ', error);
                            return next(error);
                        }
                    })
                    connexion.query(`UPDATE answers SET pseudo="${req.body.pseudo}" WHERE creatorId="${req.body.id}"`, (error, result) => {
                        if(error) {
                            console.error('SQL error: ', error);
                            return next(error);
                        }
                    })
                    return res.status(200).json({
                        message: "The pseudo has been modified!"
                    })
                })
            }else{
                return res.status(403).json({error:"⛔️❌🔐 !! Invalid administration authentication request! 🔐❌⛔️"})
            }
        }
    })
}
exports.modify_email = (req, res, next) => {
    const connexion = DB_connect()
    connexion.query(`SELECT * FROM users WHERE email="${req.body.Nemail}"`, (error, result) => {
        if (error) {
            console.error('SQL error: ', error);
            return next(error);
        }
        if (result.length !== 0) {
            return res.status(401).json({
                error: '⚠️ Already existing Email! ⚠️'
            })
        }
        if(res.locals.currentUserId === req.body.id){
            connexion.query(`UPDATE users SET email="${req.body.Nemail}" WHERE id="${req.body.id}"`, (error, result) => {
                if(error) {
                    console.error('SQL error: ', error);
                    return next(error);
                }
                return res.status(200).json({
                    message: "The email has been modified!"
                })
            })
        }else{
            return res.status(403).json({error:"⛔️❌🔐 !! Invalid administration authentication request! 🔐❌⛔️"})
        }
    })
}
exports.modify_pass = (req, res, next) => {
    const connexion = DB_connect() 
    connexion.query(`SELECT * FROM users WHERE id="${req.body.userId}";`, (error, result) => {
        if (error) {
            console.error('SQL error: ', error)
            return res.status(403).json({
                error:error
            })
        }
        console.log(req.body.oldPassword)
        console.log(result[0].password)
        bcrypt.compare(req.body.oldPassword, result[0].password)
        .then(valid => {
            if (!valid) {
                return res.status(401).json({
                    error: 'Password incorrect..!'
                })
            }
            bcrypt.hash(req.body.newPassword, 10)
            .then(hash => {
                if(res.locals.currentUserId === req.body.userId){
                    connexion.query(`UPDATE users SET password="${hash}" WHERE id="${req.body.userId}"`, (error, result) => {
                        if(error) {
                            console.error('SQL error: ', error);
                            return next(error);
                        }
                        return res.status(200).json({
                            message: "The password has been modified!"
                        })
                    })
                }else{
                    return res.status(403).json({error:"⛔️❌🔐 !! Invalid administration authentication request! 🔐❌⛔️"})
                }
            })
            .catch(error => res.status(500).json({
                error:`error control confirmation : ${error}`
            }))
            
        })
        .catch(error => res.status(500).json({
            error:`error control pass : ${error}`
        }))
    })
}
exports.delete_user = (req, res, next) => {
    const connexion = DB_connect() 
    connexion.query(`SELECT * FROM users WHERE email="${req.body.email}";`, (error, users) => {
        if (error) {
            console.error('SQL error: ', error)
            return next(error)
        }
        if (users.length === 0) {
            res.status(403).json({
                error:"❓ This user does not exist! ❓"
            })
        }
        if(res.locals.currentUserId === users[0].id || res.locals.userRole === "BOSS"){
            connexion.query(`SELECT * FROM articles WHERE creatorId="${users[0].id}"`,(error, articles) => {
                if (error) {
                    console.error('SQL error: ', error);
                    return next(error);
                }
                if(articles.length !== 0){
                    articles.map(article =>(
                        connexion.query(`DELETE FROM answers WHERE articleId="${article.id}"`, (error) => {
                            if (error) {
                                console.error('SQL error: ', error);
                                return next(error);
                            }
                            connexion.query(`DELETE FROM comments WHERE articleId="${article.id}"`, (error) => {
                                if (error) {
                                    console.error('SQL error: ', error);
                                    return next(error);
                                }
                            
                                if(article.image !== ""){
                                    connexion.query(`SELECT image FROM articles WHERE creatorId="${users[0].id}"`, (error, images) => {
                                        if (error) {
                                            console.error('SQL error: ', error)
                                            return next(error)
                                        }
                                        images.map(image=> fs.unlink(`images/${image.image.substr(image.image.indexOf('/images/')+8)}`, err => err ? console.log(err) : console.log("Old image is removed")))
                                    })
                                }

                            })
                        })
                    ))
                }
                connexion.query(`DELETE FROM articles WHERE creatorId="${users[0].id}"`, (error) => {
                    if (error) {
                        console.error('SQL error: ', error);
                        return next(error);
                    }
                    connexion.query(`DELETE FROM users WHERE email="${req.body.email}"`, (error) => {
                        if (error) {
                            console.error('SQL error: ', error);
                            return next(error);
                        }
                        return res.status(200).json({
                            message: "❎ The user has been deleted! ❎"
                        })
                    })
                })
            })
        } else {
            return res.status(403).json({error:"⛔️❌🔐 !! Invalid administration authentication request! 🔐❌⛔️"})
        }
    })
}
exports.modify_rank = (req, res, next) => {
    if(res.locals.userRole === "BOSS"){
        const connexion = DB_connect()
        connexion.query(`UPDATE users set rank="${req.body.rank}" WHERE email="${req.body.email}"`, (error, result) => {
            if (error) {
                console.error('SQL error: ', error);
                return next(error);
            }
            return res.status(200).json({
                message: "The user's rank has been modified!"
            })
        })
    }else{
        return res.status(403).json({error:"⛔️❌🔐 !! Invalid xxx administration authentication request! 🔐❌⛔️"})
    }
}