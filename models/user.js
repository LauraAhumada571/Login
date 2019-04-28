const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    token: Number,
    name: String,
    last_name: String,
    email: String,
    password: String,
    rol: String
});

userSchema.methods.encryptPassword = (password) => {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
};
  
module.exports = mongoose.model('user', userSchema);