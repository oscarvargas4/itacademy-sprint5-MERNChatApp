import express from 'express';
import { UserModel } from '../models/User';

const router = express.Router();

router.get('', async (req, res) => {
  const rooms = await UserModel.find({});
  res.json(rooms);
});

module.exports = router;
