const {DB_connect} = require ('../SQL/DB_connect')
const Article = require('../models/Article')
const Comment = require('../models/Comment')
const fs = require('fs')

// ARTICLE CRUD
exports.create_article = (req, res, next) => {
    const article = new Article(req.body.message,req.body.genre,req.body.pseudo,req.body.dates)
    article.creator = res.locals.currentUserId
    if(req.body.repost){
        article.repost = req.body.repost
        article.oldPseudo = req.body.oldPseudo
    }
    if(req.body.image == ""){
        article.image = ""
    }else{
        article.image = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    }
    const connection = DB_connect()
    connection.query(`INSERT INTO articles(creatorId, message, pseudo, image, genre, dates, voteFor, voteAgainst, userFor, userAgainst,valide,repost,oldPseudo) VALUES ("${article.creator}", "${article.message}", "${article.pseudo}", "${article.image}", "${article.genre}"," ${article.dates}"," ${article.voteFor}"," ${article.voteAgainst}"," ${article.userFor}", "${article.userAgainst}","${0}","${article.repost}","${article.oldPseudo}")
    `,(error,result)=>{
        if (error) {
            return res.status(505).json({error: error})
        }
        res.status(200).json({message:'✅Le message est posté✅'})
    })
}
exports.retrieved_all = (req, res, next) => {
    const connection = DB_connect()
    connection.query('SELECT * FROM articles ORDER BY dateofcreate DESC ', (error, all_articles) => {
        if (error) {
            console.error('❌SQL error❌: ', error);
            return next(error);
        }
        res.status(201).json({all_articles})
    })
}
exports.retrieved_one = (req, res, next) => {
    const connection = DB_connect()
    var id = req.params.id
    connection.query(`SELECT * FROM articles WHERE id  = ${id}`, (error, article) => {
        if (error) {
            return {error: error}
        } else {
            return res.json({article})
        }
    })
}
exports.modify_article = (req, res, next) => {
    const connection = DB_connect()
    connection.query(`SELECT * FROM articles WHERE id  = ${req.body.articleId}`, (error, article) => {
        if (error) {
            return {error: error}
        } else {
            if(res.locals.currentUserId === article[0].creatorId || res.locals.userRole === "BOSS"){
                connection.query(`UPDATE articles SET message="${req.body.message}", genre="${req.body.genre}" WHERE id="${req.body.articleId}"`,(error,result)=>{
                    if (error) {
                        return res.status(505).json({error: error})
                    }
                    res.status(200).json({message:'✅Le message est modifié'})
                })
            }else{
                res.status(403).json({
                    message: ' unauthorized request'
                })
            }
        }
    })
}
exports.delete_by_id = (req, res, next) => {
    const connection = DB_connect()
    connection.query(`DELETE FROM answers WHERE articleId="${req.body.id}" `, (error) => {
        if (error) {
            console.error('❌SQL error❌: ', error);
            return next(error);
        }
        connection.query(`DELETE FROM comments WHERE articleId="${req.body.id}" `, (error) => {
            if (error) {
                console.error('❌SQL error❌: ', error);
                return next(error);
            }
            if(req.body.image !== ""){
                fs.unlink(`images/${req.body.image.substr(req.body.image.indexOf('/images/')+8)}`, err => err ? console.log(err) : console.log("Old image is removed"))
            }
            connection.query(`DELETE FROM articles WHERE id="${req.body.id}" `, (error) => {
                if (error) {
                    console.error('❌SQL error❌: ', error);
                    return next(error);
                }
                res.status(201).json({
                    message: '✅ The article is removed ! ✅'
                })
            })
        })
    })
}
exports.repost_article = (req, res, next) => {
    const article = new Article(req.body.message,req.body.genre,req.body.pseudo,req.body.dates)
    article.creator = res.locals.currentUserId

    article.image = req.body.image
    if(article.image !== ""){
        const oldImage = article.image.substr(article.image.indexOf('/images/')+8)
        const newImage = Date.now()+'-'+article.image.substr(article.image.indexOf('/images/')+8)
        article.image = article.image.split('/images/')[0]+'/images/'+newImage
        fs.createReadStream(`./images/${oldImage}`).pipe(fs.createWriteStream(`./images/${newImage}`))
    }

    article.repost = req.body.repost
    article.oldPseudo = req.body.oldPseudo
    const connection = DB_connect()
    connection.query(`INSERT INTO articles(creatorId, message, pseudo, image, genre, dates, voteFor, voteAgainst, userFor, userAgainst,valide,repost,oldPseudo) VALUES ("${article.creator}", "${article.message}", "${article.pseudo}", "${article.image}", "${article.genre}"," ${article.dates}"," ${article.voteFor}"," ${article.voteAgainst}"," ${article.userFor}", "${article.userAgainst}","${0}", "${article.repost}", "${article.oldPseudo}")
    `,(error,result)=>{
        if (error) {
            return res.status(505).json({error: error})
        }
        res.status(200).json({message:'✅Le message est partager'})
    })
}
// COMMENT CRUD
exports.create_comment = (req, res, next) => {
    const comment = new Comment(req.body.articleId,req.body.creatorId,req.body.pseudo,req.body.comment,req.body.dates)
    const connection = DB_connect()
    connection.query(`INSERT INTO comments(articleId, pseudo, creatorId, message,dates,valide) VALUES ("${comment.articleId}", "${comment.pseudo}", "${comment.creatorId}","${comment.message}","${comment.dates}","${0}")
    `,(error,result)=>{
        if (error) {
            return res.status(505).json({error: error})
        }
        res.status(200).json({message:'✅Le message est posté✅'})
    })
}
exports.retrieved_comments = (req, res, next) => {
    const connection = DB_connect()
    connection.query('SELECT * FROM comments ', (error, all_comments) => {
        if (error) {
            console.error('❌SQL error❌: ', error);
            return next(error);
        }
     res.status(201).json({all_comments})
    })
}
exports.modify_comment = (req, res, next) => {
    const connection = DB_connect()
    connection.query(`UPDATE comments SET message="${req.body.message}", dates="${req.body.dates}" WHERE id="${req.body.commentId}"`,(error,result)=>{
        if (error) {
            return res.status(505).json({error: error})
        }
        res.status(200).json({message:'✅Le message est modifié✅'})
    })
}
exports.delete_comment = (req, res, next) => {
    const connection = DB_connect()
    connection.query(`DELETE FROM answers WHERE commentId="${req.body.commentId}" `, (error) => {
        if (error) {
            console.error('❌SQL error❌: ', error);
            return next(error);
        }
        connection.query(`DELETE FROM comments WHERE id="${req.body.commentId}" `, (error) => {
            if (error) {
                console.error('❌SQL error❌: ', error);
                return next(error);
            }
            res.status(201).json({
                message: '✅ The answers is removed ! ✅'
            })
        })
    })
}
// ANSWER CRUD
exports.create_answer = (req, res, next) => {
    const connection = DB_connect()
    connection.query(`INSERT INTO answers(commentId,articleId, creatorId, pseudo, message ,dates,valide) VALUES ("${req.body.commentId}","${req.body.articleId}","${req.body.creatorId}","${req.body.pseudo}","${req.body.message}","${req.body.dates}","${0}")
    `,
    (error,result)=>{
        if (error) {
            return res.status(505).json({error: error})
        }
        res.status(200).json({message:'✅Le message est posté✅'})
    })
}
exports.retrieved_answers = (req, res, next) => {
    const connection = DB_connect()
    connection.query('SELECT * FROM answers ORDER BY dateofcreate ASC ', (error, all_answers) => {
        if (error) {
            console.error('❌SQL error❌: ', error);
            return next(error);
        }
     res.status(201).json({all_answers})
    })
}
exports.modify_answer = (req, res, next) => {
    const connection = DB_connect()
    connection.query(`UPDATE answers SET message="${req.body.message}", dates="${req.body.dates}" WHERE id="${req.body.answerId}"`,(error,result)=>{
        if (error) {
            return res.status(505).json({error: error})
        }
        res.status(200).json({message:'✅Le message est modifié✅'})
    })
}
exports.delete_answer = (req, res, next) => {
    const connection = DB_connect()
    connection.query(`DELETE FROM answers WHERE id="${req.body.answerId}" `, (error) => {
        if (error) {
            console.error('❌SQL error❌: ', error);
            return next(error);
        }
        res.status(201).json({
            message: '✅ The answers is removed ! ✅'
        })
    })
}
// ADMIN
exports.moderate_article = (req, res, next) => {
    res.status(200).json({message:"Authorized"})
}
exports.banned_article = (req, res, next) => {
    const connection = DB_connect()
    connection.query(`SELECT * FROM articles WHERE id  = ${req.body.articleId}`, (error, article) => {
        if (error) {
            return {error: error}
        } else {
            if(res.locals.userRole === "BOSS"){
                connection.query(`UPDATE articles SET valide="${req.body.valide}" WHERE id="${req.body.articleId}"`,(error,result)=>{
                    if (error) {
                        return res.status(505).json({error: error})
                    }
                    res.status(200).json({message:'✅L\'article est banni'})
                })
            }else{
                res.status(403).json({
                    message: ' unauthorized request'
                })
            }
        }
    })
}
exports.banned_comment = (req, res, next) => {
    const connection = DB_connect()
    connection.query(`SELECT * FROM comments WHERE id  = ${req.body.commentId}`, (error, article) => {
        if (error) {
            return {error: error}
        } else {
            if(res.locals.userRole === "BOSS"){
                connection.query(`UPDATE comments SET valide="${req.body.valide}" WHERE id="${req.body.commentId}"`,(error,result)=>{
                    if (error) {
                        return res.status(505).json({error: error})
                    }
                    res.status(200).json({message:'✅Le commentaire est banni'})
                })
            }else{
                res.status(403).json({
                    message: ' unauthorized request'
                })
            }
        }
    })
}
exports.banned_answer = (req, res, next) => {
    const connection = DB_connect()
    connection.query(`SELECT * FROM answers WHERE id  = ${req.body.answerId}`, (error, article) => {
        if (error) {
            return {error: error}
        } else {
            if(res.locals.userRole === "BOSS"){
                connection.query(`UPDATE answers SET valide="${req.body.valide}" WHERE id="${req.body.answerId}"`,(error,result)=>{
                    if (error) {
                        return res.status(505).json({error: error})
                    }
                    res.status(200).json({message:'✅Le réponse est banni'})
                })
            }else{
                res.status(403).json({
                    message: ' unauthorized request'
                })
            }
        }
    })
}
// SERVICES
exports.retrieved_by_genre = (req, res, next) => {
    const connection = DB_connect()
    connection.query(`SELECT * FROM articles WHERE genre="${req.params.genre}" ORDER BY dates DESC`, (error, articles) => {
        if (error) {
            console.error('❌SQL error❌: ', error);
            return next(error);
        }
        res.status(201).json({
            message: '✅',
            genre:articles
        })
    })
}
exports.retrieved_by_search = (req, res, next) => {
    const connection = DB_connect()
    connection.query(`SELECT * FROM articles WHERE message LIKE "%${req.params.search}%" ORDER BY dates DESC`, (error, articles) => {
        if (error) {
            console.error('❌SQL error❌: ', error);
            return next(error);
        }
        res.status(201).json({
            message: '✅',
            search:articles
        })
    })
}
exports.retrieved_articles_by_user = (req, res, next) => {
    const connection = DB_connect()
    connection.query(`SELECT pseudo FROM users WHERE id="${req.body.id}"`, (error, user) => {
        if (error) {
            console.error('❌SQL error❌: ', error);
            return next(error);
        }
        connection.query(`SELECT * FROM articles WHERE creatorId="${req.body.id}" ORDER BY dates DESC `, (error, all_articles) => {
            if (error) {
                console.error('❌SQL error❌: ', error);
                return next(error);
            }
            res.status(201).json({all_articles,user})
        })
    })
}
exports.like_article = (req, res, next) => {
    const connection = DB_connect()
    connection.query(`UPDATE articles SET voteFor="${req.body.voteFor}", userFor="${req.body.userFor}" WHERE id="${req.body.articleId}"`,(error,result)=>{
        if (error) {
            console.error('❌SQL error❌: ', error);
            return next(error);
        } 
        res.status(200).json({message:req.body.message})
    }) 
}
exports.dislike_article = (req, res, next) => {
    const connection = DB_connect()
    connection.query(`UPDATE articles SET voteAgainst="${req.body.voteAgainst}", userAgainst="${req.body.userAgainst}" WHERE id="${req.body.articleId}"`,(error,result)=>{
        if (error) {
            console.error('❌SQL error❌: ', error);
            return next(error);
        } 
        res.status(200).json({message:req.body.message})
    }) 
}