const mongoose = require('mongoose');
const plm = require('passport-local-mongoose');
mongoose.connect("mongodb://127.0.0.1:27017/instaclone");

const userSchema = mongoose.Schema({
  username: String,
  name:String,
  password: String,
  email: String,
  profileImage: String,
  bio: String,
  posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }]
})

userSchema.plugin(plm);

module.exports = mongoose.model('User', userSchema);