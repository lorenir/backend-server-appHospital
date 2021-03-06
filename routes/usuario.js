//Imports
var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

var auth = require('../middlewares/autenticacion').verificaToken;
var authAdminRole = require('../middlewares/autenticacion').verificaAdminRole;
var authUpdatePerfiRole = require('../middlewares/autenticacion').verificaUpdatePerfilRole;


//Inicializar variables
var app = express();


//Rutas
var Usuario = require('../models/usuario');

//==========================================
// Obtener todos los usuarios
//==========================================

app.get('/', (req, res, next) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);

    Usuario.find({}, 'nombre email img role google')
        .skip(desde)
        .limit(5)
        .exec((err, usuarios) => {
            if (err) {
                return res.status().json({
                    ok: false,
                    mensaje: 'Error cargando usuarios',
                    errors: err
                });
            }

            Usuario.count({}, (err, conteo) => {

                res.status(200).json({
                    ok: true,
                    usuarios: usuarios,
                    total: conteo
                });
            });


        });
});


//==========================================
// Actualizar usuarios
//==========================================

app.put('/:id', [auth, authUpdatePerfiRole], (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Usuario.findById(id, (err, usuario) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al bucar usuarios',
                errors: err
            });
        }

        if (!usuario) {
            return res.status(400).json({
                ok: false,
                mensaje: `El usuario con el id ${id} no existe`,
                errors: { message: 'No existe usuario con ese ID' }
            });

        }

        usuario.nombre = body.nombre;
        usuario.email = body.email;
        usuario.role = body.role;

        usuario.save((err, usuarioGuardado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar usuarios',
                    errors: err
                });
            }

            usuarioGuardado.password = '***';
            res.status(200).json({
                ok: true,
                usuario: usuarioGuardado
            });
        });

    });

});

//==========================================
// Crear usuarios
//==========================================

app.post('/', (req, res, next) => {

    console.log(req.usuario);
    let usuario = new Usuario(req.body);
    usuario.password = bcrypt.hashSync(usuario.password, 10);

    usuario.save((err, usuarioGuardado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear usuarios',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            usuario: usuarioGuardado,
            usuarioAutenticado: req.usuario
        });
    });


});


//==========================================
// Eliminar usuarios por Id
//==========================================

app.delete('/:id', [auth, authAdminRole], (req, res) => {

    var id = req.params.id;

    Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar usuarios',
                errors: err
            });
        }

        if (!usuarioBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe usuario con ese id',
                errors: 'No existe usuario con ese id'
            });
        }

        res.status(200).json({
            ok: true,
            usuario: usuarioBorrado
        });

    });
});


module.exports = app;