const baseURL = '/api';

// Основні сегменти
const auth = '/auth';
const cars = '/cars';
const users = '/users';
const support = '/support';

const urls = {
    // 🔐 Аутентифікація
    auth: {
        login: `${auth}`,       // POST /api/auth
        me: `${users}/me`,      // GET /api/users/me
    },

    // 🚗 Оголошення
    cars,                     // /cars
    brands: `${cars}/brands`, // /cars/brands
    models: `${cars}/models`, // /cars/models

    // 👤 Користувачі
    users,                    // /users

    // 🧩 Додаткові розділи
    support,                  // /support

    // ⚙️ Спеціальний маршрут для створення авто конкретного користувача
    userCars: (userId) => `${users}/${userId}/cars`,  // /users/:id/cars
};

export {
    baseURL,
    urls
};


// const baseURL = '/api';
//
// const auth = '/auth';
// const cars = '/cars';
// const users = '/users';
// const support = '/support';   // ✅ додали
//
// const urls = {
//   auth: {
//     login: auth,
//     me: `${users}/me`,
//   },
//   cars,
//   brands: `${cars}/brands`,
//   models: `${cars}/models`,
//   users,
//   support,   // ✅ додали
// };
//
// export {
//   baseURL,
//   urls
// };


// const baseURL = '/api';
//
// const auth = '/auth';
// const cars = '/cars';
// const users = '/users';
//
// const urls = {
//   auth: {
//     login: auth,          // POST для логіну
//     me: `${users}/me`,    // GET для поточного користувача
//   },
//   cars,                       // базовий ендпоінт для авто
//   brands: `${cars}/brands`,   // ✅ бренди
//   models: `${cars}/models`,   // ✅ моделі
//   reportBrand: `${cars}/report-brand`,   // ✅ повідомлення про відсутній бренд
//   reportModel: `${cars}/report-model`,   // ✅ повідомлення про відсутню модель
//   users
// };
//
// export {
//   baseURL,
//   urls
// };


// const baseURL = '/api';
//
// const auth = '/auth';
// const cars = '/cars';
// const users = '/users';
//
// const urls = {
//   auth: {
//     login: auth,          // POST для логіну
//     me: `${users}/me`,    // GET для поточного користувача
//   },
//   cars,                  // список та створення авто
//   brands: `${cars}/brands`,   // бренди авто
//   models: `${cars}/models`,   // моделі авто
//   users
// };
//
// export {
//   baseURL,
//   urls
// };


// const baseURL = '/api';
//
// const auth = '/auth';
// const cars = '/cars';
// const users = '/users';
//
// const urls = {
//   auth: {
//     login: auth,          // POST для логіну
//     me: `${users}/me`,     // GET для поточного користувача
//   },
//   cars,                  // інші ендпоінти
//   users
// };
//
// export {
//   baseURL,
//   urls
// };