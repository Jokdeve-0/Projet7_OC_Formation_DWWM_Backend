class Article {
    // Automatic implementation of "id", "creatorId", "image", "valide" & "dateofcreate" by the server 
    constructor(message,genre,pseudo,dates,repost = false,oldPseudo = false){
        this.message = message
        this.genre = genre
        this.dates = dates
        this.pseudo = pseudo
        this.voteFor = 0
        this.voteAgainst = 0
        this.userFor = JSON.stringify([])
        this.userAgainst = JSON.stringify([])
        this.repost = repost
        this.oldPseudo = oldPseudo
    }
}
module.exports =  Article