import { FC, useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { useAppDispatch, useAppSelector } from '../../services/hooks/hooks';
import { getAllUsers } from '../../services/reducers/user.slice';
import { TUserRegisterResponse } from '../../utils/types/types';
import UserInfoCard from '../UserInfoCard/UserInfoCard';

const UserDivisionComponent: FC = () => {
  const { isLoading, allUsers, error } = useAppSelector((state) => ({
    isLoading: state.users.isLoading,
    allUsers: state.users.allUsers,
    error: state.users.error,
  }));

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getAllUsers());
  }, []);

  const leaders = allUsers?.filter((user) => user.role === 'manager');
  const subordinates = allUsers?.filter((user) => user.role === 'subordinate');

  return (
    <Grid container spacing={2}>
      <Grid item xs={6}>
        <Typography variant="h6" gutterBottom>
          Руководители
        </Typography>
        {leaders?.map((user: TUserRegisterResponse) => (
          <UserInfoCard key={user.id} user={user} allUsers={allUsers} />
        )) || null}
      </Grid>
      <Grid item xs={6}>
        <Typography variant="h6" gutterBottom>
          Подчиненные
        </Typography>
        {subordinates?.map((user) => (
          <UserInfoCard key={user.id} user={user} allUsers={allUsers} />
        )) || null}
      </Grid>
    </Grid>
  );
};

export default UserDivisionComponent;
