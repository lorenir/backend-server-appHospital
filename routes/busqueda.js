//Requires
var express = require('express');
// var mongoose = require('mongoose');
var Hospital = require('../models/hospital');
var Medico = require('../models/medico');
var Usuario = require('../models/usuario');



// Inicializando variables
var app = express();

//==========================================
// Buscar cadena por coleccion
//==========================================

app.get('/coleccion/:tabla/:busqueda', (req, res, next) => {

    var busqueda = req.params.busqueda;
    var tabla = req.params.tabla;
    var regex = new RegExp(busqueda, 'i');

    var promesa;


    switch (tabla) {
        case 'hospital':
            promesa = buscarHospitales(busqueda, regex);
            break;
        case 'medico':
            promesa = buscarMedicos(busqueda, regex);
            break;
        case 'usuario':
            promesa = buscarUsuarios(busqueda, regex);
            break;
        default:
            res.status(400).json({
                ok: false,
                mensaje: 'los tipos de busqueda son: usuarios, medicos y hospitales',
                error: { message: 'Tipo de tabla/colección no válido' }
            });
    }

    promesa.then(respuesta => {
        res.status(200).json({
            ok: true,
            [tabla]: respuesta
        });
    });
});


//==========================================
// Buscar cadena en todas las colecciones
//==========================================

app.get('/todo/:busqueda', (req, res, next) => {

    var busqueda = req.params.busqueda;
    var regex = new RegExp(busqueda, 'i');

    Promise.all([buscarHospitales(busqueda, regex),
            buscarMedicos(busqueda, regex),
            buscarUsuarios(busqueda, regex)
        ])
        .then(respuestas => {

            res.status(200).json({
                ok: true,
                hospitales: respuestas[0],
                medicos: respuestas[1],
                usuarios: respuestas[2]
            });

        });

});


function buscarHospitales(busqueda, regex) {

    return new Promise((resolve, reject) => {

        Hospital.find({ nombre: regex })
            .populate('usuario', 'nomrbe email')
            .exec((err, hospitales) => {

                if (err) {
                    reject('Error al cargar hospitales', err);
                } else {
                    resolve(hospitales);
                }

            });

    });

}

function buscarMedicos(busqueda, regex) {

    return new Promise((resolve, reject) => {

        Medico.find({ nombre: regex })
            .populate('usuario', 'nombre email')
            .populate('hospital')
            .exec((err, medicos) => {

                if (err) {
                    reject('Error al cargar medicos', err);
                } else {
                    resolve(medicos);
                }

            });

    });

}

function buscarUsuarios(busqueda, regex) {

    return new Promise((resolve, reject) => {

        Usuario.find({}, 'nombre email role')
            .or([{ 'nombre': regex }, { 'email': regex }])
            .exec((err, usuarios) => {
                if (err) {
                    reject('Error cargar usuario', err);
                } else {
                    resolve(usuarios);
                }

            });

    });

}





module.exports = app;