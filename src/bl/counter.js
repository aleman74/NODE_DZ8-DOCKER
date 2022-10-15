// Подключаем модуль http
const request = require('sync-request');

module.exports.GetCounter = (url) =>
{
    // Получаем данные
    console.log('GetCounter url = ', url);

    const res = request('GET', url);
    const data = JSON.parse(res.getBody('utf8'));
    
    console.log('GetCounter result = ', data.result);

    return data.result;
}

module.exports.SetCounter = (url) =>
{
    // Сохраняем данные
    console.log('SetCounter url = ', url);

    const res = request('POST', url);
    const data = JSON.parse(res.getBody('utf8'));

    console.log('SetCounter result = ', data.result);

    return data.result;
}
