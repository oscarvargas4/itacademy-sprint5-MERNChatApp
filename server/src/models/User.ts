import { Schema, model } from 'mongoose';

interface User {
  name: String;
}

const UserSchema = new Schema<User>({
  name: { type: String, required: true },
});

const UserModel = model<User>('User', UserSchema);

export { UserSchema, UserModel };
