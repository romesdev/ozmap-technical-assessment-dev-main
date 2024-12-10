import mongoose from 'mongoose';
import { UserModel } from '../models/user.model';
import { SaveUserDTO } from '../dtos/user.dto';

export class UserRepository {
  async create(userData: SaveUserDTO, session?: mongoose.ClientSession) {
    const [user] = await UserModel.create([userData], { session });
    return user;
  }

  async find() {
    return await UserModel.find();
  }

  async update(
    id: string,
    updateData: SaveUserDTO,
    session?: mongoose.ClientSession
  ) {
    const user = UserModel.findByIdAndUpdate(id, updateData, {
      new: true,
      session,
    });

    return user;
  }

  async delete(id: string, session?: mongoose.ClientSession) {
    return UserModel.findByIdAndDelete(id, { session }).lean().exec();
  }

  async findUserByEmail(email: string) {
    const user = UserModel.findOne({ email });

    return user;
  }
}
