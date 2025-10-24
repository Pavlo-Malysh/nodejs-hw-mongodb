
import createHttpError from "http-errors";
import { SessionCollection } from "../db/models/session.js";
import { UsersCollection } from "../db/models/user.js";


export const authenticate = async (req, res, next) => {
    const authHeader = req.get("Authorization");

    if (!authHeader) {
        next(createHttpError.Unauthorized("Please provide Authorization header"));
        return;
    };

    const bearer = authHeader.split(" ")[0];
    const token = authHeader.split(" ")[1];
    console.log("TOKEN", token);


    if (bearer !== "Bearer" || !token) {
        next(createHttpError.Unauthorized('Auth header should be of type Bearer'));
        return;
    }

    const session = await SessionCollection.findOne({ accessToken: token });
    if (!session) {
        next(createHttpError.Unauthorized('Session not found'));
        return;
    }

    if (session.accessTokenValidUntil < new Date()) {
        next(createHttpError.Unauthorized('Access token expired'));
        return;
    }

    const user = await UsersCollection.findById(session.userId);

    if (!user) {
        next(createHttpError.Unauthorized("User not found"));
    };
    req.user = user;

    next();

};