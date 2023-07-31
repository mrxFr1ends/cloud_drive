export const serverErrorMiddleware = (err, req, res, next) => {
    console.error(err);
    res.status(500).send({message: "Server error"});
}