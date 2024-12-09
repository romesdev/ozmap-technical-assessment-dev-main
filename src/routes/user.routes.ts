import { Router } from 'express';
import { UserController } from '../controllers/user.controller';

const router = Router();

router.post('/', UserController.createUser);
router.get('/', UserController.getUsers);
router.put('/:id', UserController.updateUser);
router.delete('/:id', UserController.deleteUser);

export default router;
