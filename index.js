const express = require('express');
const conectarDB = require('./config/db');
const cors = require('cors');

const app = express();


const port = process.env.port || 4002;


app.get('/', (req, resp) => {
    resp.send('Hola Mundo');
});


conectarDB();

//HABILITAR CORS
app.use(cors());

//HABILITAR EXPRESS.JSON
app.use(express.json({ extended: true }));

app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/proyectos', require('./routes/proyectos'));
app.use('/api/tareas', require('./routes/tareas'));

app.listen(port, '0.0.0.0' ,  () => {
    console.log(`EL SERVIDOR ESTA ESCUCHANDO POR EL PUERTO: ${port}`);
});