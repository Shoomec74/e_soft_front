import { Button, Toolbar } from '@mui/material';
import { FC } from 'react';
import styles from './Header.module.less';

const Header: FC = () => {
  const { header_bar } = styles;

  return (
    <Toolbar className={header_bar}>
      <Button color="inherit">Кнопка 1</Button>
      <Button color="inherit">Кнопка 2</Button>
      <Button color="inherit">Кнопка 3</Button>
    </Toolbar>
  );
};

export default Header;
