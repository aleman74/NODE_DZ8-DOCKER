const multer = require('multer');

const storage = multer.diskStorage({
    destination(req, file, cb){
        cb(null, 'src/data/file');                 // Задаём директорию
    },
    filename(req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`);       // Задаём название файла
    }
})

module.exports = multer({storage});
