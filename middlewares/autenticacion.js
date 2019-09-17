var jwt = require('jsonwebtoken');
var SEED = require('../config/config').SEED;

//==========================================
// Verificar token
//==========================================
exports.verificaToken = function(req, res, next) {

    var token = req.query.token;

    jwt.verify(token, SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                mensaje: 'Token incorrecto',
                errors: err
            });
        }

        console.log(decoded);
        req.usuario = decoded.usuario;
        next();

    });


};

//==========================================
// Verificar Admin Role
//==========================================
exports.verificaAdminRole = function(req, res, next) {

    var usuario = req.usuario;

    if (usuario.role === "ADMIN_ROLE") {
        next();
        return;
    }

    return res.status(401).json({
        ok: false,
        mensaje: 'Token incorrecto - No es administrador',
        errors: { message: 'No es administrador' }
    });


};

//==========================================
// Verificar Permisos para autenticar perfil
//==========================================
exports.verificaUpdatePerfilRole = function(req, res, next) {

    var usuario = req.usuario;
    var id = req.params.id;

    if ((usuario._id === id) || (usuario.role === "ADMIN_ROLE")) {
        next();
        return;
    }

    return res.status(401).json({
        ok: false,
        mensaje: 'Token incorrecto - No está permitido la actualizacion',
        errors: { message: 'No puede realizar la operación' }
    });


};