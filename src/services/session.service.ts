import mongoose from 'mongoose';

export class SessionService {
  async startSession() {
    return await mongoose.startSession();
  }
}
