const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  win: { type: Number, required: true},
  loose :{type: Number, required: true}
});

userSchema.plugin(uniqueValidator);

userSchema.statics.incrementWin = async function(_id) {
  this.findOne({ _id})
    .then(async user => {
      await this.updateOne(
        {_id},
        {win: user.win + 1})
      })
    .catch( err => {console.error(err)});
  };

userSchema.statics.incrementLoose = async function(_id) {
  this.findOne({ _id})
  .then(async user => {
    await this.findOneAndUpdate(
      { _id },
      {loose: user.loose + 1},
      {new: true})
    })
  .catch( err => {console.error(err)});
  };

module.exports = mongoose.model('User', userSchema);

