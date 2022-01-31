import { Schema, model } from 'mongoose';
import { UserSchema } from './User';
import { RoomSchema } from './Room';

interface Message {
  room: any;
  user: any;
  messageBody: string;
}

const schema = new Schema<Message>({
  room: { type: RoomSchema, required: true },
  user: { type: UserSchema, required: true },
  messageBody: { type: String },
});

const MessageModel = model<Message>('Message', schema);

export default MessageModel;
