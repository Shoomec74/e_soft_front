import React from 'react';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

const usersData = {
  leaders: [
    { id: 1, login: 'leader1', firstName: 'John', lastName: 'Doe', middleName: 'K.' },
    { id: 1, login: 'leader1', firstName: 'John', lastName: 'Doe', middleName: 'K.' },
    { id: 1, login: 'leader1', firstName: 'John', lastName: 'Doe', middleName: 'K.' },
    // Другие руководители
  ],
  subordinates: [
    { id: 2, login: 'sub1', firstName: 'Jane', lastName: 'Doe', middleName: 'L.' },
    // Другие подчиненные
  ],
};

const UserInfoCard = ({ user }: any) => (
  <Card sx={{ minWidth: 275, marginBottom: 2 }}>
    <CardContent>
      <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
        ID: {user.id}
      </Typography>
      <Typography variant="h5" component="div">
        {user.login}
      </Typography>
      <Typography sx={{ mb: 1.5 }} color="text.secondary">
        {user.firstName} {user.middleName} {user.lastName}
      </Typography>
    </CardContent>
  </Card>
);

const UserDivisionComponent = () => (
  <Grid container spacing={2}>
    <Grid item xs={6}>
      <Typography variant="h6" gutterBottom>
        Руководители
      </Typography>
      {usersData.leaders.map((user) => (
        <UserInfoCard key={user.id} user={user} />
      ))}
    </Grid>
    <Grid item xs={6}>
      <Typography variant="h6" gutterBottom>
        Подчиненные
      </Typography>
      {usersData.subordinates.map((user) => (
        <UserInfoCard key={user.id} user={user} />
      ))}
    </Grid>
  </Grid>
);

export default UserDivisionComponent;
