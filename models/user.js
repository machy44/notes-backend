const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

/*
We could also implement other validations into the user creation.
We could check that the username is long enough, that the username only consists of permitted characters,
or that the password is strong enough. Implementing these functionalities is left as an optional exercise.
*/
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
  },
  name: String,
  passwordHash: String,
  notes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Note',
    },
  ],
});

userSchema.plugin(uniqueValidator);

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
    // the passwordHash should not be revealed
    delete returnedObject.passwordHash;
  },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
