import { Autocomplete, Chip, TextField } from '@mui/material';
import { FC, useState } from 'react';
import { TUserRegisterResponse } from '../../../utils/types/types';

// Определение типа для функции setSubordinates
type SetSubordinates = React.Dispatch<
  React.SetStateAction<TUserRegisterResponse[]>
>;

interface IPropsFixedTags {
  allUsers?: TUserRegisterResponse[] | null;
  setSubordinates?: SetSubordinates;
}

// Экспорт функции FixedTags как компонента по умолчанию
const FixedTags: FC<IPropsFixedTags> = ({ allUsers, setSubordinates }) => {
  // Создание постоянного списка опций, который содержит один элемент из списка top100Films (элемент с индексом 6)
  const fixedOptions =
    allUsers?.filter((user) => {
      return (
        user.role === 'manager' || (user.role !== 'manager' && user.manager)
      );
    }) || []; // Пример фильтрации;

  // Фильтруем пользователей, у которых нет руководителя, для использования в качестве опций
  const usersWithoutManager =
    allUsers?.filter((user) => user.role !== 'manager' && !user.manager) || [];

  // Создание состояния 'value', которое изначально содержит элемент из fixedOptions и еще один элемент из списка top100Films (элемент с индексом 13)
  const [value, setValue] = useState(fixedOptions);

  // Отрисовка компонента Autocomplete
  return (
    <Autocomplete
      sx={{ marginTop: 3 }}
      multiple // Позволяет выбрать несколько значений
      id="fixed-tags-demo" // Уникальный идентификатор для элемента
      // disableCloseOnSelect
      value={value} // Текущее значение, выбранное в Autocomplete
      onChange={(event, newValue) => {
        // Функция, вызываемая при изменении выбранных значений
        setValue([
          ...fixedOptions, // Всегда добавлять fixedOptions в начало
          ...newValue.filter((option) => fixedOptions?.indexOf(option) === -1), // Добавить новые значения, исключая те, что уже есть в fixedOptions
        ]);
        if (setSubordinates) {
          setSubordinates([
            ...newValue.filter(
              (option) => fixedOptions?.indexOf(option) === -1,
            ),
          ]);
        }
      }}
      options={usersWithoutManager} // Список всех доступных для выбора опций
      getOptionLabel={(option) =>
        `${option.firstName} ${option.lastName}(${option.role})`
      } // Функция, возвращающая название для каждой опции
      renderTags={(
        tagValue,
        getTagProps, // Функция для рендеринга выбранных тэгов
      ) =>
        tagValue.map(
          (
            option,
            index, // Проход по всем выбранным значениям
          ) => (
            <Chip
              label={`${option.firstName} ${option.lastName}(${option.role})`} // Название тэга
              {...getTagProps({ index })} // Получение необходимых свойств тэга
              disabled={fixedOptions?.indexOf(option) !== -1} // Отключение возможности удаления тэгов из fixedOptions
            />
          ),
        )
      }
      style={{ width: 500 }} // Стиль компонента
      renderInput={(
        params, // Функция для рендеринга поля ввода
      ) => (
        <TextField
          {...params}
          label="Доступный персонал"
          placeholder="Выберите сотрудника"
        />
      )}
    />
  );
};

export default FixedTags;
