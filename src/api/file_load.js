const express = require('express');
const router = express.Router();

const my_multer = require('../lib/multer');

const {data_obj} = require('../data/book');


router.post('/upload/:id', 
    my_multer.single('fileInput'),       // Название POST параметра
    (req, res) => {

//        console.log(req);

        if(req.file){
//            console.log(req.file);

            const {id} = req.params;
            const idx = data_obj.books.findIndex(el => el.id === id);

            if (idx !== -1){

                data_obj.books[idx] = {
                    ...data_obj.books[idx],
                    fileBook: req.file.path,
                    fileName: req.file.originalname
                }
        
                res.json({fileBook: req.file.path});
            } else {
                res.status(404);
                res.json({code: 404, description: 'Объект не найден'});
            }
        }

        res.json();
    })

module.exports = router;
