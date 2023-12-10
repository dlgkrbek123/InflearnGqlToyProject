import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import useInfiniteScroll from '../hooks/useInfiniteScroll';
import { fetcher, QueryKeys } from '../queryClient';
import {
  CREATE_MESSAGE,
  DELETE_MESSAGE,
  GET_MESSAGES,
  UPDATE_MESSAGE,
} from '../graphql/messages';

import MsgItem from './MsgItem';
import MsgInput from './MsgInput';

const MsgList = ({ smsgs, users }) => {
  const [msgs, setMsgs] = useState(smsgs);
  const [editingId, setEditingId] = useState(null);

  const { query } = useRouter();
  const userId = query.userId || query.userid || '';

  // const [hasNext, setHasNext] = useState(true);
  // const fetchMoreEl = useRef(null);
  // const intersecting = useInfiniteScroll(fetchMoreEl);

  const { data, error, isError } = useQuery(QueryKeys.MESSAGES, () =>
    fetcher(GET_MESSAGES)
  );

  const client = useQueryClient();

  const { mutate: onMsgCreate } = useMutation(({ text, id }) =>
    fetcher(
      CREATE_MESSAGE,
      { text, userId },
      {
        onSuccess: ({ createMessage }) => {
          client.setQueryData(QueryKeys.MESSAGES, (old) => {
            return {
              messages: [createMessage, ...old.messages],
            };
          });
        },
      }
    )
  );

  const { mutate: onMsgUpdate } = useMutation(
    ({ text, id }) => fetcher(UPDATE_MESSAGE, { text, id, userId }),
    {
      onSuccess: ({ updateMessage }) => {
        client.setQueryData(QueryKeys.MESSAGES, (old) => {
          return {
            messages: old.messages.map((item) =>
              item.id === updateMessage.id ? updateMessage : item
            ),
          };
        });
        setEditingId(null);
      },
    }
  );

  const { mutate: onDelete } = useMutation(
    (id) => fetcher(DELETE_MESSAGE, { id, userId }),
    {
      onSuccess: ({ deleteMessage }) => {
        client.setQueryData(QueryKeys.MESSAGES, (old) => {
          return {
            messages: old.messages.filter((msg) => msg.id !== deleteMessage),
          };
        });
      },
    }
  );

  // const getMessages = async () => {
  //   const newMsgs = await fetcher('get', '/messages', {
  //     params: {
  //       cursor: msgs[msgs.length - 1]?.id || '',
  //     },
  //   });

  //   if (newMsgs.length === 0) setHasNext(false);
  //   else setMsgs((msgs) => [...msgs, ...newMsgs]);
  // };

  // useEffect(() => {
  //   if (intersecting && hasNext) getMessages();
  // }, [intersecting]);

  return (
    <>
      <MsgInput mutate={onMsgCreate} userId={userId} />
      <ul className="messages">
        {data.messages.map((x) => (
          <MsgItem
            key={x.id}
            {...x}
            isEditing={x.id === editingId}
            myId={userId}
            user={users.find((u) => u.id === x.userId)}
            onUpdate={onMsgUpdate}
            onDelete={() => onDelete(x.id)}
            startEdit={() => setEditingId(x.id)}
          />
        ))}
      </ul>
      {/* <div ref={fetchMoreEl} /> */}
    </>
  );
};

export default MsgList;
