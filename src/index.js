import express from 'express';
import fileUpload from 'express-fileupload';
import mongoose from 'mongoose';
import apiRouter from './routes/api/index.js';
import {serverErrorMiddleware} from './middlewares/serverErrorMiddleware.js';
import { initBucket } from './helpers/bucketHelper.js';
import cors from "cors";
import "dotenv/config";

// import { PORT, DB_URL, BUCKET_NAME, CLIENT_URL } from './config.js';
const { PORT, DB_URL, BUCKET_NAME, CLIENT_URL } = process.env;

const app = express();
app.use(cors({
    credentials: true,
    origin: CLIENT_URL
}));
app.use(express.json());
app.use(fileUpload({
    defParamCharset: 'utf8'
}));
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

// TODO: Написать тесты. Перепроверить работу validateMiddleware. Возможно что-то своё придумать для фильтрации данных
// TODO: и возможно все таки найти что-то. Ошибку может стоит возвращать. Не знаю пока.

async function startApp() {
    try {
        // Connect to DB
        await mongoose.connect(DB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        // Init bucket
        initBucket(mongoose.connection.db, BUCKET_NAME);
        // Start server
        app.listen(PORT || 5000, () => {
            console.log(`Server is running on port ${PORT || 5000}`);
        });
    } catch (err) {
        console.error(err.message);
    }
}

startApp();