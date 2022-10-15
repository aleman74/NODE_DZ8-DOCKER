const express = require('express');

const user_router = require('./api/user');
const book_router = require('./api/book');
const file_load_router = require('./api/file_load');
const file_download_router = require('./api/file_download');

const error_404 = require('./error/error_404');
const error_handler = require('./error/error_handler');

const {PORT, COUNTER_URL} = require('./config');
console.log('COUNTER_URL = ', COUNTER_URL);

const app = express();
app.use(express.urlencoded({extended: false}));

app.set("view engine", "ejs");                // Включаем шаблоны EJS
app.use(express.static(__dirname + '/public'));            // Разрешаем доступ к файлам из директории public

app.set('views', __dirname + '/views');


// ----------------------------------------
// Обработчики запросов
app.use('/api/books/', book_router);
app.use('/api/user/', user_router);
app.use('/api/books/', file_load_router);
app.use('/api/books/', file_download_router);

// Страница не найдена
app.use(error_404);

// Общий обработчик ошибок
app.use(error_handler);

// ----------------------------------------
// Запускаем сервер
console.log('PORT = ' + PORT);
app.listen(PORT);
// ----------------------------------------
