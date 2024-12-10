import { Request, Response } from "express";
import { RegionService } from "../services/region.service";

export class RegionController {
  constructor(private readonly regionService: RegionService) {}

  async create(req: Request, res: Response) {
    try {
      const { name, geometry, ownerId } = req.body;

      const response = await this.regionService.create({
        name,
        geometry,
        ownerId,
      });

      if (response.success === false) return res.status(400).json(response);

      return res.status(201).json(response);
    } catch (error) {
      console.error("Error to create a region", error);
      return res
        .status(500)
        .json({ message: "Error to create a region", details: error });
    }
  }

  async get(req: Request, res: Response) {
    try {
      const response = await this.regionService.get();
      if (response.success === false) return res.status(400).json(response);

      return res.status(200).json(response);
    } catch (error) {
      console.error("Error to get regions", error);
      return res
        .status(500)
        .json({ message: "Error to get regions", details: error });
    }
  }

  async getByPoint(req: Request, res: Response) {
    try {
      const { lat, lng } = req.query;

      const query = {
        lat: lat as unknown as string,
        lng: lng as unknown as string,
      };

      const response = await this.regionService.getByPoint(query);
      if (response.success === false) return res.status(400).json(response);

      return res.status(200).json(response);
    } catch (error) {
      console.error("Error to get regions", error);
      return res
        .status(500)
        .json({ message: "Error to get regions", details: error });
    }
  }

  async getByDistance(req: Request, res: Response) {
    try {
      const { lat, lng, distance } = req.query;

      const query = {
        lat: lat as unknown as string,
        lng: lng as unknown as string,
        distance: distance as unknown as string,
      };

      const response = await this.regionService.getByDistance(query);
      if (response.success === false) return res.status(400).json(response);

      return res.status(200).json(response);
    } catch (error) {
      console.error("Error to get regions", error);
      return res
        .status(500)
        .json({ message: "Error to get regions", details: error });
    }
  }
  async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const response = await this.regionService.getById(id);

      if (response.success === false) return res.status(400).json(response);

      return res.status(200).json(response);
    } catch (error) {
      return res
        .status(500)
        .json({ error: "Error to get region", details: error });
    }
  }

  async update(req: Request, res: Response) {
    const { id } = req.params;

    try {
      const response = await this.regionService.update(id, req.body);
      if (response.success === false) return res.status(400).json(response);

      return res.status(200).json(response);
    } catch (error) {
      return res
        .status(500)
        .json({ error: "Error to update region", details: error });
    }
  }

  async delete(req: Request, res: Response) {
    const { id } = req.params;

    try {
      const response = await this.regionService.delete(id);
      if (response.success === false) return res.status(400).json(response);

      return res.status(200).json({ message: "Region deleted with success" });
    } catch (error) {
      return res
        .status(500)
        .json({ error: "Error to delete region", details: error });
    }
  }
}
