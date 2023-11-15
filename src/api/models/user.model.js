const { Schema, model } = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new Schema(
  {
    first_name: String,
    last_name: String,
    email: { type: String, required: [true, 'Email required'], unique: true },
    password: { type: String },
    region: String,
    sex: {
      type: String,
      enum: ['Male', 'Female'],
    },
    telephone: String,
    DOB: String,
    avatar: String,
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

userSchema.method('verifyPassword', async function (inputPassword) {
  const result = await bcrypt.compare(inputPassword, this.password);
  return result;
});

const User = model('User', userSchema);
module.exports = User;
