import UserModel from "../model/user.model";
import IRoles from "../types/role.type";
import IUser from "../types/user.type";

export default class UserService {
  // Create a new user
  static createUser = async (data: IUser) => {
    const user = await UserModel.create(data);
    return user;
  };

  // Get user by ID
  static getUser = async (id: string) => {
    const user = await UserModel.findById(id).select("-password");
    return user;
  };

  // Get all users (excluding passwords)
  static getAllUsers = async () => {
    return await UserModel.find().select("-password").lean();
  };

  // Get user by name
  static getUserByUserName = async (name: string) => {
    return await UserModel.findOne({ name }).select("-password").lean();
  };

  // Get user by email (very common use-case)
  static getUserByEmail = async (email: string) => {
    return await UserModel.findOne({ email }).lean();
  };

  // Get one user by any filter (flexible query)
  static getOneUserByAny = async (filter: object) => {
    return await UserModel.findOne(filter).lean();
  };

  // Update a user by ID
  static updateUser = async (id: string, data: Partial<IUser>) => {
    return await UserModel.findByIdAndUpdate(id, data, { new: true }).select(
      "-password"
    );
  };

  // Delete a user by ID
  static deleteUser = async (id: string) => {
    return await UserModel.findByIdAndDelete(id);
  };

  // Get dashboard counts or summary if needed
  static getUserSummary = async () => {
    const total = await UserModel.countDocuments();
    const employers = await UserModel.countDocuments({ role: IRoles.EMPLOYER });
    const jobSeekers = await UserModel.countDocuments({
      role: IRoles.JOB_SEEKER,
    });

    return {
      totalUsers: total,
      totalEmployers: employers,
      totalJobSeekers: jobSeekers,
    };
  };
}
