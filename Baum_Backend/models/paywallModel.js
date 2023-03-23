const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'userdatas', required: true },
    id: {
        required: true,
        type: Number
    },
    paywallVal: {
        required: true,
        type: String
    },
    loadDate: {
        required: true,
        type: String
    },
})

module.exports = mongoose.model('PaywallData', dataSchema)