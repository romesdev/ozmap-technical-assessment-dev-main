import { Request, Response } from "express";
import { RegionService } from "../services/region.service";
import { HTTP_STATUS_CODE } from "../utils/constants";

export class RegionController {
  constructor(private readonly regionService: RegionService) {}

  async create(req: Request, res: Response) {
    const { name, geometry, ownerId } = req.body;

    const response = await this.regionService.create({
      name,
      geometry,
      ownerId,
    });

    if (response.success === false)
      return res.status(HTTP_STATUS_CODE.BAD_REQUEST).json(response);

    return res.status(HTTP_STATUS_CODE.CREATED).json(response);
  }

  async get(req: Request, res: Response) {
    const { page, limit } = req.query;

    const response = await this.regionService.get(Number(page), Number(limit));
    if (response.success === false)
      return res.status(HTTP_STATUS_CODE.BAD_REQUEST).json(response);

    return res.status(HTTP_STATUS_CODE.OK).json(response);
  }

  async getByPoint(req: Request, res: Response) {
    const { lat, lng, page, limit } = req.query;

    const coordinates = {
      lat: lat as unknown as string,
      lng: lng as unknown as string,
    };

    const response = await this.regionService.getByPoint(
      coordinates,
      Number(page),
      Number(limit),
    );
    if (response.success === false)
      return res.status(HTTP_STATUS_CODE.BAD_REQUEST).json(response);

    return res.status(HTTP_STATUS_CODE.OK).json(response);
  }

  async getByDistance(req: Request, res: Response) {
    const { lat, lng, distance, page, limit } = req.query;

    const query = {
      lat: lat as unknown as string,
      lng: lng as unknown as string,
      distance: distance as unknown as string,
    };

    const response = await this.regionService.getByDistance(
      query,
      Number(page),
      Number(limit),
    );
    if (response.success === false)
      return res.status(HTTP_STATUS_CODE.BAD_REQUEST).json(response);

    return res.status(HTTP_STATUS_CODE.OK).json(response);
  }
  async getById(req: Request, res: Response) {
    const { id } = req.params;

    const response = await this.regionService.getById(id);

    if (response.success === false)
      return res.status(HTTP_STATUS_CODE.BAD_REQUEST).json(response);

    return res.status(HTTP_STATUS_CODE.OK).json(response);
  }

  async update(req: Request, res: Response) {
    const { id } = req.params;
    const response = await this.regionService.update(id, req.body);
    if (response.success === false)
      return res.status(HTTP_STATUS_CODE.BAD_REQUEST).json(response);

    return res.status(HTTP_STATUS_CODE.OK).json(response);
  }

  async delete(req: Request, res: Response) {
    const { id } = req.params;
    const response = await this.regionService.delete(id);
    if (response.success === false)
      return res.status(HTTP_STATUS_CODE.BAD_REQUEST).json(response);

    return res
      .status(HTTP_STATUS_CODE.OK)
      .json({ message: "Region deleted with success" });
  }
}
