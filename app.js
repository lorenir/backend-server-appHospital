//Requires
var express = require('express');
var mongoose = require('mongoose');

// Inicializando variables
var app = express();

//Conexión a la BD

// conexion rápida
// mongoose.connect('mongodb://localhost:27017/hospitalDB', { useNewUrlParser: true });

mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', (err, res) => {
    if (err) throw err;

    //si no hay error
    console.log('MongoDB: \x1b[32m%s\x1b[0m', 'online');

})

// Rutas
app.get('/', (req, res, next) => {

    res.status(200).json({
        ok: true,
        mensaje: 'Petición realizada correctamente'
    })

});


//Escuchar peticiones
app.listen(3000, () => {
    console.log('Express: \x1b[32m%s\x1b[0m', 'online');
})