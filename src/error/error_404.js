// Страница не найдена
module.exports = (req, res) => {
//    res.status(404);
//    res.json({code: 404, description: 'страница не найдена'});

    res.render('errors/404', {
        title: '404 - страница не найдена'
    });
}