import { Snackbar, Alert } from '@mui/material';
import { FC } from 'react';
import { useAppDispatch } from '../../services/hooks/hooks';
import { clearErrorsState } from '../../services/reducers/commonActions';
import { UnknownAction } from '@reduxjs/toolkit';

interface IProps {
  componentError: string | null;
  flag: boolean;
  successString: string;
  clearState?: () => UnknownAction;
}

const Notifications: FC<IProps> = ({
  componentError,
  flag,
  successString,
  clearState,
}) => {
  const dispatch = useAppDispatch();

  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string,
  ) => {
    if (reason === 'clickaway') {
      return;
    }

    dispatch(clearErrorsState());
    if (clearState) {
      dispatch(clearState());
    }
  };

  return (
    <Snackbar
      open={!!componentError || flag}
      autoHideDuration={3000}
      onClose={handleClose}
    >
      <Alert
        onClose={handleClose}
        severity={!flag ? 'error' : 'success'}
        variant="filled"
        sx={{ width: '100%' }}
      >
        {!flag ? `${componentError}` : successString}
      </Alert>
    </Snackbar>
  );
};

export default Notifications;
