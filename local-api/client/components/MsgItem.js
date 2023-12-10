import MsgInput from './MsgInput';

const MsgItem = ({
  id,
  user,
  userId,
  timestamp,
  text,
  isEditing,
  myId,
  onUpdate,
  onDelete,
  startEdit,
}) => {
  return (
    <li className="messages_item">
      <h3>
        {user?.nickname}{' '}
        <sub>
          {new Date(timestamp).toLocaleString('ko-KR', {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
          })}
        </sub>
      </h3>

      {isEditing ? (
        <MsgInput mutate={onUpdate} userId={myId} text={text} id={id} />
      ) : (
        text
      )}

      {myId === userId && (
        <div className="messages_buttons">
          <button onClick={startEdit}>수정</button>
          <button onClick={onDelete}>삭제</button>
        </div>
      )}
    </li>
  );
};

export default MsgItem;
