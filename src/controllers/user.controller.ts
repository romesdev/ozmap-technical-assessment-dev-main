import { Request, Response } from "express";
import { UserService } from "src/services/user.service";

export class UserController {
  constructor(private readonly userService: UserService) {}

  async create(req: Request, res: Response) {
    try {
      const { name, email, address, coordinates } = req.body;
      const response = await this.userService.create({
        name,
        email,
        address,
        coordinates,
      });

      if (response.success === false) return res.status(400).json(response);

      return res.status(201).json(response);
    } catch (error) {
      return res
        .status(500)
        .json({ error: "Error to create user", details: error });
    }
  }

  async get(req: Request, res: Response) {
    try {
      const { page, limit } = req.query;

      const response = await this.userService.get(Number(page), Number(limit));
      if (response.success === false) return res.status(400).json(response);

      return res.status(200).json(response);
    } catch (error) {
      return res
        .status(500)
        .json({ error: "Error to get users", details: error });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const response = await this.userService.getById(id);

      if (response.success === false) return res.status(400).json(response);

      return res.status(200).json(response);
    } catch (error) {
      return res
        .status(500)
        .json({ error: "Error to get user", details: error });
    }
  }

  async update(req: Request, res: Response) {
    const { id } = req.params;

    try {
      const response = await this.userService.update(id, req.body);
      if (response.success === false) return res.status(400).json(response);

      return res.status(200).json(response);
    } catch (error) {
      return res
        .status(500)
        .json({ error: "Error to update user", details: error });
    }
  }

  async delete(req: Request, res: Response) {
    const { id } = req.params;

    try {
      const response = await this.userService.delete(id);
      if (response.success === false) return res.status(400).json(response);

      return res.status(200).json({ message: "User deleted with success" });
    } catch (error) {
      return res
        .status(500)
        .json({ error: "Error to delete user", details: error });
    }
  }
}
