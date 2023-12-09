import { useRef } from 'react';

const MsgInput = ({ id = undefined, text = '', mutate }) => {
  const textRef = useRef();

  const onSubmit = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const text = textRef.current.value;
    mutate(text, id);
    textRef.current.value = '';
  };

  return (
    <form className="messages_input" onSubmit={onSubmit}>
      <textarea
        defaultValue={text}
        placeholder="내용을 입력하세요."
        ref={textRef}
      />
      <button type="submit">완료</button>
    </form>
  );
};

export default MsgInput;
