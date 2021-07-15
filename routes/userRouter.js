const router = require('express').Router()
const userCtrl = require('../controllers/userCtrl')
const auth = require('../middleware/auth')
// const authAdmin = require('../middleware/authAdmin')


router.post('/register', userCtrl.register)

router.post('/login', userCtrl.login)

router.post('/forgot', userCtrl.forgotPassword)

router.get('/refresh_token', userCtrl.refreshToken)

router.get('/logout', userCtrl.logout)

router.get('/infor', auth, userCtrl.getUser)

router.post('/reset', userCtrl.resetPassword)

// router.delete('/delete/:id', auth, authAdmin, userCtrl.deleteUser)



module.exports = router