import { FC } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

interface IProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  handleSubmitDialog: (data: Record<string, string>) => void;
}

const FormDialog: FC<IProps> = ({
  open,
  onClose,
  children,
  handleSubmitDialog,
}) => {
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

            // Создаем новый объект без пустых полей
            let cleanedFormJson: Record<string, string> = {};
            for (const key in formJson) {
              if (Object.hasOwnProperty.call(formJson, key)) {
                const value = formJson[key];
                if (value.trim() !== '') {
                  cleanedFormJson[key] = value;
                }
              }
            }
            //console.log(cleanedFormJson);
            handleSubmitDialog(cleanedFormJson);
            onClose();
          },
        }}
      >
        <DialogTitle>Обновить данные пользователя</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Обновите данные пользователя с помощью изменения полей. Прежде чем
            изменить пароль пользователя передайте его пользователю.
          </DialogContentText>
          <>{children}</>
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
