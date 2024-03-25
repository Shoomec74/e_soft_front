import { FC, useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import moment from 'moment';
import { TCreateTaskResponse, TypeForm } from '../../utils/types/types';

interface IProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  handleSubmitDialog: (data: Record<string, string>) => void;
  typeForm: TypeForm;
  disableFlag?: boolean;
  task?: TCreateTaskResponse | null;
}

const FormDialog: FC<IProps> = ({
  open,
  onClose,
  children,
  handleSubmitDialog,
  typeForm,
  disableFlag,
  task,
}) => {
  const [selectedDate, setSelectedDate] = useState<moment.Moment | null>(null);

  const handleDateChange = (date: moment.Moment | null) => {
    setSelectedDate(date);
  };

  useEffect(() => {
    if (task) {
      setSelectedDate(moment(task?.deadline));
    }
  }, [task]);

  useEffect(() => {
    if (!task) {
      setSelectedDate(moment());
    }
  }, []);

  const dialogTitle =
    typeForm === TypeForm.REGISTER_USER
      ? 'Регистрация нового пользователя'
      : typeForm === TypeForm.UPDATE_USER
      ? 'Обновление пользователя'
      : typeForm === TypeForm.CREATE_TASK
      ? 'Создание задачи'
      : typeForm === TypeForm.UPDATE_TASK
      ? 'Обновление задачи'
      : 'Действие по умолчанию';

  const dialogContent =
    typeForm === TypeForm.REGISTER_USER
      ? 'Сначала создайте нужное кол-во подчиненных, чтобы потом добавить их к руководителю.'
      : typeForm === TypeForm.UPDATE_USER
      ? 'Обновите данные пользователя с помощью изменения полей. Прежде чем изменить пароль пользователя передайте его пользователю.'
      : typeForm === TypeForm.CREATE_TASK
      ? 'При создании задачи по умолчанию будет выставлен статус "К выполнению". Не выбирайте подчиненного, если хотите создать задачу для себя.'
      : typeForm === TypeForm.UPDATE_TASK
      ? 'Обновление информации по вашей задаче.'
      : 'Действие по умолчанию';

  return (
    <>
      <Dialog
        open={open === undefined ? false : open}
        onClose={onClose}
        PaperProps={{
          component: 'form',
          onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            // Преобразование данных формы в объект
            const formJson = Object.fromEntries((formData as any).entries());

            const fullSubmitObj: Record<string, string> = {
              ...formJson,
              deadline: selectedDate ? selectedDate.toISOString() : '',
            };

            // Создаем новый объект без пустых полей
            let cleanedSubmitObj: Record<string, string> = {};
            for (const key in fullSubmitObj) {
              if (Object.hasOwnProperty.call(fullSubmitObj, key)) {
                const value = fullSubmitObj[key];
                if (value.trim() !== '') {
                  cleanedSubmitObj[key] = value;
                }
              }
            }
            console.log(cleanedSubmitObj);
            handleSubmitDialog(cleanedSubmitObj);
            onClose();
          },
        }}
      >
        <DialogTitle>{dialogTitle}</DialogTitle>
        <DialogContent>
          <DialogContentText>{dialogContent}</DialogContentText>
          <>{children}</>
          <LocalizationProvider dateAdapter={AdapterMoment}>
            {typeForm !== TypeForm.REGISTER_USER &&
              typeForm !== TypeForm.UPDATE_USER && (
                <DatePicker
                  sx={{ mt: 2, mb: 2 }}
                  label="Дата окончания"
                  value={selectedDate}
                  onChange={handleDateChange}
                  disabled={disableFlag}
                />
              )}
          </LocalizationProvider>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Отмена</Button>
          <Button type="submit">OK</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default FormDialog;
