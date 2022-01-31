import { Schema, model } from 'mongoose';
import { UserSchema } from './User';

interface Room {
  name: String;
  users: any;
}

const schema = new Schema<Room>({
  name: { type: String, required: true },
});

const RoomModel = model<Room>('Room', schema);

export default RoomModel;
