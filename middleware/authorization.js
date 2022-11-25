const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
	try {
		const token = req.headers.authorization.split(' ')[1]
		const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET')
		const userId = decodedToken.id
		const userRank = decodedToken.rank
		if (req.body.userId && req.body.userId !== userId) {
		  throw 'Invalid user ID'
		} else {
		  res.locals.currentUserId = userId
		  res.locals.userRole = userRank
		  next()
		}
	  } catch {
		res.status(401).json({
		  error: '⛔️❌🔐 Invalid authentification bearer request! 🔐❌⛔️'
		})
	  }
}