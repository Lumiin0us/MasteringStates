const mongoose = require("mongoose");

const messageSchema = mongoose.Schema({
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "UserAuth", required: true },
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: "UserAuth", required: true },
    message: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },

})

module.exports = mongoose.model("Message", messageSchema);