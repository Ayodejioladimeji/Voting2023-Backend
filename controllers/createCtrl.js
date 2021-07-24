const Candidate = require('../models/createModel')
const Vote = require('../models/voteModel')
const User = require('../models/userModel')



const createCrtl = {

    createCandidate: async(req, res) => {
        try{
            const {fullname, party, images, type, count} = req.body

            if(!fullname || !party || !type)
                return res.status(400).json({msg: "Please fill in all fields"})

            const candidate = await Candidate.findOne({ party })
            if (candidate) return res.status(400).json({ msg: "Party has already been added for election" })
            

                const newCandidate = new Candidate({
                    fullname, party, images, type
                })

                await newCandidate.save()

                res.json({
                    msg: "Candidate Created successfully",
                    user: {...newCandidate._doc}
                })
        }
        catch(err){
            res.status(500).json({msg: err.message})
        }
    },

    // The section that gets all users
    allCandidates: async (req, res) => {
        try {
            const candidates = await Candidate.find().sort({ _id: -1 }).select('-password')

            res.json(candidates)
        }
        catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },

    allVoters: async (req, res) => {
        try {
            const voters = await Vote.find().sort({ _id: -1 }).select('-password')

            res.json(voters)
        }
        catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },

    // The section that votes
    vote: async (req, res) => {
        const {party, identity} = req.body

        if(!party || !identity)
        return res.status(400).json({msg: "Please fill in all fields"})

        const user = await User.findOne({identity})
            if(!user) {
                return res.status(400).json({msg: "Please Provide the NIN you used to register this account"})
            }

        const voter = await Vote.findOne({ identity })
        if (voter){
            return res.status(400).json({ msg: "You have already Voted" })
        } 
       

        const newVoter = new Vote({
            party, identity, fullname:user.fullname
        })

        await newVoter.save()

        res.json({
            msg: "Thank you for voting, You can now check the voting results",
            voters: {...newVoter._doc},
        })
    },

    results: async (req, res) => {
        try{
            
        }
        catch(err){
            return res.status(500).json({msg: err.message})
        }
    }

}

module.exports = createCrtl