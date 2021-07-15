const router = require('express').Router()
const createCtrl = require('../controllers/createCtrl')
const auth = require('../middleware/auth')
const authAdmin = require('../middleware/authAdmin')


router.post('/create', auth, authAdmin, createCtrl.createCandidate)
router.get('/all_candidates', createCtrl.allCandidates)
router.post('/vote', auth, createCtrl.vote)
router.get('/all_voters', auth, createCtrl.allVoters)



module.exports = router