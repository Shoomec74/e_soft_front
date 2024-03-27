import { ICustomErrorResponse } from '../utils/types/types';
import { getCookie } from './auth/auth';

//-- Базовый URL API --//
let BASE_URL = 'https://cleanwaveapp.ru';

if (process.env.NODE_ENV === 'development') {
  BASE_URL = process.env.REACT_APP_URL_DEV || '';
  console.log(BASE_URL);
}else {
  BASE_URL = process.env.REACT_APP_URL_PROD || '';
  console.log(BASE_URL);
}

//-- Расширенный интерфейс стандартного Response для добавления типизации к методу json() --//
interface IResponse<T> extends Response {
  json(): Promise<T>;
}

//-- Тип для опций fetch-запроса --//
type TOptions = {
  headers?: { authorization?: string; 'Content-Type': string };
  method?: string;
  body?: string | FormData;
};

//-- Тип для параметров запроса --//
type TReq = {
  uri: string;
  auth?: boolean;
  data?: Record<string, unknown>;
  id?: string;
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE';
};

//-- Базовые параметры для заголовков запроса --//
const BASE_PARAMS = {
  headers: {
    'Content-Type': 'application/json',
  },
};

//-- Функция для подготовки параметров запроса --//
function getReqParams({ uri, id, method, data, auth }: TReq) {
  const params: TOptions = {
    ...BASE_PARAMS,
    method,
  };
  //-- Формирование полного пути запроса --//
  const path = `${BASE_URL}/${uri}${id ? `/${id}` : ''}`;
  //-- Добавление токена авторизации, если требуется --//
  if (auth) {
    params.headers!.authorization = `Bearer ${getCookie('token') || ''}`;
  }

  //-- Добавление тела запроса в формате JSON, если есть данные --//
  if (data) {
    params.body = JSON.stringify(data);
  }
  return { path, params };
}

//-- Функция проверки ответа сервера --//
export function checkRes<T>(res: IResponse<T>): Promise<T> | Promise<never> {
  //-- Если статус ответа OK, возвращаем результат вызова .json() --//
  if (res.ok) {
    return res.json();
  } else {
    // Сначала конвертируем ответ в JSON, а потом уже отклоняем промис
    return res.json().then((errorBody) => {
      // Предполагается, что сервер возвращает JSON с описанием ошибки
      // Можно дополнительно настроить структуру объекта ошибки
      const error: ICustomErrorResponse = {
        status: res.status,
        statusText: res.statusText,
        error: errorBody,
      };
      return Promise.reject(error);
    });
  }
}

//-- Общая функция для выполнения запросов --//
function request<T>(url: string, options: TOptions): Promise<T> {
  //-- Выполняем запрос и обрабатываем ответ через checkRes --//
  return fetch(url, options).then(checkRes);
}

//-- Функции для выполнения запросов определенных типов --//
export function getReq<T>(options: TReq) {
  //-- Подготовка параметров для GET-запроса --//
  const { path, params } = getReqParams({ ...options, method: 'GET' });
  return request<T>(path, params);
}

export function postReq<T>(options: TReq) {
  //-- Подготовка параметров для POST-запроса --//
  const { path, params } = getReqParams({ ...options, method: 'POST' });
  return request<T>(path, params);
}

export function patchReq<T>(options: TReq) {
  //-- Подготовка параметров для PATCH-запроса --//
  const { path, params } = getReqParams({ ...options, method: 'PATCH' });
  return request<T>(path, params);
}

export function deleteReq<T>(options: TReq) {
  //-- Подготовка параметров для DELETE-запроса --//
  const { path, params } = getReqParams({ ...options, method: 'DELETE' });
  return request<T>(path, params);
}

export default {
  patchReq,
  postReq,
  getReq,
  deleteReq,
};
