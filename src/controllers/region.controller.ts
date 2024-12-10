import { Request, Response } from 'express';
import { RegionModel } from '../models/region.model';
import { UserModel } from '../models/user.model';

export class RegionController {
  public static async createRegion(req: Request, res: Response) {
    try {
      const { name, geometry, ownerId } = req.body;

      const owner = await UserModel.findById(ownerId);
      if (!owner) {
        return res.status(404).json({ message: 'User not found' });
      }

      const region = await RegionModel.create({ name, geometry, owner });
      return res.status(201).json(region);
    } catch (error) {
      console.error('Error to create a region', error);
      return res.status(500).json({ message: 'Error to create a region' });
    }
  }

  public static async listRegions(req: Request, res: Response) {
    try {
      const regions = await RegionModel.find().populate('owner');
      return res.status(200).json(regions);
    } catch (error) {
      console.error('Error to get regions', error);
      return res.status(500).json({ message: 'Error to get regions' });
    }
  }

  public static async regionsContainingPoint(req: Request, res: Response) {
    try {
      const { latitude, longitude } = req.query;

      const point = {
        type: 'Point',
        coordinates: [
          parseFloat(longitude as string),
          parseFloat(latitude as string),
        ],
      };

      const regions = await RegionModel.find({
        geometry: {
          $geoIntersects: {
            $geometry: point,
          },
        },
      });

      return res.status(200).json(regions);
    } catch (error) {
      console.error('Error to get regions', error);
      return res.status(500).json({ message: 'Error to get regions' });
    }
  }

  public static async regionsWithinDistance(req: Request, res: Response) {
    try {
      const { latitude, longitude, distance, excludeOwner } = req.query;

      if (!latitude || !longitude || !distance) {
        return res.status(400).json({
          message: 'Latitude, longitude e distância são obrigatórias.',
        });
      }

      const query: any = {
        geometry: {
          $near: {
            $geometry: {
              type: 'Point',
              coordinates: [
                parseFloat(longitude as string),
                parseFloat(latitude as string),
              ],
            },
            $maxDistance: parseFloat(distance as string),
          },
        },
      };

      if (excludeOwner) {
        query.owner = { $ne: excludeOwner };
      }

      const regions = await RegionModel.find(query).populate('owner');
      return res.status(200).json(regions);
    } catch (error) {
      console.error('Error to get regions', error);
      return res.status(500).json({ message: 'Error to get regions' });
    }
  }
}
