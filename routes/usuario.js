//Imports
var express = require('express');

//Inicializar variables
var app = express();

//Rutas
var Usuario = require('../models/usuario')

//==========================================
// Obtener todos los usuarios
//==========================================

app.get('/', (req, res, next) => {

    Usuario.find({}, 'nombre email img role')
        .exec((err, usuarios) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error cargando usuarios',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                usuarios: usuarios
            });
        });
});

//==========================================
// Crear usuarios
//==========================================

app.post('/', (req, res, next) => {

    // var body = req.body;

    let usuario = new Usuario(req.body);

    // var usuario2 = new Usuario({
    //     nombre: body.nombre,
    //     ...
    // });



    usuario.save((err, usuarioGuardado) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al crear usuarios',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            usuario: usuarioGuardado
        });
    });


});

module.exports = app;