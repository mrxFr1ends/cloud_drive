export const serverErrorMiddleware = (err, req, res, next) => {
    console.log(err);
    res.status(err.statusCode || 500).send({message: err.message});
}