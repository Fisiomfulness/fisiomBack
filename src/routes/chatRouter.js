// @ts-check
const {
  PublicChatCreatedEvent,
} = require('#src/modules/chat/models/PublicChatCreatedEvent');
const {
  internalEventBus,
} = require('#src/modules/event/models/InternalEventBus');
const { newRooms } = require('#src/state');

const Router = require('express-promise-router').default;
const router = Router();

router.get('/', (_req, res) => {
  res.sendFile(process.cwd() + '/index.html');
});

router.get('/rooms', (_, res) => {
  return res.json({ newRooms: Object.fromEntries(newRooms) });
});

router.post('/room', (req, res) => {
  const { room } = req.body;

  if (newRooms.has(room)) {
    return res.json({ ok: false });
  }

  newRooms.set(room, { users: {} });

  internalEventBus.publish(new PublicChatCreatedEvent({ roomName: room }));

  res.json({ ok: true });
});

router.get('/:room', (req, res) => {
  const { room } = req.params;
  if (!newRooms.has(room)) {
    return res.json({ ok: false });
  }

  res.sendFile(process.cwd() + '/room.html');
});

module.exports = router;
