// Общий обработчик ошибок
module.exports = (error, req, res, next) => {
//    res.status(500);
//    res.json({code: 500, description: error});

    res.render('errors/404', {
        title: `404 - ${error}`
    });
}