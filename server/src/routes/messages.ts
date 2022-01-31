import express from 'express';
import MessageModel from '../models/Message';

const router = express.Router();

router.get('', async (req, res) => {
  const messages = await MessageModel.find({});
  res.json(messages);
});

module.exports = router;
