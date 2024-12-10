import { Router } from 'express';
import { RegionController } from '../controllers/region.controller';
import { validateData } from '../middlewares/validationMiddleware';
import { createRegionSchema } from '../schemas/region.schema';

const router = Router();

router.post(
  '/',
  validateData(createRegionSchema),
  RegionController.createRegion
);
router.get('/', RegionController.listRegions);
router.get('/containing-point', RegionController.regionsContainingPoint);
router.get('/within-distance', RegionController.regionsWithinDistance);

export default router;
