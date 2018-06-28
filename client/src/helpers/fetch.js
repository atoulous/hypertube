import Cookies from 'universal-cookie';
import path from 'path';

const setHeaders = () => {
  const cookies = new Cookies();
  const token = cookies.get('authtoken');

  return {
    Authorization: `Bearer ${token}`,
  };
};

const get = async (route) => {
  const headers = setHeaders();
  return fetch(path.resolve(route), {
    headers,
  });
};

const post = async (route, data) => {
  const headers = setHeaders();
  return fetch(path.resolve(route), {
    method: 'POST',
    headers,
    data,
  });
};

export default {
  get,
  post,
};
