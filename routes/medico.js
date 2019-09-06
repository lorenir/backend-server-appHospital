//Imports
var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

var auth = require('../middlewares/autenticacion').verificaToken;


//Inicializar variables
var app = express();


//Rutas
var Medico = require('../models/medico');

//==========================================
// Obtener todos los medicos
//==========================================

app.get('/', (req, res, next) => {

    Medico.find({})
        .populate('usuario', 'nombre email')
        .populate('hospital')
        .exec((err, medicos) => {
            if (err) {
                return res.status().json({
                    ok: false,
                    mensaje: 'Error cargando medicos',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                medicos: medicos
            });
        });
});


//==========================================
// Actualizar medicos
//==========================================

app.put('/:id', auth, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Medico.findById(id, (err, medico) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al bucar medicos',
                errors: err
            });
        }

        if (!medico) {
            return res.status(400).json({
                ok: false,
                mensaje: `El medico con el id ${id} no existe`,
                errors: { message: 'No existe medico con ese ID' }
            });

        }

        medico.nombre = body.nombre;
        medico.img = body.img;
        medico.hospital = body.hospital;
        medico.usuario = req.usuario;

        medico.save((err, medicoGuardado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar medicos',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                medico: medicoGuardado
            });
        });

    });

});

//==========================================
// Crear medicos
//==========================================

app.post('/', auth, (req, res, next) => {

    let medico = new Medico(req.body);
    medico.usuario = req.usuario;

    medico.save((err, medicoGuardado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear medicos',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            medico: medicoGuardado,
            usuarioAutenticado: req.usuaro
        });
    });


});


//==========================================
// Eliminar medico por Id
//==========================================

app.delete('/:id', auth, (req, res) => {

    var id = req.params.id;

    Medico.findByIdAndRemove(id, (err, medicoBorrado) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar medico',
                errors: err
            });
        }

        if (!medicoBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe medico con ese id',
                errors: 'No existe medico con ese id'
            });
        }

        res.status(200).json({
            ok: true,
            medico: medicoBorrado
        });

    });
});


module.exports = app;