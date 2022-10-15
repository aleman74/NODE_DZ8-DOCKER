const express = require('express');
const my_multer = require('../lib/multer');
const module_counter = require('../bl/counter');
const router = express.Router();
module.exports = router;

const {data_obj, Book} = require('../data/book');

const {COUNTER_URL} = require('../config');

router.get('/', (req, res) => {
//    res.json(data_obj.books);

    res.render("book/index", {
        title: "Список книг",
        books: data_obj.books
    });    
});

router.get('/create', (req, res) => {

    console.log('GET /create');
    
    res.render("book/create", {
        title: "Новая книга",
        book: {}
    });    
});
    
router.get('/:id', (req, res) => {

    const {id} = req.params;

    const idx = data_obj.books.findIndex(el => el.id === id);

    // Увеличиваем число просмотров
    console.log('-----------------------------');
    
    let url_get = COUNTER_URL + id;
    let view_count = module_counter.GetCounter(url_get);
    console.log('view_count = ', view_count);

    view_count += 1;
    
    let url_post = COUNTER_URL + id + '/incr';
    let v2 = module_counter.SetCounter(url_post);
    console.log('counter_set = ', v2);
    
    console.log('-----------------------------');
    
    if( idx !== -1) {
//        res.json(data_obj.books[idx]);

        res.render("book/view", {
            title: `Книга № ${idx + 1}`,
            book: data_obj.books[idx],
            view_count: view_count
        });    

    } else {
//        res.status(404)
//        res.json('Объект не найден');
        res.redirect('/404');
    }
});

router.get('/update/:id', (req, res) => {

    const {id} = req.params;

    const idx = data_obj.books.findIndex(el => el.id === id);

    if( idx !== -1) {
//        res.json(data_obj.books[idx]);

        res.render("book/update", {
            title: `Книга № ${idx + 1}`,
            book: data_obj.books[idx]
        });    

    } else {
        res.redirect('/404');
    }
});


router.put('/:id', 
    my_multer.single('inputFile'),       // Название POST параметра
    (req, res) => {

    const {id} = req.params;
    const {title, description, authors, favorite, fileCover, fileName} = req.body;

    const idx = data_obj.books.findIndex(el => el.id === id);

    if (idx !== -1){
        data_obj.books[idx] = {
            ...data_obj.books[idx],
            title,
            description,
            authors,
            favorite,
            fileCover,
            fileName
        }

        res.json(data_obj.books[idx]);
    } else {
//        res.status(404);
//        res.json('Объект не найден');
        res.redirect('/404');
    }
});

router.post('/create', 
    my_multer.single('inputFile'),       // Название POST параметра
    (req, res) => {

    let {title, description, authors, favorite, fileCover} = req.body;

    console.log('POST /create');
    console.log(req.body);

    // Проверяем флаг
    favorite = (favorite !== undefined);

    console.log(title, description, authors, favorite, fileCover);


    // Разбираемся с файлом
    let fileName = '';
    let fileBook = '';

    if(req.file){
        fileName = req.file.originalname;
        fileBook = req.file.path;

        console.log('FILE', fileName, fileBook);
    }

    const newBook = new Book(title, description, authors, favorite, fileCover, fileName, fileBook);
    data_obj.books.push(newBook);

//    res.status(201);
//    res.json(newBook);

    res.redirect('/api/books/');
});

router.post('/update/:id', 
    my_multer.single('inputFile'),       // Название POST параметра
    (req, res) => {

    const {id} = req.params;
    let {title, description, authors, favorite, fileCover} = req.body;

    console.log('POST /update');
    console.log(req.body);
    
    // Проверяем флаг
    favorite = (favorite !== undefined);

    console.log(title, description, authors, favorite, fileCover);

    // Разбираемся с файлом
    let fileName = '';
    let fileBook = '';

    if(req.file){
        fileName = req.file.originalname;
        fileBook = req.file.path;

        console.log('FILE', fileName, fileBook);
    }

    // Обновляем запись
    const idx = data_obj.books.findIndex(el => el.id === id);

    if (idx !== -1){
        data_obj.books[idx] = {
            ...data_obj.books[idx],
            title,
            description,
            authors,
            favorite,
            fileCover,
            fileName,
            fileBook
        }

        res.redirect('/api/books/');

    } else {
        res.redirect('/404');
    }

});

router.post('/delete/:id', (req, res) => {
    const {id} = req.params;
    const idx = data_obj.books.findIndex(el => el.id === id);
        
    if(idx !== -1){
        data_obj.books.splice(idx, 1)
//        res.json(true)
        res.redirect('/api/books/');
    } else {
//        res.status(404);
//        res.json('Объект не найден');
        res.redirect('/404');
    }
});
