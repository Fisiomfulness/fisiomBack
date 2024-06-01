// @ts-check
const {
  PublicChatCreatedEvent,
} = require('#src/modules/chat/models/PublicChatCreatedEvent');
const {
  internalEventBus,
} = require('#src/modules/event/models/InternalEventBus');
const { rooms } = require('#src/state');

const Router = require('express-promise-router').default;

const router = Router();

router.get('/', (_req, res) => {
  res.sendFile(process.cwd() + '/index.html');
});

router.post('/room', (req, res) => {
  console.log('body', req.body);
  if (rooms[req.body.room] != null) {
    return res.json({ ok: false });
  }

  rooms[req.body.room] = { users: {} };
  console.log('Debug: chatRouter.js:18: rooms=', rooms);
  // res.redirect('/chat/' + req.body.room);

  internalEventBus.publish(
    new PublicChatCreatedEvent({ roomName: req.body.room }),
  );

  res.json({ ok: true });
});

router.get('/:room', (req, res) => {
  if (rooms[req.params.room] == null) {
    return res.redirect('/chat');
  }

  res.sendFile(process.cwd() + '/room.html');
});

module.exports = router;
