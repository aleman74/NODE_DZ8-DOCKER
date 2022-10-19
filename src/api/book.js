const express = require('express');
const my_multer = require('../lib/multer');
const { v4: uuid } = require('uuid');

const module_counter = require('../bl/counter');
const table_book = require('../models/table_book');

const router = express.Router();
module.exports = router;

const {data_obj, Book} = require('../data/book');

const {COUNTER_URL} = require('../config');

router.get('/', async (req, res) => {

    const rows = await table_book.find().select('-__v');       // Получаем все книги

    res.render("book/index", {
        title: "Список книг",
        books: rows             // data_obj.books
    });    
});

router.get('/create', (req, res) => {

    console.log('GET /create');
    
    res.render("book/create", {
        title: "Новая книга",
        book: {}
    });    
});
    
router.get('/:id', async (req, res) => {

    const {id} = req.params;
    const row = await table_book.findOne({id}).select('-__v');

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
    
//    if( idx !== -1) {
    if (row != null) {

        res.render("book/view", {
            title: `Книга`,
            book: row,                           // data_obj.books[idx],
            view_count: view_count
        });    

    } else {
//        res.status(404)
//        res.json('Объект не найден');
        res.redirect('/404');
    }
});

router.get('/update/:id', async (req, res) => {

    const {id} = req.params;
    const row = await table_book.findOne({id}).select('-__v');

    if (row != null) {

        res.render("book/update", {
            title: `Книга`,
            book: row                   // data_obj.books[idx]
        });

    } else {
        res.redirect('/404');
    }
});


router.put('/:id', 
    my_multer.single('inputFile'),       // Название POST параметра
    async (req, res) => {

    const {id} = req.params;
    const {title, description, authors, favorite, fileCover, fileName} = req.body;

    const row = await table_book.findOne({id}).select('-__v');

    if (row != null) {

        const new_row = new table_book({
            ...row,
            title,
            description,
            authors,
            favorite,
            fileCover,
            fileName
        });    

        await table_book.findByIdAndUpdate(row._id.toString(), new_row);

        res.json(new_row);
    } else {
//        res.status(404);
//        res.json('Объект не найден');
        res.redirect('/404');
    }
});

router.post('/create', 
    my_multer.single('inputFile'),       // Название POST параметра
    async (req, res) => {

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

    const id = uuid();
    const new_row = new table_book({
        id,
        title,
        description,
        authors,
        favorite,
        fileCover,
        fileName,
        fileBook
    });    

    await new_row.save();

//    res.status(201);
//    res.json(newBook);

    res.redirect('/api/books/');
});

router.post('/update/:id', 
    my_multer.single('inputFile'),       // Название POST параметра
    async (req, res) => {

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
//    const row = await table_book.findById(id).select('-__v');
    const row = await table_book.findOne({id}).select('-__v');


    if (row != null) {     

        const new_row = new table_book({
            _id: row._id.toString(),
            title,
            description,
            authors,
            favorite,
            fileCover,
            fileName,
            fileBook
        });    

        await table_book.findByIdAndUpdate(row._id.toString(), new_row);


        res.redirect('/api/books/');

    } else {
        res.redirect('/404');
    }

});

router.post('/delete/:id', async (req, res) => {
    const {id} = req.params;
    const row = await table_book.findOne({id}).select('-__v');
        
    if (row != null) {        

        await table_book.deleteOne({_id: row._id.toString()});

        res.redirect('/api/books/');
    } else {
//        res.status(404);
//        res.json('Объект не найден');
        res.redirect('/404');
    }
});
