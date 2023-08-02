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

// TODO: Т.к. логика для файлов и папок практически одинаковая, как и их модели
// TODO: возможно стоит объединить их в один какой-то объект, у которого будет поле
// TODO: type = folder или file. Модель сделать одну. И может все таки хранить
// TODO: имя в модели File, а в files будет хранится оригинальное имя да и все.
// TODO: Так же в files в метаданные можно запихнуть id объекта, но тогда
// TODO: наверно не удобно будет искать этот файл. Хотя я в любом случае ищу файлы по всем
// TODO: а так можно и размер вынести еще. Или в Folder добавить id на метаданные где так же размер
// TODO: папки будет. 

// TODO: Если запрос не выполнился, то нужно удалять все что добавил уже
// TODO: или все добавлять в конце. Решение может быть таким. Не использовать
// TODO: create, а использовать new User а потом уже user.save() 

// в Folder pre updateMany для удаления Folder и File.
// В File pre updateMany для удаления FileMetadata. 

// TODO: В идеале сделать pre deleteMany и pre deleteOne у File. 
// TODO: в deleteMany вызывать deleteOne. В deleteOne вызывать удаление metadata
// TODO: в deleteMany Folder вызывать deleteOne Folder
// TODO: в deleteOne Folder вызывать deleteMany по parentId у Folder и File.
// TODO: это удобно т.к. удаление файла можно сделать просто как file.deleteOne и знать что 100% metadata так же удалится

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