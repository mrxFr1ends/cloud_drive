# Краткое описание

Backend проект, аналог google диска. С авторизацией пользователей, с личными папками с их файлами и корзиной.

# Возможности
## Минимальные для реализации

* Пользователь
    * Регистрация
    * Авторизация
-----
* Пользователь с файлами
    * Загрузить файл/файлы
    * Скачать файл/файлы
    * Переместить файл/файлы/папки в корзину
    * Удалить файл/файлы/папки из корзины

## В будущем
* Пользователь
    * Восстановить пароль
    * Удалить аккаунт
----- 
* Пользователь с файлами
    * Создать папку
    * Скачать папку (архив папки)
    * Поделится файлом
    * Установить доступ к файлу
    * Загрузить папку?

# REST Api

### Таблица ошибок:

| Название ошибки         | Код ошибки | Поле message                                    |
|-------------------------|------------|-------------------------------------------------|
| User.Exists              | 409        | User with this email or username already exists |
| User.IncorrectLoginData | 401        | Incorrect email, username or password           |
| User.NoAuth             | 401        | User not logged in                              |
| User.InvalidToken       | 403        | Error verifying token                           |
| User.NotFound           | 404        | User not found                                  |
| File.NoUploadedFiles            | 400        | No files for upload                             |
| File.NotFound           | 404        | File not found                                  |
| File.NoAccess           | 403        | No access to file                               |
| Folder.NotFound         | 404        | Folder not found                                |
| Folder.NoAccess         | 403        | No access to folder                             |
| Main.ValidationFailed   | 400        | Validation Failed                               |
| Server.InternalError    | 500        | Internal Server Error                           |

## 1. Регистрация
Путь: **/api/auth/register**

Метод: **POST**

### Пример тела запроса:
```json
{
    "username": "test_username",
    "email": "test_email",
    "password": "test_password" 
}
```

### Варианты ответов:

