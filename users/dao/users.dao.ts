import shortid from "shortid";
import debug from "debug";
import mongooseService from "../../common/services/mongoose.service";

import { CreateUserDto } from "../dto/create.user.dto";
import { PatchUserDto } from "../dto/patch.user.dto";
import { PutUserDto } from "../dto/put.user.dto";

const log: debug.IDebugger = debug("app:in-memory-dao");

class UsersDao {
  // users: CreateUserDto[] = [];

  Schema = mongooseService.getMongoose().Schema;

  userSchema = new this.Schema(
    {
      _id: String,
      email: String,
      password: { type: String, select: false },
      firstName: String,
      lastName: String,
      permissionFlags: Number,
    },
    { id: false }
  );

  User = mongooseService.getMongoose().model("Users", this.userSchema);
  constructor() {
    log("Created new instance of UsersDao");
  }
  async addUser(userFields: CreateUserDto) {
    const userId = shortid.generate();
    const user = new this.User({
      _id: userId,
      ...userFields,
      permissionFlags: 1,
    });
    await user.save();
    return userId;
  }
  async getUserByEmail(email: string) {
    return this.User.findOne({ email: email }).exec();
  }

  async getUserById(userId: string) {
    return this.User.findOne({ _id: userId }).exec();
  }

  async getUsers(limit = 25, page = 0) {
    return this.User.find()
      .limit(limit)
      .skip(limit * page)
      .exec();
  }
  async updateUserById(userId: string, userFields: PatchUserDto | PutUserDto) {
    const existingUser = await this.User.findOneAndUpdate(
      { _id: userId },
      { $set: userFields },
      { new: true }
    ).exec();
    return existingUser;
  }
  async removeUserById(userId: string) {
    return this.User.deleteOne({ _id: userId }).exec();
  }

  // async addUser(user: CreateUserDto) {
  //   user.id = shortid.generate();
  //   this.users.push(user);
  //   return user.id;
  // }

  // async getUsers() {
  //   return this.users;
  // }

  // async getUserById(userId: string) {
  //   return this.users.find((user: { id: string }) => user.id === userId);
  // }

  // async putUserById(userId: string, user: PutUserDto) {
  //   const objIndex = this.users.findIndex(
  //     (obj: { id: string }) => obj.id === userId
  //   );
  //   // con 0 agrego con 1 actualizo
  //   this.users.splice(objIndex, 1, user);
  //   return `${user.id} updated via put`;
  // }

  // async patchUserById(userId: string, user: PatchUserDto) {
  //   const objIndex = this.users.findIndex(
  //     (user: { id: string }) => user.id === userId
  //   );
  //   let currentUser = this.users[objIndex];
  //   const allowedPatchFields = [
  //     "password",
  //     "firstName",
  //     "lastName",
  //     "permissionLevel",
  //   ];
  //   for (const field of allowedPatchFields) {
  //     if (field in user) {
  //       // password === user.password
  //       // @ts-ignore
  //       currentUser[field] = user[field];
  //       // cur.password = user.password
  //     }
  //   }
  //   this.users.splice(objIndex, 1, currentUser);
  //   return `${user.id} patched`;
  // }

  // async removeUserById(userId: string) {
  //   const objIndex = this.users.findIndex(
  //     (obj: { id: string }) => obj.id === userId
  //   );
  //   this.users.splice(objIndex, 1);
  //   return `${userId} removed`;
  // }

  // async getUserByEmail(email: string) {
  //   const objIndex = this.users.findIndex(
  //     (obj: { email: string }) => obj.email === email
  //   );
  //   let currentUser = this.users[objIndex];
  //   if (currentUser) {
  //     return currentUser;
  //   } else {
  //     return null;
  //   }
  // }
}

export default new UsersDao();
