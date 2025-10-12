import createHttpError from "http-errors";

export function notFoundHandler(req, res, next) {
    throw new createHttpError.NotFound("Route not Found");
}