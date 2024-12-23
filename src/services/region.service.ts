import {
  QueryByDistanceDTO,
  QueryByPointDTO,
  SaveRegionDTO,
} from "../dtos/region.dto";
import { RegionRepository } from "../repositories/region.repository";
import { UserRepository } from "../repositories/user.repository";
import { SessionService } from "./session.service";
import { Region } from "../models/region.model";
import { Result } from "../utils/types";
import { FilterQuery } from "mongoose";

export class RegionService {
  constructor(
    private readonly regionRepository: RegionRepository,
    private readonly userRepository: UserRepository,
    private readonly sessionService: SessionService,
  ) {}

  async create(data: SaveRegionDTO): Promise<Result<Region>> {
    const session = await this.sessionService.startSession();

    session.startTransaction();
    try {
      const { name, geometry, ownerId } = data;
      const owner = await this.userRepository.findById(ownerId, session);

      if (!owner) {
        return {
          success: false,
          error: {
            message: "The provided user id not exists",
            code: "USER_NOT_FOUND",
          },
        };
      }

      const region = await this.regionRepository.create(
        {
          name,
          geometry,
          owner: owner._id,
        },
        session,
      );

      await session.commitTransaction();
      session.endSession();

      return {
        success: true,
        data: region,
      };
    } catch (error) {
      await session.abortTransaction();
      session.endSession();

      return {
        success: false,
        error: {
          message: error.message || "Failed to create region",
          code: "CREATE_REGION_ERROR",
        },
      };
    }
  }

  async get(): Promise<Result<Region[]>> {
    const session = await this.sessionService.startSession();

    session.startTransaction();
    try {
      const regions = await this.regionRepository.find(session);

      await session.commitTransaction();
      session.endSession();

      return {
        success: true,
        data: regions,
      };
    } catch (error) {
      await session.abortTransaction();
      session.endSession();

      return {
        success: false,
        error: {
          message: error.message || "Failed to retrieve regions",
          code: "GET_REGIONS_ERROR",
        },
      };
    }
  }

  async getById(id: string): Promise<Result<Region | null>> {
    const session = await this.sessionService.startSession();

    session.startTransaction();
    try {
      const region = await this.regionRepository.findById(id, session);

      await session.commitTransaction();
      session.endSession();

      return {
        success: true,
        data: region,
      };
    } catch (error) {
      await session.abortTransaction();
      session.endSession();

      return {
        success: false,
        error: {
          message: error.message || "Failed to retrieve regions",
          code: "GET_REGIONS_ERROR",
        },
      };
    }
  }

  async getByPoint(queryInput: QueryByPointDTO): Promise<Result<Region[]>> {
    const session = await this.sessionService.startSession();

    session.startTransaction();
    try {
      const { lat, lng } = queryInput;
      const point = {
        type: "Point",
        coordinates: [
          parseFloat(lng as unknown as string),
          parseFloat(lat as unknown as string),
        ],
      };

      const regions = await this.regionRepository.findByQuery(
        {
          geometry: {
            $geoIntersects: {
              $geometry: point,
            },
          },
        },
        session,
      );

      await session.commitTransaction();
      session.endSession();

      return {
        success: true,
        data: regions,
      };
    } catch (error) {
      await session.abortTransaction();
      session.endSession();

      return {
        success: false,
        error: {
          message: error.message || "Failed to retrieve regions",
          code: "GET_REGIONS_ERROR",
        },
      };
    }
  }

  async getByDistance(queryInput: QueryByDistanceDTO) {
    const session = await this.sessionService.startSession();
    session.startTransaction();
    try {
      const { lat, lng, distance } = queryInput;
      const query: FilterQuery<Region> = {
        geometry: {
          $near: {
            $geometry: {
              type: "Point",
              coordinates: [
                parseFloat(lng as unknown as string),
                parseFloat(lat as unknown as string),
              ],
            },
            $maxDistance: parseFloat(distance as unknown as string),
          },
        },
      };

      const regions = await this.regionRepository.findByQuery(query, session);

      await session.commitTransaction();
      session.endSession();

      return {
        success: true,
        data: regions,
      };
    } catch (error) {
      await session.abortTransaction();
      session.endSession();

      return {
        success: false,
        error: {
          message: error.message || "Failed to retrieve regions",
          code: "GET_REGIONS_ERROR",
        },
      };
    }
  }

  async update(id: string, data: SaveRegionDTO): Promise<Result<Region>> {
    const session = await this.sessionService.startSession();

    session.startTransaction();
    try {
      const { name, geometry, ownerId } = data;

      const existingRegion = await this.regionRepository.findById(id);
      if (!existingRegion) {
        return {
          success: false,
          error: {
            message: "Region not found",
            code: "REGION_NOT_FOUND",
          },
        };
      }

      let owner;
      if (ownerId) {
        owner = await this.userRepository.findById(ownerId);
        if (!owner) {
          return {
            success: false,
            error: {
              message: "The provided user id does not exist",
              code: "USER_NOT_FOUND",
            },
          };
        }
      } else {
        owner = existingRegion.owner;
      }

      const updateData: Partial<Region> = {
        ...(name && { name }),
        ...(geometry && { geometry }),
        ...(owner && { owner }),
      };

      const updatedRegion = await this.regionRepository.update(
        id,
        updateData,
        session,
      );

      if (!updatedRegion) {
        return {
          success: false,
          error: {
            message: "Failed to update the region",
            code: "UPDATE_REGION_ERROR",
          },
        };
      }

      await session.commitTransaction();
      session.endSession();

      return {
        success: true,
        data: updatedRegion,
      };
    } catch (error) {
      await session.abortTransaction();
      session.endSession();

      return {
        success: false,
        error: {
          message: error.message || "Failed to update region",
          code: "UPDATE_REGION_ERROR",
        },
      };
    }
  }

  async delete(id: string): Promise<Result<null>> {
    const session = await this.sessionService.startSession();
    session.startTransaction();

    try {
      const region = await this.regionRepository.delete(id, session);

      if (!region) {
        return {
          success: false,
          error: {
            message: "Region not found",
            code: "REGION_NOT_FOUND",
          },
        };
      }

      await session.commitTransaction();
      session.endSession();

      return {
        success: true,
        data: null,
      };
    } catch (error) {
      await session.abortTransaction();
      session.endSession();

      return {
        success: false,
        error: {
          message: error.message || "Failed to delete region",
          code: "REGION_USER_ERROR",
        },
      };
    }
  }
}
