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
async function registerApi(userInfo: TUserRegisterData) {
  //-- Отправляет данные пользователя на API для регистрации
  return postReq<TUserRegisterResponse>({ uri: 'api/users', data: userInfo, auth: true });
}

//-- Функция для отправки запроса регистрации пользователя --//
async function getAllUsersApi() {
  //-- Отправляет данные пользователя на API для регистрации
  return getReq<TUserRegisterResponse[]>({ uri: 'api/users', auth: true });
}

//-- Экспортирует функции API для их использования в других частях приложения --//
export { registerApi, getAllUsersApi };
