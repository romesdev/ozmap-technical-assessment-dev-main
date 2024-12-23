import { SaveUserDTO } from "../dtos/user.dto";
import { UserRepository } from "../repositories/user.repository";
import { GeolocationService } from "./geolocation.service";
import { Result } from "../utils/types";
import { User } from "../models/user.model";
import { SessionService } from "./session.service";

export class UserService {
  constructor(
    private readonly geolocationService: GeolocationService,
    private readonly userRepository: UserRepository,
    private readonly sessionService: SessionService,
  ) {}

  async create(data: SaveUserDTO): Promise<Result<User>> {
    const session = await this.sessionService.startSession();
    session.startTransaction();

    try {
      const { name, email } = data;
      let { address, coordinates } = data;

      const existingUser = await this.userRepository.findUserByEmail(email);
      if (existingUser) {
        return {
          success: false,
          error: {
            message: "The provided email is already in use.",
            code: "EMAIL_ALREADY_EXISTS",
          },
        };
      }

      if (address) {
        coordinates =
          await this.geolocationService.getCoordinatesFromAddress(address);
      } else if (coordinates) {
        address = await this.geolocationService.getAddressFromCoordinates(
          coordinates.lat,
          coordinates.lng,
        );
      }

      const user = await this.userRepository.create(
        { name, email, address, coordinates },
        session,
      );

      await session.commitTransaction();
      session.endSession();

      return {
        success: true,
        data: user,
      };
    } catch (error) {
      await session.abortTransaction();
      session.endSession();

      return {
        success: false,
        error: {
          message: error.message || "Failed to create user",
          code: "CREATE_USER_ERROR",
        },
      };
    }
  }

  async get(): Promise<Result<User[]>> {
    const session = await this.sessionService.startSession();
    session.startTransaction();

    try {
      const users = await this.userRepository.find(session);
      await session.commitTransaction();
      session.endSession();

      return {
        success: true,
        data: users,
      };
    } catch (error) {
      await session.abortTransaction();
      session.endSession();

      return {
        success: false,
        error: {
          message: error.message || "Failed to retrieve users",
          code: "GET_USERS_ERROR",
        },
      };
    }
  }

  async getById(id: string): Promise<Result<User | null>> {
    const session = await this.sessionService.startSession();
    session.startTransaction();
    try {
      const user = await this.userRepository.findById(id, session);
      await session.commitTransaction();
      session.endSession();
      return {
        success: true,
        data: user,
      };
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      return {
        success: false,
        error: {
          message: error.message || "Failed to retrieve user",
          code: "GET_USER_ERROR",
        },
      };
    }
  }

  async update(id: string, updateData: SaveUserDTO): Promise<Result<User>> {
    const session = await this.sessionService.startSession();
    session.startTransaction();

    try {
      if (updateData.email) {
        const existingUser = await this.userRepository.findUserByEmail(
          updateData.email,
        );
        if (existingUser && existingUser._id.toString() !== id) {
          return {
            success: false,
            error: {
              message: "The provided email is already in use.",
              code: "EMAIL_ALREADY_EXISTS",
            },
          };
        }
      }

      const user = await this.userRepository.update(id, updateData, session);

      if (!user) {
        return {
          success: false,
          error: {
            message: "User not found",
            code: "USER_NOT_FOUND",
          },
        };
      }

      await session.commitTransaction();
      session.endSession();

      return {
        success: true,
        data: user,
      };
    } catch (error) {
      await session.abortTransaction();
      session.endSession();

      return {
        success: false,
        error: {
          message: error.message || "Failed to update user",
          code: "UPDATE_USER_ERROR",
        },
      };
    }
  }

  async delete(id: string): Promise<Result<null>> {
    const session = await this.sessionService.startSession();
    session.startTransaction();

    try {
      const user = await this.userRepository.delete(id, session);

      if (!user) {
        return {
          success: false,
          error: {
            message: "User not found",
            code: "USER_NOT_FOUND",
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
          message: error.message || "Failed to delete user",
          code: "DELETE_USER_ERROR",
        },
      };
    }
  }
}
