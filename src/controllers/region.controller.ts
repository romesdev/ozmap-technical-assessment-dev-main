import { Request, Response } from 'express';
import { RegionModel } from '../models/region.model';
import { UserService } from 'src/services/user.service';
import { RegionService } from 'src/services/region.service';

export class RegionController {
  constructor(private readonly regionService: RegionService) {}

  async create(req: Request, res: Response) {
    try {
      const { name, geometry, ownerId } = req.body;

      const region = await this.regionService.create({
        name,
        geometry,
        ownerId,
      });
      return res.status(201).json(region);
    } catch (error) {
      console.error('Error to create a region', error);
      return res.status(500).json({ message: 'Error to create a region' });
    }
  }

  async get(req: Request, res: Response) {
    try {
      const regions = await RegionModel.find().populate('owner');
      return res.status(200).json(regions);
    } catch (error) {
      console.error('Error to get regions', error);
      return res
        .status(500)
        .json({ message: 'Error to get regions', details: error });
    }
  }

  async getByPoint(req: Request, res: Response) {
    try {
      const { lat, lng } = req.query;

      const query = {
        lat: lat as unknown as string,
        lng: lng as unknown as string,
      };

      const regions = await this.regionService.getByPoint(query);
      return res.status(200).json(regions);
    } catch (error) {
      console.error('Error to get regions', error);
      return res
        .status(500)
        .json({ message: 'Error to get regions', details: error });
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

      const regions = await this.regionService.getByDistance(query);
      return res.status(200).json(regions);
    } catch (error) {
      console.error('Error to get regions', error);
      return res
        .status(500)
        .json({ message: 'Error to get regions', details: error });
    }
  }
  async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const users = await this.regionService.getById(id);
      return res.status(200).json(users);
    } catch (error) {
      return res.status(500).json({ error: 'Error to get region' });
    }
  }

  async update(req: Request, res: Response) {
    const { id } = req.params;

    try {
      const user = await this.regionService.update(id, req.body);
      if (!user) {
        return res.status(404).json({ error: 'Region not found' });
      }
      return res.status(200).json(user);
    } catch (error) {
      return res.status(500).json({ error: 'Error to update region' });
    }
  }

  async delete(req: Request, res: Response) {
    const { id } = req.params;

    try {
      const user = await this.regionService.delete(id);
      if (!user) {
        return res.status(404).json({ error: 'Region not found' });
      }
      return res.status(200).json({ message: 'Region deleted with success' });
    } catch (error) {
      return res.status(500).json({ error: 'Error to delete region' });
    }
  }
}
