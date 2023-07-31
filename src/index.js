import express from 'express';
import fileUpload from 'express-fileupload';
import mongoose from 'mongoose';
import apiRouter from './routes/api/index.js';
import { PORT, DB_URL } from './config.js';
import {serverErrorMiddleware} from './middlewares/serverErrorMiddleware.js';

const app = express();
app.use(express.json());
app.use(fileUpload());
app.use('/api', apiRouter);
app.use(serverErrorMiddleware);

// TODO: Если запрос не выполнился, то нужно удалять все что добавил уже
// TODO: или все добавлять в конце. Решение может быть таким. Не использовать
// TODO: create, а использовать new User а потом уже user.save() 

async function startApp() {
    try {
        // Connect to DB
        await mongoose.connect(DB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        // Start server
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (err) {
        console.error(err.message);
    }
}

startApp();