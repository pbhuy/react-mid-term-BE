const { Schema, model } = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const userSchema = new Schema(
  {
    first_name: { type: String, required: [true, 'First name required'] },
    last_name: { type: String, required: [true, 'Last name required'] },
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
