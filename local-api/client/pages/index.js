import { fetcher } from '../queryClient';
import { GET_MESSAGES } from '../graphql/messages';
import { GET_USERS } from '../graphql/user';
import MsgList from '../components/MsgList';

const PageIndex = ({ smsgs, users }) => {
  return (
    <>
      <h1>SIMPLE SNS</h1>
      <MsgList smsgs={smsgs} users={users} />
    </>
  );
};

export const getServerSideProps = async () => {
  const { messages: smsgs } = await fetcher(GET_MESSAGES);
  const { users } = await fetcher(GET_USERS);

  return {
    props: {
      smsgs,
      users,
    },
  };
};

export default PageIndex;
