
const mongoose = require('mongoose')

const voteSchema = new mongoose.Schema({
    identity: {
        type: String,
        required: true,
    },
    fullname: {
        type: String,
    },
    party: {
        type: String,
        required: true,
    },

}, {
    timestamps: true
})

module.exports = mongoose.model('Vote', voteSchema)