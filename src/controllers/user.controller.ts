import { Request, Response } from 'express';
import { UserModel } from '../models/user.model';

export class UserController {
  static async createUser(req: Request, res: Response) {
    const { name, email, address, coordinates } = req.body;

    if ((!address && !coordinates) || (address && coordinates)) {
      return res.status(400).json({
        error: 'Please provide only address or coordinates, not both',
      });
    }

    try {
      const user = await UserModel.create({
        name,
        email,
        address,
        coordinates,
      });
      return res.status(201).json(user);
    } catch (error) {
      return res
        .status(500)
        .json({ error: 'Error to create user', details: error });
    }
  }

  static async getUsers(req: Request, res: Response) {
    try {
      const users = await UserModel.find();
      return res.status(200).json(users);
    } catch (error) {
      return res.status(500).json({ error: 'Error to get users' });
    }
  }

  static async updateUser(req: Request, res: Response) {
    const { id } = req.params;
    const { address, coordinates } = req.body;

    if (address && coordinates) {
      return res.status(400).json({
        error: 'Please provide only address or coordinates, not both',
      });
    }

    try {
      const user = await UserModel.findByIdAndUpdate(id, req.body, {
        new: true,
      });
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      return res.status(200).json(user);
    } catch (error) {
      return res.status(500).json({ error: 'Error to update user' });
    }
  }

  static async deleteUser(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const user = await UserModel.findByIdAndDelete(id);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      return res.status(200).json({ message: 'User deleted with success' });
    } catch (error) {
      return res.status(500).json({ error: 'Error to delete user' });
    }
  }
}
