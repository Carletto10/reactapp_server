const Proyecto = require('../models/Proyecto')
const { validationResult } = require('express-validator');

exports.crearProyecto = (req, resp) => {


    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return resp.status(400).json({ errores: errors.array() });
    }


    try {
        const proyecto = new Proyecto(req.body);

        proyecto.creador = req.usuario.id;

        proyecto.save();
        resp.json(proyecto);

    } catch (error) {
        console.log(error);
    }
}


exports.obtenerProyectos = async(req, resp) => {

    try {

        console.log(req.usuario);
        const proyectos = await Proyecto.find({ creador: req.usuario.id });
        resp.json(proyectos);
    } catch (error) {
        console.log(error);
        resp.status(500).send('Hubo un error');
    }
}


exports.actualizarProyecto = async(req, resp) => {

    console.log(req.params.id);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return resp.status(400).json({ errores: errors.array() });
    }

    const _id = req.params.id;

    //extraer la info del proyecto

    const { nombre } = req.body;

    const nuevoProyecto = {}

    if (nombre) {
        nuevoProyecto.nombre = nombre;
    }

    try {

        //si el proyecto existe o no

        let proyecto = await Proyecto.findOne({ _id: _id });


        if (!proyecto) {
            return resp.status(404).json({ msg: 'Proyecto no encontrado' });
        }
        //verificar el creador del proyecto
        console.log("----------------------------");

        if (proyecto.creador.toString() != req.usuario.id) {
            return resp.status(401).json({ msg: 'No autorizado' });
        }

        //ACTUALZIR

        proyecto = await Proyecto.findOneAndUpdate({ _id: req.params.id }, { $set: nuevoProyecto }, { new: true });
        resp.json({ proyecto });



    } catch (error) {
        console.log(error);
        resp.status(500).send('Error en el serv');
    }
}

//ELIMINA UN PROYECTO POR SU ID

exports.eliminiarProyecto = async(req, resp) => {
    try {

        const _id = req.params.id;
        //si el proyecto existe o no
        let proyecto = await Proyecto.findOne({ _id: _id });
        if (!proyecto) {
            return resp.status(404).json({ msg: 'Proyecto no encontrado' });
        }
        //verificar el creador del proyecto
        console.log("----------------------------");
        if (proyecto.creador.toString() != req.usuario.id) {
            return resp.status(401).json({ msg: 'No autorizado' });
        }

        await Proyecto.findByIdAndRemove({ _id: _id });
        resp.json({ msg: "Proyecto eliminado" });

    } catch (error) {
        console.log(error);
        resp.status(500).send('Hubo un error');
    }
}