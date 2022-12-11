const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors')
//json
const errorJson = require('./dataBase/error.json');
const errorMessageOnly = require('./dataBase/errorMessageOnly.json');
const ActListResp = require('./dataBase/components.schemas.ActListResp.json')
var fs = require('fs');

const app = express();
app.use(cors())
app.listen(4020); // сюда должно слать запросы приложение

// ========Подменнённы данные и статусы============


// Подменные моковые данные для обычного get запроса.
// ***есть нюанс с query параметрами. Почему-то если написать ссылку вида
// acts?page=1&per_page=30&sort_by=id&sort_order=desc, то путь будет
// проигнорирован и придут моковые данные с prism
app.get('/acts', function(req, res){
    res.status(200).json(ActListResp);
});


//Для моковых данных , где выборка идёт по айдишнику (/acts/1), например договор из массива договоров
const ActDetailsResp = JSON.parse(fs.readFileSync('./dataBase/components.schemas.ActDetailResp.json', 'UTF-8'));
app.get('/acts/:id', function (req, res) {
    const id = +req.params.id;
    const ActDetailResp = ActDetailsResp.find(u => u.id === id);
    res.status(200).json(ActDetailResp);
});

// Пример на get запрос, когда хотим получить
// какой-нибудь статус, например 500, + json ответ.
// В результате получим модалку, так как
// ошибку с кодом 500 отловит перехватчик аксиоса, а там по логике выкидывается модалка, которая забирает поле message
// app.get('/acts', function(req, res){
//     res.status(500).json(errorJson);
// });

// пример на пост запрос, где мы получим ошибку 500 + json ответ
// app.post('/campaigns/status', function(req, res){
//   res.status(500).json(errorMessageOnly);
// });

// =============================================


// Перенаправление запросов на URL http://127.0.0.1:4010, 
// где крутится prism
const prism = createProxyMiddleware({
  target: 'http://127.0.0.1:4010',
  changeOrigin: true,
});
app.use('/', prism);


