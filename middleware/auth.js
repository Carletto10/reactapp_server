const jwt = require('jsonwebtoken');



module.exports = function(req, resp, next) {

    //LEER EL TOKEN DEL HEADER

    const token = req.header('x-auth-token')

    console.log(token);

    //REVISAR SI NO HAY TOKEN

    if (!token) {
        return resp.status(400).json({ msg: 'No hay token permiso denegado' });
    }

    try {

        const cifrado = jwt.verify(token, process.env.SECRETA);
        req.usuario = cifrado.usuario;
        next();

    } catch (error) {
        clg('error');
    }
    //VALIDAR TOKEN

}