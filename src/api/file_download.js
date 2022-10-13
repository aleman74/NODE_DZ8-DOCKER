const express = require('express');
const router = express.Router();

const {data_obj} = require('../data/book');


router.get('/:id/download',
    (req, res) => {

        const {id} = req.params;
        const idx = data_obj.books.findIndex(el => el.id === id);

        if (idx !== -1){

            const file_name = data_obj.books[idx].fileBook;
            const file_path = './' + file_name;               // Переходим в родительскую директорию

            res.download(file_path, data_obj.books[idx].fileName);

        } else {
            res.status(404);
            res.json({code: 404, description: 'Объект не найден'});
        }
    })

module.exports = router;
