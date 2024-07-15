function NotFoundHandler(app) {
    app.use((req, res, next) => {
        res.status(404).json({
            message: "Not Found Route"
        })
    })
}

function AllExceptionHandler(app) {
    app.use((err, req, res, next) => {
        let status = err?.status ?? err?.statusCode ?? err?.code;
        if(!status || isNaN(+status) || status > 511 || status < 200) status = 500;
        res.status(status).json({
            message: err?.message ?? err?.stack ?? "InternalServerError"
        })
    })
}

module.exports = {
    NotFoundHandler,
    AllExceptionHandler
}