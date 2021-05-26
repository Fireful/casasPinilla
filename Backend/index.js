'use strict'

var mongoose = require('mongoose');

mongoose.set('useFindAndModify', false);
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/casasPinilla_db', { useUnifiedTopology: true, useNewUrlParser: true }).then(() => {
    console.log("La conexión a la Base de datos se ha realizado bien");
})