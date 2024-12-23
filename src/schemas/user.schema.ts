import { z } from 'zod';

const coordinatesSchema = z.object({
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
});

export const saveUserSchema = z
  .object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid email format'),
    address: z.string().optional(),
    coordinates: coordinatesSchema.optional(),
  })
  .refine(
    (data) =>
      (data.address && !data.coordinates) ||
      (!data.address && data.coordinates),
    {
      message: 'You must provide either address or coordinates, but not both.',
      path: ['address', 'coordinates'],
    }
  );
