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

  const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    // Предполагается, что функция clearErrorsState() существует
    dispatch(clearErrorsState());
    if (clearState) {
      dispatch(clearState());
    }
  };

  // Определяем, следует ли отображать уведомление
  const shouldShowNotification = !!componentError || flag;

  // Определяем тип уведомления и текст
  const alertSeverity = componentError ? 'error' : 'success';
  const message = componentError ? componentError : successString;

  return (
    <Snackbar
      open={shouldShowNotification}
      autoHideDuration={3000}
      onClose={handleClose}
    >
      <Alert
        onClose={handleClose}
        severity={alertSeverity}
        variant="filled"
        sx={{ width: '100%' }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

export default Notifications;
