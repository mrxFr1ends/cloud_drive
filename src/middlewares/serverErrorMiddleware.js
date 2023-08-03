export const serverErrorMiddleware = (err, req, res) => {
    console.log(err);
    res.status(err.statusCode || 500).send({
        message: err.statusCode ? err.message : "Internal Server Error",
    });
};
