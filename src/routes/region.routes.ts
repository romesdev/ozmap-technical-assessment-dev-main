import { Router } from 'express';
import { validateData } from '../middlewares/validation.middleware';
import {
  queryRegionsByDistanceSchema,
  queryRegionsByPointSchema,
  saveRegionSchema,
} from '../schemas/region.schema';
import { makeRegionController } from '../factories/region';
import { UserRepository } from '../repositories/user.repository';
import { SessionService } from '../services/session.service';
import { RegionRepository } from '../repositories/region.repository';
import { RegionModel } from '../models/region.model';
import { validateQuery } from '../middlewares/validateQuery.middleware';
import { UserModel } from '../models/user.model';

const router = Router();

const regionRepository = new RegionRepository(RegionModel);
const sessionService = new SessionService();
const userRepository = new UserRepository(UserModel);

const regionController = makeRegionController(
  regionRepository,
  userRepository,
  sessionService
);

router.post(
  '/',
  validateData(saveRegionSchema),
  regionController.create.bind(regionController)
);
router.get('/', regionController.get.bind(regionController));
router.get('/:id', regionController.getById.bind(regionController));
router.get(
  '/point',
  validateQuery(queryRegionsByPointSchema),
  regionController.getByPoint.bind(regionController)
);
router.get(
  '/distance',
  validateQuery(queryRegionsByDistanceSchema),
  regionController.getByDistance.bind(regionController)
);
router.put(
  '/:id',
  validateData(saveRegionSchema),
  regionController.update.bind(regionController)
);
router.delete('/:id', regionController.delete.bind(regionController));

export default router;
