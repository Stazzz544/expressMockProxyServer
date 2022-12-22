const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors')
var fs = require('fs');

//json
const errorJson = require('./dataBase/error.json');
const errorMessageOnly = require('./dataBase/errorMessageOnly.json');
const actListResp = require('./dataBase/acts/queryParams.json')
const teasersListResp = require('./dataBase/teasers/queryParams.json')
const info = require('./dataBase/dash/init.json')

const app = express();
app.use(cors())
app.listen(4020); // сюда должно слать запросы приложение


// ========Подменнённы данные и статусы============


// Подменные моковые данные для обычного get запроса.
// ***есть нюанс с query параметрами. Почему-то если написать ссылку вида
// acts?page=1&per_page=30&sort_by=id&sort_order=desc, то путь будет
// проигнорирован и придут моковые данные с prism


// вкладка АКТЫ, строки в таблице (таб должны быть query параметры, но express их не ест, а без них работает норм.)
// app.get('/acts', function(req, res){
//     res.status(200).json(actListResp);
// });

// app.put('/acts/1', function(req, res){
//     res.status(400).json(errorJson);
// });

// app.get('/teasers?', function(req, res){
//     res.status(200).json(teasersListResp);
// });



// dash info=======================================
app.get('/user/info', function(req, res){
    res.status(200).json(info);
});

//Для моковых данных , где выборка идёт по айдишнику (/acts/1), например договор из массива договоров

// АКТЫ>РЕДАКТИРОВАТЬ>Договора и рРазаллокация по тизерам
// const acts = JSON.parse(fs.readFileSync('./dataBase/acts/id.json', 'UTF-8'));
// app.get('/acts/:id', function (req, res) {
//     const id = +req.params.id;
//     const act = acts.find(u => u.id === id);
//     res.status(200).json(act);
// });







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

// const prism = createProxyMiddleware({
//   target: 'http://127.0.0.1:4010',
//   changeOrigin: true,
// });
// app.use('/', prism);


//=============dash===========
const dashBackend = createProxyMiddleware({
  target: 'http://dash.stage.24smi.info/api/v2',
  changeOrigin: true,
});
app.use('/', dashBackend);