* 409. [**User.Exists**](#таблица-ошибок) 
* 500. [**Server.InternalError**](#таблица-ошибок) 
* 201. Пользователь создан

```json
{
    "user": {
        "_id": "64c791154eb2d8ca275d5af1",
        "username": "test_username",
        "email": "test_email"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRlc3RfdXNlcm5hbWUiLCJlbWFpbCI6InRlc3RfZW1haWwiLCJpYXQiOjE1MTYyMzkwMjJ9.TJAcelYgCKduk1xREXVxDaG9T7VVQEFti99zB_tfe3o"
}
```

## 2. Авторизация
Путь: **/api/auth/login**

Метод: **POST**

### Пример тела запроса:
```json
{
    "login": "test_username", // or "test_email"
    "password": "test_password" 
}
```

### Варианты ответов:

* 401. [**User.IncorrectLoginData**](#таблица-ошибок) 
* 500. [**Server.InternalError**](#таблица-ошибок) 
* 200. Авторизация прошла успешно

```json
{
    "user": {
        "_id": "64c791154eb2d8ca275d5af1",
        "username": "test_username",
        "email": "test_email"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRlc3RfdXNlcm5hbWUiLCJlbWFpbCI6InRlc3RfZW1haWwiLCJpYXQiOjE1MTYyMzkwMjJ9.TJAcelYgCKduk1xREXVxDaG9T7VVQEFti99zB_tfe3o"
}
```

## 3. Загрузка файла/файлов
Путь: **/api/disk/upload/file**

Метод: **POST**

### Пример тела запроса:
```json
{
    "folderId": "64c791154eb2d8ca275d5af1",
    "uploadedFiles": "..." // some file 
}
```

### Варианты ответов:

* 401. [**User.NoAuth**](#таблица-ошибок) 
* 403. [**User.InvalidToken**](#таблица-ошибок) 
* 404. [**User.NotFound**](#таблица-ошибок) 
* 400. [**File.NoUploadedFiles**](#таблица-ошибок) 
* 403. [**Folder.NoAccess**](#таблица-ошибок) 
* 404. [**Folder.NotFound**](#таблица-ошибок) 
* 500. [**Server.InternalError**](#таблица-ошибок) 
* 201. Успешная загрузка файла/файлов

```json
{
    "files": [
        {
            "_id": "64c79261c7dba119b724566c",
            "ownerId": "64c791154eb2d8ca275d5af1",
            "parentId": "64c791154eb2d8ca275d5af1",
            "metadata": {
                "length": 2681,
                "uploadDate": "2023-07-31T10:52:17.443Z",
                "filename": "test_filename.txt"
            },
            "__v": 0
        }
    ]
}
```

## 4. Создать папку
Путь: **/api/disk/folder**

Метод: **POST**

### Пример тела запроса:
```json
{
    "name": "Test Folder name",
    "parentId": "64c791154eb2d8ca275d5af1"
}
```

### Варианты ответов:

* 401. [**User.NoAuth**](#таблица-ошибок) 
* 403. [**User.InvalidToken**](#таблица-ошибок) 
* 404. [**User.NotFound**](#таблица-ошибок) 
* 403. [**Folder.NoAccess**](#таблица-ошибок) 
* 404. [**Folder.NotFound**](#таблица-ошибок) 
* 500. [**Server.InternalError**](#таблица-ошибок) 
* 201. Успешное создание папки

```json
{
    "name": "Test Folder name",
    "ownerId": "64c791154eb2d8ca275d5af1",
    "parentId": "64c791154eb2d8ca275d5af1",
    "_id": "64c79eedaddec7dcf40d12cc",
    "__v": 0
}
```

## 5. Получить информацию о папке по id или токену
Путь: **/api/disk/folder** или **/api/disk/folder/:id**

Метод: **GET**

### Варианты ответов:

* 401. [**User.NoAuth**](#таблица-ошибок) 
* 403. [**User.InvalidToken**](#таблица-ошибок) 
* 404. [**User.NotFound**](#таблица-ошибок) 
* 403. [**Folder.NoAccess**](#таблица-ошибок) 
* 404. [**Folder.NotFound**](#таблица-ошибок) 
* 500. [**Server.InternalError**](#таблица-ошибок) 
* 200. Успешное получение информации

```json
{
    "folder": {
        "_id": "64c7890f661c0dbdb684a847",
        "name": "64c7890f661c0dbdb684a847",
        "ownerId": "64c7890f661c0dbdb684a847",
        "parentId": null,
        "__v": 0
    },
    "folders": [
        {
            "_id": "64c7891c661c0dbdb684a857",
            "name": "Test Folder name",
            "ownerId": "64c7890f661c0dbdb684a847",
            "parentId": "64c7890f661c0dbdb684a847",
            "__v": 0
        }
    ],
    "files": [
        {
            "_id": "64c78918661c0dbdb684a850",
            "ownerId": "64c7890f661c0dbdb684a847",
            "parentId": "64c7890f661c0dbdb684a847",
            "metadata": {
                "length": 2681,
                "uploadDate": "2023-07-31T10:12:41.619Z",
                "filename": "test_filename.txt"
            },
            "__v": 0
        }
    ]
}
```

## 6. Скачать файл

Путь: **/api/disk/download/file/:id**

Метод: **GET**

### Пример запроса:

```http
GET /api/disk/download/file/64c79261c7dba119b724566c HTTP/1.1
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRlc3RfdXNlcm5hbWUiLCJlbWFpbCI6InRlc3RfZW1haWwiLCJpYXQiOjE1MTYyMzkwMjJ9.TJAcelYgCKduk1xREXVxDaG9T7VVQEFti99zB_tfe3o
```

### Варианты ответа:

* 401. [**User.NoAuth**](#таблица-ошибок) 
* 403. [**User.InvalidToken**](#таблица-ошибок) 
* 404. [**User.NotFound**](#таблица-ошибок)
* 403. [**File.NoAccess**](#таблица-ошибок) 
* 404. [**File.NotFound**](#таблица-ошибок) 
* 500. [**Server.InternalError**](#таблица-ошибок) 
* 200. Отправка файла

## 7. Скачать папку (как zip архив)

Путь: **/api/disk/download/folder**

Метод: **GET**

### Пример тела запроса:
```http
GET /api/disk/download/folder/64c79261c7dba119b724566c HTTP/1.1
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRlc3RfdXNlcm5hbWUiLCJlbWFpbCI6InRlc3RfZW1haWwiLCJpYXQiOjE1MTYyMzkwMjJ9.TJAcelYgCKduk1xREXVxDaG9T7VVQEFti99zB_tfe3o
```

### Варианты ответов:

* 401. [**User.NoAuth**](#таблица-ошибок) 
* 403. [**User.InvalidToken**](#таблица-ошибок) 
* 404. [**User.NotFound**](#таблица-ошибок)
* 403. [**Folder.NoAccess**](#таблица-ошибок) 
* 404. [**Folder.NotFound**](#таблица-ошибок) 
* 500. [**Server.InternalError**](#таблица-ошибок) 
* 201. Отправка zip-архива

## 8. Переместить файл/файлы/папки в корзину

Путь: **/api/disk/file**

Метод: **PUT**

## 9. Удалить файл/файлы/папки из корзины

Путь: **/api/disk/file**

Метод: **DELETE**