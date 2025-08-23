const baseURL = '/api';

const auth = '/auth';
const cars = '/cars';
const users = '/users';

const urls = {
  auth: {
    login: auth,          // POST для логіну
    me: `${users}/me`,     // GET для поточного користувача
  },
  cars,                  // інші ендпоінти
  users
};

export {
  baseURL,
  urls
};