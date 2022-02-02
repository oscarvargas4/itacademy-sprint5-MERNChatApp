import express from 'express';
import MessageModel from '../models/Message';

const router = express.Router();

interface Messages {
  _id: any;
  room: string;
  user: string;
  messageBody: string;
  time: string;
  __v?: number;
}

// All messages

router.post('', async (req, res) => {
  try {
    if (req.body.room) {
      let room = req.body.room;
      const messages: Messages[] = await MessageModel.find({ room });
      let messagesFormated: Array<object> = [];
      for (let i = 0; i < messages.length; i++) {
        let username: string = messages[i].user;
        let message: string = messages[i].messageBody;
        let time: string = messages[i].time;
        messagesFormated[i] = { username, message, time };
      }
      res.json(messagesFormated);
    } else {
      const messages: Messages[] = await MessageModel.find({});
      res.json({ messages });
    }
  } catch (e) {
    res.status(400).json(e);
  }
});

module.exports = router;
