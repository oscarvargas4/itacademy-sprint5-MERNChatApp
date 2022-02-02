import { Schema, model } from 'mongoose';
import { UserSchema } from './User';
import { RoomSchema } from './Room';

interface Message {
  room: string;
  user: string;
  messageBody: string;
  time: string;
}

const schema = new Schema<Message>({
  room: { type: String, required: true },
  user: { type: String, required: true },
  messageBody: { type: String },
  time: { type: String },
});

const MessageModel = model<Message>('Message', schema);

export default MessageModel;
