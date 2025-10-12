import { HttpError } from "http-errors";

export function errorHandler(error, req, res, next) {

    if (error instanceof HttpError) {
        res.status(error.status).json({
            status: error.status,
            message: error.name,
            data: error,
        });
        return;
    };
    console.log(error.message);

    res.status(500).json({ status: 500, message: "Something went wrong", data: error.data });

}