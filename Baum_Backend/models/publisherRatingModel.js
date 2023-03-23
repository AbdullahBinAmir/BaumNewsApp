const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'userdatas', required: true },
    publisherName: {
        required: true,
        type: String,
        unique: true
    },
    ratingCount: {
        type: Number,
        default:0
    }
})

module.exports = mongoose.model('pubsrating', dataSchema)