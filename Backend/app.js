'use strict'

//Cargar Modulos de Node para crear servidor
var express = require('express');
var bodyParser = require('body-parser');
//Ejecutar Express
var app = express();
//Cargar Rutas
var article_routes = require('./routes/article');

//Cargar middlewares
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Activar CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

//Añadir prefijos a las rutas / Cargar rutas
app.use('/api', article_routes);

//Exportar módulo (Fichero actual)
module.exports = app;