import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  nickname: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  quizzes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Quiz" }],
  stats: [{ type: mongoose.Schema.Types.ObjectId, ref: "Stats" }],
  achievements: [{ type: mongoose.Schema.Types.ObjectId, ref: "Achievement" }],
  privacy: { type: Boolean, default: false },
  wantNotifications: { type: Boolean, default: true },
  rootAccess: { type: Boolean, default: false },
  verification: { type: mongoose.Schema.Types.ObjectId, ref: "Verification" },
});

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 8);
  }
  next();
});


userSchema.pre("findOneAndUpdate", async function (next) {
  const update = this.getUpdate();
  if (update.password) {
    update.password = await bcrypt.hash(update.password, 8);
  }
  next();
});


const User = mongoose.model("User", userSchema);
export default User;
