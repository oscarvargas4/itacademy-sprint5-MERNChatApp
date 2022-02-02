import express from 'express';
import { RoomModel } from '../models/Room';

const router = express.Router();

router.get('', async (req, res) => {
  const rooms = await RoomModel.find({});
  res.json(rooms);
});

module.exports = router;
