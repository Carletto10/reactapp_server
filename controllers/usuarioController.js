const Usuario = require('../models/Usuario')
const bcryptjs = require('bcryptjs');
const { validationResult } = require('express-validator');

const jwt = require('jsonwebtoken');

exports.crearUsuario = async(req, resp) => {

    console.log(req.body);

    // validar si hay errores

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return resp.status(400).json({ errores: errors.array() });
    }

    const { email, password } = req.body;

    try {


        //revisar que el usuario registrado sea unico
        let usuario = await Usuario.findOne({ email });

        if (usuario) {
            resp.status(400).json({ msg: 'El usuario ya existe' });

        }
        //crea nuevo usuario

        usuario = new Usuario(req.body);

        //Hashear el pwd

        const salt = await bcryptjs.genSalt(10);
        usuario.password = await bcryptjs.hash(password, salt);


        //guardar usuario

        await usuario.save();

        //guardar y firmar JWT

        const payload = {
            usuario: {
                id: usuario.id
            }
        }

        jwt.sign(payload, process.env.SECRETA, {
            expiresIn: 3600000
        }, (error, token) => {
            if (error) throw (error);

            resp.json({ token });
        });

        //resp.json({ msg: 'Usuario creado correctamente' });

    } catch (error) {
        console.log(error);
        resp.status(400).send('Hubo un error');
    }
}