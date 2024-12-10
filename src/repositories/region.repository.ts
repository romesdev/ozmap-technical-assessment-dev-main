import mongoose, { FilterQuery, Model } from 'mongoose';
import { Geometry } from '../dtos/region.dto';
import { Region } from '../models/region.model';

export class RegionRepository {
  constructor(private readonly model: Model<Region>) {}

  async create(
    regionData: Omit<Region, '_id'>,
    session?: mongoose.ClientSession
  ) {
    const [region] = await this.model.create([regionData], { session });
    return region;
  }

  async find() {
    return await this.model.find().populate('owner');
  }

  async findById(id: string) {
    return await this.model.findById(id).populate('owner');
  }

  async update(
    id: string,
    updateData: Partial<Region>,
    session?: mongoose.ClientSession
  ) {
    const region = this.model.findByIdAndUpdate(id, updateData, {
      new: true,
      session,
    });

    return region;
  }

  async delete(id: string, session?: mongoose.ClientSession) {
    return this.model.findByIdAndDelete(id, { session }).lean().exec();
  }

  async findByPoint(point: Geometry) {
    const region = this.model.find({
      geometry: {
        $geoIntersects: {
          $geometry: point,
        },
      },
    });

    return region;
  }

  async findByDistance(point: Geometry) {
    const region = this.model
      .find({
        geometry: {
          $geoIntersects: {
            $geometry: point,
          },
        },
      })
      .populate('owner');

    return region;
  }

  async findByQuery(query: FilterQuery<Region>) {
    return await this.model.find(query).populate('owner').exec();
  }
}
