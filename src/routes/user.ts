import { Router } from 'express';
import {
  getMe, getUser, getUsers, updateAvatar, updateUser,
} from '../controllers/user';
import { idParamsValidator, updateAvatarValidator, updateUserValidator } from '../assets/validation/validators';

const router = Router();

router.get('/', getUsers);
router.get('/me', getMe);
router.get('/:id', idParamsValidator, getUser);
router.patch('/me', updateUserValidator, updateUser);
router.patch('/me/avatar', updateAvatarValidator, updateAvatar);

export default router;
