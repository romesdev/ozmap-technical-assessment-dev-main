import { z } from "zod";
import { queryPaginationSchema } from "./pagination.schema";

// Validation for GeoJSON Polygon coordinates
const coordinatesSchema = z
  .array(
    z.array(
      z.tuple([
        z
          .number()
          .min(-180)
          .max(180, "Longitude must be between -180 and 180."),
        z.number().min(-90).max(90, "Latitude must be between -90 and 90."),
      ]),
    ),
  )
  .refine(
    (rings) => {
      // Each ring must have at least 4 points (including polygon closure)
      return rings.every((ring) => ring.length >= 4);
    },
    { message: "Each ring of the polygon must have at least 4 points." },
  )
  .refine(
    (rings) => {
      // The first and last points of each ring must be the same
      return rings.every(
        (ring) =>
          ring[0][0] === ring[ring.length - 1][0] &&
          ring[0][1] === ring[ring.length - 1][1],
      );
    },
    { message: "The first and last points of each ring must be the same." },
  );

// Validation for GeoJSON Polygon object
const geometrySchema = z.object({
  type: z.literal("Polygon"), // Must be exactly the type Polygon
  coordinates: coordinatesSchema,
});

// Schema to validate region creation
export const saveRegionSchema = z.object({
  name: z.string().min(1, "The name is required."),
  geometry: geometrySchema,
  ownerId: z.string().regex(/^[a-fA-F0-9]{24}$/, "Invalid user ID."), // MongoDB ObjectId
});

// Schema to validate region update
export const updateRegionSchema = z.object({
  name: z.string().optional(),
  geometry: geometrySchema.optional(),
  ownerId: z
    .string()
    .regex(/^[a-fA-F0-9]{24}$/, "Invalid user ID.")
    .optional(),
});

export const queryRegionsByDistanceSchema = z
  .object({
    lat: z.coerce
      .number({ required_error: "Latitude is required" })
      .min(-90, "Latitude must be between -90 and 90")
      .max(90, "Latitude must be between -90 and 90"),
    lng: z.coerce
      .number({ required_error: "Longitude is required" })
      .min(-180, "Longitude must be between -180 and 180")
      .max(180, "Longitude must be between -180 and 180"),
    distance: z.coerce
      .number({ required_error: "Distance is required" })
      .positive("Distance must be a positive number"),
  })
  .and(queryPaginationSchema);

export const queryRegionsByPointSchema = z
  .object({
    lat: z.coerce
      .number({ required_error: "Latitude is required" })
      .min(-90, "Latitude must be between -90 and 90")
      .max(90, "Latitude must be between -90 and 90"),
    lng: z.coerce
      .number({ required_error: "Longitude is required" })
      .min(-180, "Longitude must be between -180 and 180")
      .max(180, "Longitude must be between -180 and 180"),
  })
  .and(queryPaginationSchema);
