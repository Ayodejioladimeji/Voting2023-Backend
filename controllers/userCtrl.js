const Users = require('../models/userModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')


const userCtrl = {

    // The section that registers the users
    register: async (req, res) => {
        try {
            const { fullname, identity, password } = req.body;

            if (!fullname || !identity || !password)
                return res.status(400).json({ msg: "Please fill in all fields" })

            if (identity.length !== 11) return res.status(400).json({ msg: "Provide original credentials" })

            const user = await Users.findOne({ identity })
            if (user) return res.status(400).json({ msg: "National Identity Number has been used by another voter" })



            if (password.length < 6)
                return res.status(400).json({ msg: "Password must at least 6 characters long." })

            // Password Encryption
            const passwordHash = await bcrypt.hash(password, 12)

            const newUser = new Users({
                fullname, identity, password: passwordHash
            })

            await newUser.save()

            res.json({ msg: "Registration successful! Now you can Login to cast your vote!!!" })

        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },


    // The section of thelogin
    login: async (req, res) => {
        try {
            const { identity, password } = req.body;

            if (!identity || !password)
                return res.status(400).json({ msg: "Fields cannot be empty" })

            const user = await Users.findOne({ identity })
            if (!user) return res.status(400).json({ msg: "Information does not exist." })

            const isMatch = await bcrypt.compare(password, user.password)
            if (!isMatch) return res.status(400).json({ msg: "Incorrect password." })

            // If login success , create refresh token
            const refresh_token = createRefreshToken({ id: user._id })

            res.cookie('refreshtoken', refresh_token, {
                httpOnly: true,
                path: '/user/refresh_token',
                maxAge: 24 * 60 * 60 * 1000 // 24h
            })

            res.json({ msg: "Login successful, Now you can cast your vote!" })

        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },


    // The section of the logout
    logout: async (req, res) => {
        try {
            res.clearCookie('refreshtoken', { path: '/user/refresh_token' })
            return res.json({ msg: "Logged out" })
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },



    // The section of the refresh token
    refreshToken: (req, res) => {
        try {
            const rf_token = req.cookies.refreshtoken;
            if (!rf_token) return res.status(400).json({ msg: "Please Login or Register first" })

            jwt.verify(rf_token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
                if (err) return res.status(400).json({ msg: "Please Login or Register" })

                const accesstoken = createAccessToken({ id: user.id })

                res.json({ accesstoken })
            })

        } catch (err) {
            return res.status(500).json({ msg: err.message }, console.log("main eror"))
        }

    },


    // The section of the forgot password
    forgotPassword: async (req, res) => {
        try {
            const { identity } = req.body
            const user = await Users.findOne({ identity })
            if (!user) return res.status(400).json({ msg: "This user does not exists" })


            res.json({ msg: "please proceed to reset your password" })
        }
        catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },


    // The section of the update users
    updateUser: async (req, res) => {
        try {
            const { name, avatar } = req.body
            await Users.findOneAndUpdate({ _id: req.user.id }, {
                name, avatar
            })

            res.json({ msg: "Update Success" })
        }
        catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },


    // The section of the get single users
    getUser: async (req, res) => {
        try {
            const user = await Users.findById(req.user.id).select('-password')

            if (!user) return res.status(400).json({ msg: "User does not exist." })

            res.json(user)
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },


    // The section to delete a user
    deleteUser: async (req, res) => {
        try {
            await Users.findByIdAndDelete(req.params.id)

            res.json({ msg: "Deleted Successfully" })
        }
        catch (err) {
            console.log("cannot delete")
        }
    },

    // The section of the reset password
    resetPassword: async (req, res) => {
        console.log(req.body)
        try {
            const { password } = req.body

            const passwordHash = await bcrypt.hash(password, 12)

            await Users.findOneAndUpdate({ password }, {
                password: passwordHash
            })

            res.json({ msg: "Password Changed successfully" })
        }
        catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },


}



const createAccessToken = (user) => {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '11m' })
}

const createRefreshToken = (user) => {
    return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '24h' })
}



module.exports = userCtrl