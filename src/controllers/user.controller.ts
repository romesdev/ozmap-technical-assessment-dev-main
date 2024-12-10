import { Request, Response } from 'express';
import { UserModel } from '../models/user.model';
import { GeolocationService } from '../services/geolocation.service';

export class UserController {
  static async createUser(req: Request, res: Response) {
    const { name, email, address, coordinates } = req.body;

    try {
      let coordinatesRetrieved = coordinates
      let addressRetrieved = address
      if (address) {
        coordinatesRetrieved = await GeolocationService.getCoordinatesFromAddress(address)
        console.log(coordinatesRetrieved)
      } else {
        addressRetrieved = await GeolocationService.getAddressFromCoordinates(coordinates.lat, coordinates.lng);
        console.log(addressRetrieved)
      }

      const user = await UserModel.create({
        name,
        email,
        address: addressRetrieved,
        coordinates: coordinatesRetrieved,
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
