import { Schema, model, connect } from 'mongoose';

interface User {
  name: String;
}

const schema = new Schema<User>({
  name: { type: String, required: true },
});

const UserModel = model<User>('User', schema);

export default UserModel;
