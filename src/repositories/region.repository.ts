import mongoose, { FilterQuery, Model } from "mongoose";
import { Geometry } from "../dtos/region.dto";
import { Region } from "../models/region.model";

export class RegionRepository {
  constructor(private readonly model: Model<Region>) {}

  async create(
    regionData: Omit<Region, "_id">,
    session?: mongoose.ClientSession,
  ) {
    const [region] = await this.model.create([regionData], { session });
    return region;
  }

  async find(session?: mongoose.ClientSession) {
    return await this.model.find({}, null, { session }).populate("owner");
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

  async findByPoint(point: Geometry, session?: mongoose.ClientSession) {
    const region = await this.model.find(
      {
        geometry: {
          $geoIntersects: {
            $geometry: point,
          },
        },
      },
      null,
      { session },
    );

    return region;
  }

  async findByDistance(point: Geometry, session?: mongoose.ClientSession) {
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
      .populate("owner");

    return region;
  }

  async findByQuery(
    query: FilterQuery<Region>,
    session?: mongoose.ClientSession,
  ) {
    return await this.model
      .find(query, null, { session })
      .populate("owner")
      .exec();
  }
}
