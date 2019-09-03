//Requires
var express = require('express');
var mongoose = require('mongoose');

// Inicializando variables
var app = express();

//Importor rutas
var appRoutes = require('./routes/app');
var usuarioRoutes = require('./routes/usuario');


//Conexión a la BD

mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', { useCreateIndex: true, useNewUrlParser: true }, (err, res) => {
    if (err) throw err;

    //si no hay error
    console.log('MongoDB: \x1b[32m%s\x1b[0m', 'online');

});

//middlewares
app.use(express.urlencoded({ extended: false })); // parse application/x-www-form-urlencoded
app.use(express.json()); // parse application/json

// Rutas
app.use('/usuario', usuarioRoutes);
app.use('/', appRoutes);


//Escuchar peticiones
app.listen(3000, () => {
    console.log('Express: \x1b[32m%s\x1b[0m', 'online');
})