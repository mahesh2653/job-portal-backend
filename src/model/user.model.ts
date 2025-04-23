import mongoose from "mongoose";
import IRoles from "../types/role.type";
import IUser from "../types/user.type";

const userSchema = new mongoose.Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: IRoles.JOB_SEEKER },
    mobileNo: { type: Number, required: true },
    profile: { type: String, required: true },
  },
  { timestamps: true }
);

const UserModel = mongoose.model<IUser>("user", userSchema);

export default UserModel;
