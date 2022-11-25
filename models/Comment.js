class Comment {
    // Automatic implementation of "id", "creatorId", "image" & "dates" by the server 
    constructor(articleId,creatorId,pseudo,message,dates){
        this.articleId = articleId
        this.creatorId = creatorId
        this.pseudo = pseudo
        this.message = message
        this.dates = dates
    }
}
module.exports =  Comment