import { useState } from 'react';
import MsgItem from './MsgItem';
import MsgInput from './MsgInput';

const UserIds = ['roy', 'jay'];
const getRandomUserId = () => UserIds[Math.round(Math.random())];

const originalMsgs = Array(50)
  .fill(0)
  .map((_, i) => ({
    id: i + 1,
    userId: getRandomUserId(),
    timestamp: 1234567890123 + (50 - i) * 1000 * 60,
    text: `${50 - i} mock text`,
  }));

const MsgList = () => {
  const [msgs, setMsgs] = useState(originalMsgs);
  const [editingId, setEditingId] = useState(null);

  const onMsgCreate = (text) => {
    setMsgs((prev) => [
      {
        id: prev.length + 1,
        userId: getRandomUserId(),
        timestamp: Date.now(),
        text: `${prev.length + 1} ${text}`,
      },
      ...prev,
    ]);
  };

  const onMsgUpdate = (text, id) => {
    setMsgs((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              text,
            }
          : item
      )
    );
    setEditingId(null);
  };

  const onDelete = (id) => {
    setMsgs((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <>
      <MsgInput mutate={onMsgCreate} />
      <ul className="messages">
        {msgs.map((x) => (
          <MsgItem
            key={x.id}
            {...x}
            isEditing={x.id === editingId}
            onUpdate={onMsgUpdate}
            onDelete={() => onDelete(x.id)}
            startEdit={() => setEditingId(x.id)}
          />
        ))}
      </ul>
    </>
  );
};

export default MsgList;
