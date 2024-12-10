import { describe, it, expect, vi, beforeEach } from "vitest";
import { UserService } from "../services/user.service";
import { UserRepository } from "../repositories/user.repository";
import { GeolocationService } from "../services/geolocation.service";
import { SessionService } from "../services/session.service";
import mongoose from "mongoose";

describe("UserService", () => {
  let userService: UserService;
  let userRepository: UserRepository;
  let geolocationService: GeolocationService;
  let sessionService: SessionService;

  beforeEach(() => {
    userRepository = {
      findUserByEmail: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      find: vi.fn(),
    } as unknown as UserRepository;

    geolocationService = {
      getCoordinatesFromAddress: vi.fn(),
      getAddressFromCoordinates: vi.fn(),
    } as unknown as GeolocationService;

    sessionService = {
      startSession: vi.fn(),
    } as unknown as SessionService;

    userService = new UserService(
      geolocationService,
      userRepository,
      sessionService,
    );
  });

  describe("create", () => {
    it("should create a user successfully", async () => {
      const mockSession = {
        startTransaction: vi.fn(),
        commitTransaction: vi.fn(),
        endSession: vi.fn(),
        abortTransaction: vi.fn(),
      } as unknown as mongoose.ClientSession;
      sessionService.startSession = vi.fn().mockResolvedValue(mockSession);

      const userData = {
        name: "John Doe",
        email: "john.doe@example.com",
        address: "Some Address",
        coordinates: { lat: 10, lng: 20 },
      };
      const userMock = { ...userData, _id: new mongoose.Types.ObjectId() };

      userRepository.findUserByEmail = vi.fn().mockResolvedValue(null);
      geolocationService.getCoordinatesFromAddress = vi
        .fn()
        .mockResolvedValue({ lat: 10, lng: 20 });
      userRepository.create = vi.fn().mockResolvedValue(userMock);

      const result = await userService.create(userData);

      expect(result.success).toBe(true);
      expect(result.data).toEqual(userMock);
      expect(userRepository.create).toHaveBeenCalledWith(userData, mockSession);
    });

    it("should return error if email already exists", async () => {
      const userData = {
        name: "John Doe",
        email: "john.doe@example.com",
        address: "Some Address",
        coordinates: { lat: 10, lng: 20 },
      };
      const mockSession = {
        startTransaction: vi.fn(),
        commitTransaction: vi.fn(),
        endSession: vi.fn(),
        abortTransaction: vi.fn(),
      } as unknown as mongoose.ClientSession;
      sessionService.startSession = vi.fn().mockResolvedValue(mockSession);

      userRepository.findUserByEmail = vi
        .fn()
        .mockResolvedValue({ _id: new mongoose.Types.ObjectId() });

      const result = await userService.create(userData);

      expect(result.success).toBe(false);
      expect(result.error?.message).toBe(
        "The provided email is already in use.",
      );
      expect(result.error?.code).toBe("EMAIL_ALREADY_EXISTS");
    });

    it("should return error if geolocation service fails", async () => {
      const userData = {
        name: "John Doe",
        email: "john.doe@example.com",
        address: "Some Address",
      };
      const mockSession = {
        startTransaction: vi.fn(),
        commitTransaction: vi.fn(),
        endSession: vi.fn(),
        abortTransaction: vi.fn(),
      } as unknown as mongoose.ClientSession;
      sessionService.startSession = vi.fn().mockResolvedValue(mockSession);

      userRepository.findUserByEmail = vi.fn().mockResolvedValue(null);
      geolocationService.getCoordinatesFromAddress = vi
        .fn()
        .mockRejectedValue(new Error("Geolocation error"));

      const result = await userService.create(userData);

      expect(result.success).toBe(false);
      expect(result.error?.message).toBe("Geolocation error");
      expect(result.error?.code).toBe("CREATE_USER_ERROR");
    });
  });

  describe("update", () => {
    it("should update user successfully", async () => {
      const mockSession = {
        startTransaction: vi.fn(),
        commitTransaction: vi.fn(),
        endSession: vi.fn(),
        abortTransaction: vi.fn(),
      } as unknown as mongoose.ClientSession;
      sessionService.startSession = vi.fn().mockResolvedValue(mockSession);

      const userId = new mongoose.Types.ObjectId();
      const updateData = { name: "John Doe", email: "new.email@example.com" };
      const existingUser = {
        _id: userId,
        name: "John Doe",
        email: "john.doe@example.com",
      };

      userRepository.findUserByEmail = vi.fn().mockResolvedValue(null);
      userRepository.update = vi
        .fn()
        .mockResolvedValue({ ...existingUser, ...updateData });

      const result = await userService.update(userId.toString(), updateData);

      expect(result.success).toBe(true);
      expect(result.data).toEqual({ ...existingUser, ...updateData });
      expect(userRepository.update).toHaveBeenCalledWith(
        userId.toString(),
        updateData,
        mockSession,
      );
    });

    it("should return error if email already exists during update", async () => {
      const userId = new mongoose.Types.ObjectId();
      const updateData = {
        name: "John Doe",
        email: "existing.email@example.com",
      };

      const mockSession = {
        startTransaction: vi.fn(),
        commitTransaction: vi.fn(),
        endSession: vi.fn(),
        abortTransaction: vi.fn(),
      } as unknown as mongoose.ClientSession;
      sessionService.startSession = vi.fn().mockResolvedValue(mockSession);

      userRepository.findUserByEmail = vi
        .fn()
        .mockResolvedValue({ _id: new mongoose.Types.ObjectId() }); // Usuário com esse email já existe

      const result = await userService.update(userId.toString(), updateData);

      expect(result.success).toBe(false);
      expect(result.error?.message).toBe(
        "The provided email is already in use.",
      );
      expect(result.error?.code).toBe("EMAIL_ALREADY_EXISTS");
    });

    it("should return error if user not found during update", async () => {
      const userId = new mongoose.Types.ObjectId();
      const updateData = {
        name: "Updated Name",
        email: "test.update@example.com",
      };

      userRepository.findUserByEmail = vi.fn().mockResolvedValue(null);
      userRepository.update = vi.fn().mockResolvedValue(null);

      const mockSession = {
        startTransaction: vi.fn(),
        commitTransaction: vi.fn(),
        endSession: vi.fn(),
        abortTransaction: vi.fn(),
      } as unknown as mongoose.ClientSession;
      sessionService.startSession = vi.fn().mockResolvedValue(mockSession);

      const result = await userService.update(userId.toString(), updateData);

      expect(result.success).toBe(false);
      expect(result.error?.message).toBe("User not found");
      expect(result.error?.code).toBe("USER_NOT_FOUND");
    });
  });

  describe("delete", () => {
    it("should delete user successfully", async () => {
      const mockSession = {
        startTransaction: vi.fn(),
        commitTransaction: vi.fn(),
        endSession: vi.fn(),
        abortTransaction: vi.fn(),
      } as unknown as mongoose.ClientSession;
      sessionService.startSession = vi.fn().mockResolvedValue(mockSession);

      const userId = new mongoose.Types.ObjectId();

      userRepository.delete = vi.fn().mockResolvedValue({ _id: userId });

      const result = await userService.delete(userId.toString());

      expect(result.success).toBe(true);
      expect(result.data).toBeNull();
      expect(userRepository.delete).toHaveBeenCalledWith(
        userId.toString(),
        mockSession,
      );
    });

    it("should return error if user not found during delete", async () => {
      const userId = new mongoose.Types.ObjectId();

      const mockSession = {
        startTransaction: vi.fn(),
        commitTransaction: vi.fn(),
        endSession: vi.fn(),
        abortTransaction: vi.fn(),
      } as unknown as mongoose.ClientSession;
      sessionService.startSession = vi.fn().mockResolvedValue(mockSession);

      userRepository.delete = vi.fn().mockResolvedValue(null);

      const result = await userService.delete(userId.toString());

      expect(result.success).toBe(false);
      expect(result.error?.message).toBe("User not found");
      expect(result.error?.code).toBe("USER_NOT_FOUND");
    });
  });
});
