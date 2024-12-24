const mongoose = require("mongoose")

const userAuthSchema = new mongoose.Schema({
    username: { type: String, required: true },
    password: { type: String, required: true }
})

module.exports = mongoose.model("UserAuth", userAuthSchema);