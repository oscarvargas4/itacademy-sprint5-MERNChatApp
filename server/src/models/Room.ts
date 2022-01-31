import { Schema, model } from 'mongoose';
import { UserSchema } from './User';

interface Room {
  name: String;
  users: any;
}

const RoomSchema = new Schema<Room>({
  name: { type: String, required: true },
  users: [UserSchema],
  // messages
});

const RoomModel = model<Room>('Room', RoomSchema);

export { RoomSchema, RoomModel };
