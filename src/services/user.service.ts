import UserModel from "../model/user.model";

export default class UserService {
  static createUser = async (data: any) => {
    const user = await UserModel.insertOne(data);
    return user;
  };

  static getUser = async (id: string) => {
    const user = await UserModel.findById(id);
    return user;
  };

  static getAllUsers = async () => {
    const user = await UserModel.find().select("-password");
    return user;
  };

  static getUserByUserName = async (name: string) => {
    return await UserModel.findOne({ name }).lean();
  };

  static getOneUserByAny = async (filter: object) => {
    return await UserModel.findOne(filter);
  };
}
