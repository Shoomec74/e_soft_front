import { FC } from 'react';
import Header from '../../components/Header/Header';
import UserDivisionComponent from '../../components/UserDivision/UserDivision';
import { Can } from '../../ability/AbilityContext';

const AdminPanel: FC = () => {
  return (
    <>
      <Header />
      <UserDivisionComponent />
    </>
  );
};

export default AdminPanel;
