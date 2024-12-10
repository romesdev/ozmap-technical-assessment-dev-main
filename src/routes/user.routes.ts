import { Router } from 'express';
import { validateData } from '../middlewares/validation.middleware';
import { saveUserSchema } from '../schemas/user.schema';
import { UserRepository } from '../repositories/user.repository';
import { GeolocationService } from '../services/geolocation.service';
import { makeUserController } from '../factories/user';
import { SessionService } from '../services/session.service';

const router = Router();
const userRepository = new UserRepository();
const geolocationService = new GeolocationService();
const sessionService = new SessionService();
const userController = makeUserController(
  userRepository,
  geolocationService,
  sessionService
);

router.post(
  '/',
  validateData(saveUserSchema),
  userController.create.bind(userController)
);
router.get('/', userController.get.bind(userController));
router.put(
  '/:id',
  validateData(saveUserSchema),
  userController.update.bind(userController)
);
router.delete('/:id', userController.delete.bind(userController));

export default router;
