import {
  ITokens,
  TSigninResponse,
  TSignoutResponse,
  TUserRegisterData,
  TUserRegisterResponse,
  TUserSigninData,
} from '../../utils/types/auth';

import { getReq, postReq } from '../apiMethods';

//-- Функция для отправки запроса регистрации пользователя --//
function registerApi(userInfo: TUserRegisterData) {
  //-- Отправляет данные пользователя на API для регистрации
  return postReq<TUserRegisterResponse>({ uri: 'api/users', data: userInfo });
}

//-- Функция для отправки запроса авторизации пользователя --//
function signinApi(userInfo: TUserSigninData) {
  //-- Отправляет данные пользователя на API для авторизации --//
  return postReq<TSigninResponse>({ uri: 'api/auth/signin', data: userInfo });
}

//-- Функция для отправки запроса авторизации пользователя --//
function updateTokenApi(refreshToken: string) {
  //-- Отправляет данные пользователя на API для авторизации --//
  return postReq<ITokens>({ uri: 'api/auth/refresh-token', data: {refreshToken: refreshToken} });
}

//-- Функция для отправки запроса на выход из аккаунта --//
function logoutApi() {
  //-- Отправляет запрос на API для выхода из аккаунта, требует авторизации --//
  return getReq<TSignoutResponse>({ uri: 'api/logout', auth: true });
}

//-- Функция для отправки запроса авторизации пользователя --//
function userInfoApi() {
  //-- Отправляет данные пользователя на API для авторизации --//
  return getReq<TSigninResponse>({ uri: 'api/users/me', auth: true });
}

//-- Экспортирует функции API для их использования в других частях приложения --//
export { registerApi, signinApi, logoutApi, userInfoApi, updateTokenApi };

//-- Функция для получения значения cookie по имени --//
const getCookie = (name: string): string | undefined => {
  // Ищет cookie с указанным именем и возвращает его значение, если находит --//
  const matches = document.cookie.match(
    new RegExp(
      '(?:^|; )' +
        name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') +
        '=([^;]*)',
    ),
  );
  return matches ? decodeURIComponent(matches[1]) : undefined;
};

//-- Функция для установки cookie --//
function setCookie(name: string, value: string, props?: any): void {
  //-- Принимает имя, значение и дополнительные свойства для cookie, устанавливает новое cookie --//
  props = props || {};
  let exp = props.expires;
  if (typeof exp == 'number' && exp) {
    const d = new Date();
    d.setTime(d.getTime() + exp * 20000); //-- Устанавливает время истечения cookie --//
    exp = props.expires = d;
  }
  if (exp && exp.toUTCString) {
    props.expires = exp.toUTCString();
  }
  value = encodeURIComponent(value);
  let updatedCookie = name + '=' + value;
  for (const propName in props) {
    updatedCookie += '; ' + propName;
    const propValue = props[propName];
    if (propValue !== true) {
      updatedCookie += '=' + propValue; //-- Добавляет дополнительные свойства к cookie --//
    }
  }
  document.cookie = updatedCookie; //-- Устанавливает cookie --//
}

//-- Функция для удаления cookie --//
async function deleteCookie(name: string): Promise<void> {
  //-- Удаляет cookie, устанавливая его время жизни в прошлое --//
  setCookie(name, '', { expires: -1 });
}

export { getCookie, setCookie, deleteCookie };
