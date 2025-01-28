import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },

  password: {
    type: String,
    required: true,
  },

  googleId: {
    type: String,
    unique: true,
    sparse: true,
  },
  
  facebookId: {
    type: String,
    unique: true,
    sparse: true,
  },

  nickname: {
    type: String,
    required: true,
    trim: true,
  },

  role: {
    type: String,
    enum: ["user", "author", "admin"],
    default: "user",
  },

  score: {
    type: Number,
    default: 0,
  },

  games: {
    type: Number,
    default: 0,
  },

  achievements: {
    type: [String],
    default: [],
  },

  quizzesCreated: {
    type: Number,
    default: 0,
  },
});

// Hash the password before saving the user model
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

const User = mongoose.model("User", userSchema);

export default User;
