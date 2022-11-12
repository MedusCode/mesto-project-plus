import { model, Schema } from 'mongoose';
import validateUrl from '../assets/validateUrl';

interface IUser {
  name: string;
  about: string;
  avatar: string;
}

const UserSchema = new Schema<IUser>({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  about: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 200,
  },
  avatar: {
    type: String,
    required: true,
    validate: {
      validator: validateUrl,
      message: 'avatar should be a URL',
    },
  },
});

export default model<IUser>('user', UserSchema);
