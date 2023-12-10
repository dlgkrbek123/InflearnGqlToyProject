import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/router';
import useInfiniteScroll from '../hooks/useInfiniteScroll';
import fetcher from '../fetcher';
import MsgItem from './MsgItem';
import MsgInput from './MsgInput';

const MsgList = ({ smsgs, users }) => {
  const [msgs, setMsgs] = useState(smsgs);
  const [editingId, setEditingId] = useState(null);
  const [hasNext, setHasNext] = useState(true);

  const fetchMoreEl = useRef(null);
  const { query } = useRouter();

  const userId = query.userId || query.userid || '';
  const intersecting = useInfiniteScroll(fetchMoreEl);

  const onMsgCreate = async (text) => {
    const newMsg = await fetcher('post', '/messages', { text, userId });

    if (newMsg) setMsgs((msgs) => [newMsg, ...msgs]);
  };

  const onMsgUpdate = async (text, id) => {
    const msg = await fetcher('put', `/messages/${id}`, { text, userId });

    if (msg) {
      setMsgs((prev) => prev.map((item) => (item.id === id ? msg : item)));
      setEditingId(null);
    }
  };

  const onDelete = async (id) => {
    const receivedId = await fetcher('delete', `/messages/${id}`, {
      params: { userId },
    });
    setMsgs((msgs) => msgs.filter((msg) => msg.id !== `${receivedId}`));
  };

  const getMessages = async () => {
    const newMsgs = await fetcher('get', '/messages', {
      params: {
        cursor: msgs[msgs.length - 1]?.id || '',
      },
    });

    if (newMsgs.length === 0) setHasNext(false);
    else setMsgs((msgs) => [...msgs, ...newMsgs]);
  };

  useEffect(() => {
    if (intersecting && hasNext) getMessages();
  }, [intersecting]);

  return (
    <>
      <MsgInput mutate={onMsgCreate} userId={userId} />
      <ul className="messages">
        {msgs.map((x) => (
          <MsgItem
            key={x.id}
            {...x}
            isEditing={x.id === editingId}
            myId={userId}
            user={users[x.userId]}
            onUpdate={onMsgUpdate}
            onDelete={() => onDelete(x.id)}
            startEdit={() => setEditingId(x.id)}
          />
        ))}
      </ul>
      <div ref={fetchMoreEl} />
    </>
  );
};

export default MsgList;
