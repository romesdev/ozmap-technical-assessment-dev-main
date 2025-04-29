import { Request, Response } from "express";
import { UserService } from "src/services/user.service";

export class UserController {
  constructor(private readonly userService: UserService) {}

  async create(req: Request, res: Response) {
    const { name, email, address, coordinates } = req.body;
    const response = await this.userService.create({
      name,
      email,
      address,
      coordinates,
    });

    if (response.success === false) return res.status(400).json(response);

    return res.status(201).json(response);
  }

  async get(req: Request, res: Response) {
    const { page, limit } = req.query;

    const response = await this.userService.get(Number(page), Number(limit));
    if (response.success === false) return res.status(400).json(response);

    return res.status(200).json(response);
  }

  async getById(req: Request, res: Response) {
    const { id } = req.params;

    const response = await this.userService.getById(id);

    if (response.success === false) return res.status(400).json(response);

    return res.status(200).json(response);
  }

  async update(req: Request, res: Response) {
    const { id } = req.params;
    const response = await this.userService.update(id, req.body);
    if (response.success === false) return res.status(400).json(response);

    return res.status(200).json(response);
  }

  async delete(req: Request, res: Response) {
    const { id } = req.params;
    const response = await this.userService.delete(id);
    if (response.success === false) return res.status(400).json(response);

    return res.status(200).json({ message: "User deleted with success" });
  }
}
