// Подключаем модуль http
const request = require('sync-request');

module.exports.GetCounter = (url) =>
{
    console.log('1 - ' + url);

    // Получаем данные
    const res = request('GET', url);
    console.log(2);

    let data = JSON.parse(res.getBody('utf8'));

    console.log('GET', data.result);

    return data.result;
}

module.exports.SetCounter = (url) =>
{
    // Сохраняем данные
    const res = request('POST', url);

    let data = JSON.parse(res.getBody('utf8'));

    console.log('GET', data.result);
}
