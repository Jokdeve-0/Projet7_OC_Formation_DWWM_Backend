const express = require('express')
const router = express.Router()
const userCtrl = require('../controllers/users')
const authorization = require('../middleware/authorization')
const authorizationAdmin = require('../middleware/authorizationAdmin')

router.post('/users', authorization, userCtrl.retrieve_users) 
router.post('/signup', userCtrl.signup)
router.post('/login', userCtrl.login)
router.post('/rank', authorizationAdmin, userCtrl.modify_rank)
router.put('/pass-modify', authorization, userCtrl.modify_pass)
router.put('/pseudo-modify', authorization, userCtrl.modify_pseudo)
router.put('/email-modify', authorization, userCtrl.modify_email)
router.delete('/byeByAdmin', authorizationAdmin, userCtrl.delete_user)
router.delete('/bye', authorization, userCtrl.delete_user)
router.post('/user', authorization, userCtrl.retrieve_user) 


module.exports = router