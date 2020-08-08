require('dotenv/config');
const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require('./utils/database');
const authRouter = require('./routes/auth');
const usersRouter = require('./routes/users');
const fileRouter = require('./routes/files');
const fileUpload = require('express-fileupload');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(fileUpload({ createParentPath: true }));
app.use(cors());
app.use('/', authRouter);
app.use('/', usersRouter);
app.use('/file', fileRouter);

async function start() {
    try {
        await sequelize.sync();
        app.listen(PORT, () => {
            console.log(`Server is starting on the port ${PORT}`)
        });

    } catch (e) {
        console.log(e);
    }
}

start();