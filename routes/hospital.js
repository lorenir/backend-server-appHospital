//Imports
var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

var auth = require('../middlewares/autenticacion').verificaToken;


//Inicializar variables
var app = express();


//Rutas
var Hospital = require('../models/hospital');

//==========================================
// Obtener todos los hospitales
//==========================================

app.get('/', (req, res, next) => {

    Hospital.find({})
        .populate('usuario', 'nombre email')
        .exec((err, hospitales) => {
            if (err) {
                return res.status().json({
                    ok: false,
                    mensaje: 'Error cargando hospitales',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                hospitales: hospitales
            });
        });
});


//==========================================
// Actualizar hospitales
//==========================================

app.put('/:id', auth, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Hospital.findById(id, (err, hospital) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al bucar hospitales',
                errors: err
            });
        }

        if (!hospital) {
            return res.status(400).json({
                ok: false,
                mensaje: `El hospital con el id ${id} no existe`,
                errors: { message: 'No existe hospital con ese ID' }
            });

        }

        hospital.nombre = body.nombre;
        hospital.img = body.img;
        hospital.usuario = req.usuario;

        hospital.save((err, hospitalGuardado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar hospitales',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                hospital: hospitalGuardado
            });
        });

    });

});

//==========================================
// Crear hospitales
//==========================================

app.post('/', auth, (req, res, next) => {

    console.log(req.hospital);
    let hospital = new Hospital(req.body);
    hospital.usuario = req.usuario;

    hospital.save((err, hospitalGuardado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear hospitales',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            hospital: hospitalGuardado,
            usuarioAutenticado: req.usuario
        });
    });


});


//==========================================
// Eliminar hospitales por Id
//==========================================

app.delete('/:id', auth, (req, res) => {

    var id = req.params.id;

    Hospital.findByIdAndRemove(id, (err, hospitalBorrado) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar hospital',
                errors: err
            });
        }

        if (!hospitalBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe hospital con ese id',
                errors: 'No existe hospital con ese id'
            });
        }

        res.status(200).json({
            ok: true,
            hospital: hospitalBorrado
        });

    });
});


module.exports = app;