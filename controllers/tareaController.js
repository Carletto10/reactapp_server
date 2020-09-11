const Tarea = require('../models/Tarea');
const Proyecto = require('../models/Proyecto');
const { validationResult } = require('express-validator');
//CREAR UNA NUEVA TAREA

exports.crearTarea = async(req, resp) => {

    try {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return resp.status(400).json({ errores: errors.array() });
        }

        const { proyecto } = req.body;
        //si el proyecto existe o no
        let existeProyecto = await Proyecto.findById(proyecto);
        if (!existeProyecto) {
            return resp.status(404).json({ msg: 'Proyecto no encontrado' });
        }

        //verificar el creador del proyecto
        console.log("----------------------------");
        if (existeProyecto.creador.toString() != req.usuario.id) {
            return resp.status(401).json({ msg: 'No autorizado' });
        }

        //creamos la nueva tarea

        const tarea = new Tarea(req.body);
        await tarea.save();
        resp.json({ tarea });

    } catch (error) {
        console.log(error);
        resp.status(500).send('Hubo un error');
    }
}

exports.obtenerTareas = async(req, resp) => {

    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return resp.status(400).json({ errores: errors.array() });
        }

        //const { proyecto } = req.body;
        const { proyecto } = req.query;
        console.log('Proyecto:' + proyecto);
        //si el proyecto existe o no
        let existeProyecto = await Proyecto.findById(proyecto);
        if (!existeProyecto) {
            return resp.status(404).json({ msg: 'Proyecto no encontrado' });
        }

        //verificar el creador del proyecto
        console.log("----------------------------");
        if (existeProyecto.creador.toString() != req.usuario.id) {
            return resp.status(401).json({ msg: 'No autorizado' });
        }

        const tareas = await Tarea.find({ proyecto });
        resp.json(tareas);

    } catch (error) {
        console.log(error);
        resp.status(500).send('Hubo un error');
    }
}

exports.actualizarTarea = async(req, resp) => {
    try {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return resp.status(400).json({ errores: errors.array() });
        }

        const { proyecto, nombre, estado } = req.body;
        console.log(req.body);
        //si el proyecto existe o no
        let existeProyecto = await Proyecto.findById(proyecto);
        if (!existeProyecto) {
            return resp.status(404).json({ msg: 'Proyecto no encontrado' });
        }

        //si la tarea no existe
        let existeTarea = await Tarea.findById(req.params.id);
        if (!existeTarea) {
            return resp.status(404).json({ msg: 'Tarea no encontrada' });
        }

        //verificar el creador del proyecto
        console.log("----------------------------");
        if (existeProyecto.creador.toString() != req.usuario.id) {
            return resp.status(401).json({ msg: 'No autorizado' });
        }

        //CREAR OBJETO  CON NUEVA INFO

        const nueaTarea = {};

        //if (nombre) 
        existeTarea.nombre = nombre;
        //if (estado) 
        existeTarea.estado = estado;

        //guardar la tarea
        existeTarea = await Tarea.findOneAndUpdate({ _id: req.params.id }, existeTarea, { new: true });
        resp.json(existeTarea);
    } catch (error) {
        console.log(error);
        resp.status(500).send('Hubo un error');
    }
}


exports.eliminiarTarea = async(req, resp) => {
    try {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return resp.status(400).json({ errores: errors.array() });
        }

        //const { proyecto } = req.body;
        const { proyecto } = req.query;
        //si el proyecto existe o no
        let existeProyecto = await Proyecto.findById(proyecto);
        if (!existeProyecto) {
            return resp.status(404).json({ msg: 'Proyecto no encontrado' });
        }

        //si la tarea no existe
        let existeTarea = await Tarea.findById(req.params.id);
        if (!existeTarea) {
            return resp.status(404).json({ msg: 'Tarea no encontrada' });
        }

        //verificar el creador del proyecto
        console.log("----------------------------");
        if (existeProyecto.creador.toString() != req.usuario.id) {
            return resp.status(401).json({ msg: 'No autorizado' });
        }

        //ELIMINAR 

        await Tarea.findByIdAndRemove({ _id: req.params.id });
        resp.json({ msg: 'Tarea Eliminada' });
    } catch (error) {
        console.log(error);
        resp.status(500).send('Hubo un error');
    }
}