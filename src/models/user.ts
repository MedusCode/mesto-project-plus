import {
  model, Schema, Document, Model, Types,
} from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcrypt';
import { defaultUser } from '../config';
import { validateUrl } from '../assets/validation/validateUrl';
import { UnauthorizedError } from '../assets/errors/errors';

interface IUser {
  name: string;
  about: string;
  avatar: string;
  email: string;
  password: string;
}

interface IUserModel extends Model<IUser> {
  // eslint-disable-next-line no-unused-vars
  findUserByCredentials: (email: string, password: string) => Promise<Document<unknown, any, IUser>
    & IUser
    & { _id: Types.ObjectId }>;
}

const UserSchema = new Schema<IUser>({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (value: string) => validator.isEmail(value),
      message: 'impossible email',
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: defaultUser.NAME,
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 200,
    default: defaultUser.ABOUT,
  },
  avatar: {
    type: String,
    validate: {
      validator: validateUrl,
      message: 'impossible URL',
    },
    default: defaultUser.AVATAR,
  },
}, { versionKey: false });

UserSchema.index({ email: 1 }, { unique: true });

UserSchema.static('findUserByCredentials', function findUserByCredentials(email: string, password: string) {
  return this.findOne({ email })
    .select('+password')
    .then((user: IUser | null) => {
      if (!user) {
        throw new UnauthorizedError('Неправильные почта или пароль');
      }

      return bcrypt.compare(password, user.password)
        .then((isMatched) => {
          if (!isMatched) throw new UnauthorizedError('Неправильные почта или пароль');

          return user;
        });
    });
});

export default model<IUser, IUserModel>('user', UserSchema);
export { IUser };
