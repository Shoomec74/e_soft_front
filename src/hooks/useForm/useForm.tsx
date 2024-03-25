import React, { ChangeEvent, useState } from "react";

export type TFormValues = {
  [key: string]: string;
};

export type TFormErrors = {
  [key: string]: string;
};

const MIN_PASSWORD_CHARS = 3;

function useForm(inputValues: TFormValues) {
  const [values, setValues] = useState(inputValues);
  const [errors, setErrors] = useState<TFormErrors>({});

  const validateEmail = (email: string) => {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@(([^<>()[\]\\.,;:\s@"]+\.)+[^<>()[\]\\.,;:\s@"]{2,})$/i;
    return re.test(String(email).toLowerCase());
  };

  const validatePassword = (password: string) => {
    return password.length >= MIN_PASSWORD_CHARS;
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setValues({ ...values, [name]: value });

    // Валидация для email
    if (name === "login") {
      if (!validateEmail(value)) {
        setErrors({ ...errors, [name]: "Неверный формат электронной почты" });
      } else {
        // Очистка ошибки, если формат валиден
        const newErrors = { ...errors };
        delete newErrors[name];
        setErrors(newErrors);
      }
    }else if(name === "password"){
      if (!validatePassword(value)) {
        setErrors({ ...errors, [name]: "Минимальная длинна пароля 3 символа" });
      } else {
        // Очистка ошибки, если формат валиден
        const newErrors = { ...errors };
        delete newErrors[name];
        setErrors(newErrors);
      }
    }
  };

  return { values, handleChange, setValues, errors };
}

export default useForm;
