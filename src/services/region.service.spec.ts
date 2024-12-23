import { describe, it, expect, vi, beforeEach } from "vitest";
import { RegionService } from "./region.service";
import { RegionRepository } from "../repositories/region.repository";
import { UserRepository } from "../repositories/user.repository";
import { SessionService } from "./session.service";
import {
  SaveRegionDTO,
  CoordinatesPointDTO,
  QueryByDistanceDTO,
} from "../dtos/region.dto";
import { Region } from "../models/region.model";

describe("RegionService", () => {
  let regionService: RegionService;
  let regionRepositoryMock: RegionRepository;
  let userRepositoryMock: UserRepository;
  let sessionServiceMock: SessionService;

  beforeEach(() => {
    regionRepositoryMock = {
      create: vi.fn(),
      find: vi.fn(),
      findById: vi.fn(),
      findByQuery: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    } as unknown as RegionRepository;

    userRepositoryMock = {
      findById: vi.fn(),
    } as unknown as UserRepository;

    sessionServiceMock = {
      startSession: vi.fn().mockResolvedValue({
        startTransaction: vi.fn(),
        commitTransaction: vi.fn(),
        abortTransaction: vi.fn(),
        endSession: vi.fn(),
      }),
    } as unknown as SessionService;

    regionService = new RegionService(
      regionRepositoryMock,
      userRepositoryMock,
      sessionServiceMock,
    );
  });

  describe("create", () => {
    it("should successfully create a region", async () => {
      const regionData: SaveRegionDTO = {
        name: "Test Region",
        geometry: {
          type: "Polygon",
          coordinates: [
            [
              [-73.935242, 40.73061],
              [-73.935242, 40.73061],
            ],
          ],
        },
        ownerId: "validUserId",
      };

      userRepositoryMock.findById = vi
        .fn()
        .mockResolvedValueOnce({ id: "validUserId" });
      regionRepositoryMock.create = vi.fn().mockResolvedValueOnce({
        ...regionData,
        _id: "regionId",
      } as unknown as Region);

      const result = await regionService.create(regionData);

      expect(result.success).toBe(true);
      expect(result.data?.name).toBe(regionData.name);
    });

    it("should return error if user not found", async () => {
      const regionData: SaveRegionDTO = {
        name: "Test Region",
        geometry: {
          type: "Polygon",
          coordinates: [
            [
              [-73.935242, 40.73061],
              [-73.935242, 40.73061],
            ],
          ],
        },
        ownerId: "invalidUserId",
      };

      userRepositoryMock.findById = vi.fn().mockResolvedValueOnce(null);

      const result = await regionService.create(regionData);

      expect(result.success).toBe(false);
      expect(result.error?.message).toBe("The provided user id not exists");
    });

    it("should handle error during creation", async () => {
      const regionData: SaveRegionDTO = {
        name: "Test Region",
        geometry: {
          type: "Polygon",
          coordinates: [
            [
              [-73.935242, 40.73061],
              [-73.935242, 40.73061],
            ],
          ],
        },
        ownerId: "validUserId",
      };

      userRepositoryMock.findById = vi
        .fn()
        .mockResolvedValueOnce({ id: "validUserId" });
      regionRepositoryMock.create = vi
        .fn()
        .mockRejectedValueOnce(new Error("Failed to create region"));

      const result = await regionService.create(regionData);

      expect(result.success).toBe(false);
      expect(result.error?.message).toBe("Failed to create region");
    });
  });

  describe("get", () => {
    it("should return all regions", async () => {
      regionRepositoryMock.find = vi
        .fn()
        .mockResolvedValueOnce([{ name: "Region 1" }, { name: "Region 2" }]);

      const result = await regionService.get();

      expect(result.success).toBe(true);
      expect(result.data?.length).toBe(2);
    });

    it("should return error if unable to retrieve regions", async () => {
      regionRepositoryMock.find = vi
        .fn()
        .mockRejectedValueOnce(new Error("Failed to retrieve regions"));

      const result = await regionService.get();

      expect(result.success).toBe(false);
      expect(result.error?.message).toBe("Failed to retrieve regions");
    });
  });

  describe("getById", () => {
    it("should return region by id", async () => {
      const region = {
        _id: "regionId",
        name: "Test Region",
      } as unknown as Region;
      regionRepositoryMock.findById = vi.fn().mockResolvedValueOnce(region);

      const result = await regionService.getById("regionId");

      expect(result.success).toBe(true);
      expect(result.data?.name).toBe("Test Region");
    });
  });

  describe("getByPoint", () => {
    it("should return regions by point", async () => {
      const coordinates: CoordinatesPointDTO = {
        lat: "40.73061",
        lng: "-73.935242",
      };
      regionRepositoryMock.findByQuery = vi
        .fn()
        .mockResolvedValueOnce([{ name: "Test Region" }]);

      const result = await regionService.getByPoint(coordinates);

      expect(result.success).toBe(true);
      expect(result.data?.length).toBe(1);
    });

    it("should return error if unable to retrieve regions by point", async () => {
      const coordinates: CoordinatesPointDTO = {
        lat: "40.73061",
        lng: "-73.935242",
      };
      regionRepositoryMock.findByQuery = vi
        .fn()
        .mockRejectedValueOnce(new Error("Failed to retrieve regions"));

      const result = await regionService.getByPoint(coordinates);

      expect(result.success).toBe(false);
      expect(result.error?.message).toBe("Failed to retrieve regions");
    });
  });

  describe("getByDistance", () => {
    it("should return regions by distance", async () => {
      const query: QueryByDistanceDTO = {
        lat: "40.73061",
        lng: "-73.935242",
        distance: "1000",
      };
      regionRepositoryMock.findByQuery = vi
        .fn()
        .mockResolvedValueOnce([{ name: "Test Region" }]);

      const result = await regionService.getByDistance(query);

      expect(result.success).toBe(true);
      expect(result.data?.length).toBe(1);
    });

    it("should return error if unable to retrieve regions by distance", async () => {
      const query: QueryByDistanceDTO = {
        lat: "40.73061",
        lng: "-73.935242",
        distance: "1000",
      };
      regionRepositoryMock.findByQuery = vi
        .fn()
        .mockRejectedValueOnce(new Error("Failed to retrieve regions"));

      const result = await regionService.getByDistance(query);

      expect(result.success).toBe(false);
      expect(result.error?.message).toBe("Failed to retrieve regions");
    });
  });

  describe("update", () => {
    it("should successfully update a region", async () => {
      const regionId = "regionId";
      const updateData: SaveRegionDTO = {
        name: "Updated Region",
        geometry: {
          type: "Polygon",
          coordinates: [
            [
              [-73.935242, 40.73061],
              [-73.935242, 40.73061],
            ],
          ],
        },
        ownerId: "validUserId",
      };

      regionRepositoryMock.findById = vi.fn().mockResolvedValueOnce({
        _id: regionId,
        name: "Old Region",
      });
      regionRepositoryMock.update = vi.fn().mockResolvedValueOnce({
        ...updateData,
        _id: regionId,
      });

      userRepositoryMock.findById = vi
        .fn()
        .mockResolvedValueOnce({ id: "validUserId" });

      const result = await regionService.update(regionId, updateData);

      expect(result.success).toBe(true);
      expect(result.data?.name).toBe(updateData.name);
    });

    it("should return error if region not found during update", async () => {
      const regionId = "regionId";
      const updateData: SaveRegionDTO = {
        name: "Test Region",
        geometry: {
          type: "Polygon",
          coordinates: [
            [
              [-73.935242, 40.73061],
              [-73.935242, 40.73061],
            ],
          ],
        },
        ownerId: "validUserId",
      };

      regionRepositoryMock.findById = vi.fn().mockResolvedValueOnce(null);

      const result = await regionService.update(regionId, updateData);

      expect(result.success).toBe(false);
      expect(result.error?.message).toBe("Region not found");
    });
  });

  describe("delete", () => {
    it("should successfully delete a region", async () => {
      const regionId = "regionId";
      regionRepositoryMock.delete = vi
        .fn()
        .mockResolvedValueOnce({ _id: regionId });

      const result = await regionService.delete(regionId);

      expect(result.success).toBe(true);
      expect(result.data).toBeNull();
    });

    it("should return error if region not found during delete", async () => {
      const regionId = "regionId";
      regionRepositoryMock.delete = vi.fn().mockResolvedValueOnce(null);

      const result = await regionService.delete(regionId);

      expect(result.success).toBe(false);
      expect(result.error?.message).toBe("Region not found");
    });
  });
});
