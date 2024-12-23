import mongoose, { Model } from "mongoose";
import { SaveUserDTO } from "../dtos/user.dto";
import { User } from "../models/user.model";

export class UserRepository {
  constructor(private readonly model: Model<User>) {}

  async create(userData: SaveUserDTO, session?: mongoose.ClientSession) {
    const [user] = await this.model.create([userData], { session });
    return user;
  }

  async find(session?: mongoose.ClientSession) {
    return await this.model.find({}, null, { session });
  }

  async findById(id: string, session?: mongoose.ClientSession) {
    return await this.model.findById(id, null, { session });
  }

  async update(
    id: string,
    updateData: SaveUserDTO,
    session?: mongoose.ClientSession,
  ) {
    const user = this.model.findByIdAndUpdate(id, updateData, {
      new: true,
      session,
    });

    return user;
  }

  async delete(id: string, session?: mongoose.ClientSession) {
    return this.model.findByIdAndDelete(id, { session }).lean().exec();
  }

  async findUserByEmail(email: string, session?: mongoose.ClientSession) {
    const user = this.model.findOne({ email }, null, { session });

    return user;
  }
}
