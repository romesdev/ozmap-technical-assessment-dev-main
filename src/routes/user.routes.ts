import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { validateData } from '../middlewares/validationMiddleware';
import { saveUserSchema } from '../dtos/user.dto';

const router = Router();

router.post('/', validateData(saveUserSchema), UserController.createUser);
router.get('/', UserController.getUsers);
router.put('/:id', validateData(saveUserSchema), UserController.updateUser);
router.delete('/:id', UserController.deleteUser);

export default router;
