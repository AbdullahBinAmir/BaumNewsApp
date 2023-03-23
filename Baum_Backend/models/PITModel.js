const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'userdatas', required: true },
    publisherName: {
        required: true,
        type: String
    },
    impressionDate: {
        required: true,
        type: String
    },
    IsPIT:{
        required: true,
        type: Number // 0 or 1
    }
})

module.exports = mongoose.model('pitdata', dataSchema)