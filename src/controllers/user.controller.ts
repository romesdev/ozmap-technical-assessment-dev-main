import { Request, Response } from 'express';
import { UserService } from 'src/services/user.service';

export class UserController {
  constructor(private readonly userService: UserService) {}

  async create(req: Request, res: Response) {
    try {
      const { name, email, address, coordinates } = req.body;
      const user = await this.userService.create({
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

  async get(req: Request, res: Response) {
    try {
      const users = await this.userService.get();
      return res.status(200).json(users);
    } catch (error) {
      return res.status(500).json({ error: 'Error to get users' });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const users = await this.userService.getById(id);
      return res.status(200).json(users);
    } catch (error) {
      return res.status(500).json({ error: 'Error to get user' });
    }
  }

  async update(req: Request, res: Response) {
    const { id } = req.params;

    try {
      const user = await this.userService.update(id, req.body);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      return res.status(200).json(user);
    } catch (error) {
      return res.status(500).json({ error: 'Error to update user' });
    }
  }

  async delete(req: Request, res: Response) {
    const { id } = req.params;

    try {
      const user = await this.userService.delete(id);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      return res.status(200).json({ message: 'User deleted with success' });
    } catch (error) {
      return res.status(500).json({ error: 'Error to delete user' });
    }
  }
}
