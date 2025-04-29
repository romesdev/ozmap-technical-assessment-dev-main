import mongoose, { FilterQuery, Model } from "mongoose";
import { Geometry } from "../dtos/region.dto";
import { Region } from "../models/region.model";
import { calculateSkipNumber } from "../utils/functions";

export class RegionRepository {
  constructor(private readonly model: Model<Region>) {}

  async create(
    regionData: Omit<Region, "_id">,
    session?: mongoose.ClientSession,
  ) {
    const [region] = await this.model.create([regionData], { session });
    return region;
  }

  async find(
    page: number = 1,
    limit: number = 10,
    session?: mongoose.ClientSession,
  ) {
    const skip = calculateSkipNumber(page, limit);

    return await this.model
      .find({}, null, { session })
      .skip(skip)
      .limit(limit)
      .populate("owner");
  }

  async findById(id: string, session?: mongoose.ClientSession) {
    return await this.model.findById(id, null, { session }).populate("owner");
  }

  async update(
    id: string,
    updateData: Partial<Region>,
    session?: mongoose.ClientSession,
  ) {
    const region = await this.model.findByIdAndUpdate(id, updateData, {
      new: true,
      session,
    });

    return region;
  }

  async delete(id: string, session?: mongoose.ClientSession) {
    return await this.model.findByIdAndDelete(id, { session }).lean().exec();
  }

  async findByPoint(
    point: Geometry,
    page: number = 1,
    limit: number = 10,
    session?: mongoose.ClientSession,
  ) {
    const skip = calculateSkipNumber(page, limit);

    const region = await this.model
      .find(
        {
          geometry: {
            $geoIntersects: {
              $geometry: point,
            },
          },
        },
        null,
        { session },
      )
      .skip(skip)
      .limit(limit)
      .populate("owner");

    return region;
  }

  async findByDistance(
    point: Geometry,
    page: number = 1,
    limit: number = 10,
    session?: mongoose.ClientSession,
  ) {
    const skip = calculateSkipNumber(page, limit);

    const region = await this.model
      .find(
        {
          geometry: {
            $geoIntersects: {
              $geometry: point,
            },
          },
        },
        null,
        { session },
      )
      .skip(skip)
      .limit(limit)
      .populate("owner");

    return region;
  }

  async findByQuery(
    query: FilterQuery<Region>,
    page: number = 1,
    limit: number = 10,
    session?: mongoose.ClientSession,
  ) {
    const skip = calculateSkipNumber(page, limit);

    return await this.model
      .find(query, null, { session })
      .skip(skip)
      .limit(limit)
      .populate("owner")
      .exec();
  }
}
