const express = require('express');
const router = express.Router();

router.post('/login/', (req, res) => {

    const newUser = { id: 1, mail: "test@mail.ru" };

    res.status(201);
    res.json(newUser);
});

module.exports = router;
