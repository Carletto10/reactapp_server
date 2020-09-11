const express = require('express');
const router = express.Router();
const tareaController = require('../controllers/tareaController');

const auth = require('../middleware/auth');
const { check } = require('express-validator');


router.post('/',
    auth,
    check('nombre', 'El nombre de la tara  es obligatorio').not().isEmpty(),
    check('proyecto', 'El Proyecto es obligatorio').not().isEmpty(),
    tareaController.crearTarea
);

router.get('/',
    auth,
    tareaController.obtenerTareas
)


//ACTUALIZAR TAREA
router.put('/:id',
    auth,
    // check('nombre', 'El nombre del proyecto es obligatorio').not().isEmpty(),
    tareaController.actualizarTarea
)

//ELIMINAR PROYECTO
router.delete('/:id',
    auth,
    tareaController.eliminiarTarea
)

module.exports = router;