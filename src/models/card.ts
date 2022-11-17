import { model, Schema } from 'mongoose';
import { validateUrl } from '../assets/validation/validateUrl';

interface ICard {
  name: string;
  link: string;
  owner: Schema.Types.ObjectId;
  likes: Array<Schema.Types.ObjectId>;
  createdAt: Date;
}

const CardSchema = new Schema<ICard>({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  link: {
    type: String,
    required: true,
    validate: {
      validator: validateUrl,
      message: 'impossible URL',
    },
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  likes: [{
    type: Schema.Types.ObjectId,
    ref: 'user',
    default: [],
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, { versionKey: false });

export default model<ICard>('card', CardSchema);
export { ICard };
