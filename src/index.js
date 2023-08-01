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

// ! На данный момент добавление папки в корзину происходит следующим образом
// ! У папки меняется prevParendId на текущий parentId, parentId на null и trashed на true
// ! У каждого файла и папки внутри папки вызывается так же обновление trashed на true
// ! То есть сложность O(n^2) т.к. сначала мы находим под папку из общего массива, 
// ! потом мы находим еще подпапку из того же массива и так далее. Тоже самое с файлами.

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