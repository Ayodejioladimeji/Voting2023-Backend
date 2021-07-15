
const mongoose = require('mongoose')

const candidateSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true,
        trim: true
    },
    images: {
       type: Object,
       required: true,
    },
    party: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true,
    },

}, {
    timestamps: true
})

module.exports = mongoose.model('Candidate', candidateSchema)