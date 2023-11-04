const { Schema, model } = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const userSchema = new Schema(
  {
    first_name: { type: String, required: [true, 'First name required'] },
    last_name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    region: String,
    sex: {
      type: String,
      enum: ['Male', 'Female'],
    },
    telephone: String,
    date_of_birth: Date,
    avatar: String,
  },
  {
    timestamps: true,
  },
);

userSchema.pre('save', async function (next) {
  try {
    const salt = await bcrypt.genSalt(saltRounds);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

userSchema.method('verifyPassword', async function (inputPassword) {
  const result = await bcrypt.compare(inputPassword, this.password);
  return result;
});

const User = model('User', userSchema);
module.exports = User;
