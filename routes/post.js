const mongoose = require('mongoose');
mongoose.connect("mongodb://127.0.0.1:27017/instaclone");

const postSchema = mongoose.Schema({
  picture: String,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  caption: String,
  date: {
    type: Date,default: Date.now
  },
  likes: [
    {type: mongoose.Schema.Types.ObjectId,ref: 'User' }
  ],

})

module.exports = mongoose.model('post', postSchema);