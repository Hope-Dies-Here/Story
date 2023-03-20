const mongoose = require("mongoose")

const storySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  story: {
    type: String,
    required: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User'
  }
})



module.exports = mongoose.model('Story', storySchema)
