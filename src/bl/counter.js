// Подключаем модуль http
const request = require('sync-request');

module.exports.GetCounter = (url) =>
{
    // Получаем данные
    const res = request('GET', url);
    const data = JSON.parse(res.getBody('utf8'));
    
    console.log('GET', data.result);

    return data.result;
}

module.exports.SetCounter = (url) =>
{
    // Сохраняем данные
    const res = request('POST', url);
    const data = JSON.parse(res.getBody('utf8'));

    console.log('POST', data.result);
}
