import { FC } from 'react';
import Header from '../../components/Header/Header';
import UserDivisionComponent from '../../components/UserDivision/UserDivision';

const AdminPanel: FC = () => {
  return (
    <>
      <Header />
      <UserDivisionComponent />
    </>
  );
};

export default AdminPanel;
