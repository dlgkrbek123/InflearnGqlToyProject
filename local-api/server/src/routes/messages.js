import { v4 } from 'uuid';
import { readDB, writeDB } from '../dbController.js';

const getMessages = () => readDB('messages');
const setMessages = (data) => writeDB('messages', data);

const messagesRoute = [
  {
    method: 'get',
    route: '/messages',
    handler: (req, res) => {
      const msgs = getMessages();
      res.send(msgs);
    },
  },
  {
    method: 'get',
    route: '/messages/:id',
    handler: ({ params: { id } }, res) => {
      try {
        const msgs = getMessages();
        const msg = msgs.find((m) => m.id === id);

        if (!msg) throw Error('not found');
        res.send(msg);
      } catch (err) {
        res.status(404).send({ error: err });
      }
    },
  },
  {
    method: 'post',
    route: '/messages',
    handler: ({ body }, res) => {
      const { userId, text } = body;
      const msgs = getMessages();
      const newMsg = {
        id: v4(),
        userId,
        text,
        timestamp: Date.now(),
      };

      msgs.unshift(newMsg);
      setMessages(msgs);
      res.send(newMsg);
    },
  },
  {
    method: 'put',
    route: '/messages/:id',
    handler: ({ body, params: { id } }, res) => {
      try {
        const msgs = getMessages();
        const targetIndex = msgs.findIndex((msg) => msg.id === id);

        if (targetIndex === -1) throw '메시지가 없습니다.';
        if (msgs[targetIndex].userId !== body.userId)
          throw '사용자가 다릅니다.';

        const newMsg = {
          ...msgs[targetIndex],
          text: body.text,
        };
        msgs.splice(targetIndex, 1, newMsg);
        setMessages(msgs);
        res.send(newMsg);
      } catch (err) {
        res.status(500).send({ error: err });
      }
    },
  },
  {
    method: 'delete',
    route: '/messages/:id',
    handler: ({ body, params: { id } }, res) => {
      try {
        const msgs = getMessages();
        const targetIndex = msgs.findIndex((msg) => msg.id === id);

        if (targetIndex === -1) throw '메시지가 없습니다.';
        if (msgs[targetIndex].userId !== body.userId)
          throw '사용자가 다릅니다.';

        msgs.splice(targetIndex, 1);
        setMessages(msgs);
        res.send(id);
      } catch (err) {
        res.status(500).send({ error: err });
      }
    },
  },
];

export default messagesRoute;
