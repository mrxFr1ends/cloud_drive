// eslint-disable-next-line no-unused-vars
export const serverErrorMiddleware = (err, req, res, next) => {
    console.error(err);
    res.status(err.statusCode || 500).send({
        message: err.statusCode ? err.message : "Internal Server Error",
    });
};
