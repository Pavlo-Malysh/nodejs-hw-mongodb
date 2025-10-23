import bcrypt from "bcrypt";
import { randomBytes } from "crypto";
import createHttpError from "http-errors";
import { UsersCollection } from "../db/models/user.js";
import { THIRTY_DAYS, FIFTEEN_MINUTES } from "../constants/index.js";
import { SessionCollection } from "../db/models/session.js";

export const registerUser = async (payload) => {
    const user = await UsersCollection.findOne({ email: payload.email });
    if (user) throw new createHttpError.Conflict("Email in use");

    const encryptedPassword = await bcrypt.hash(payload.password, 10);

    return await UsersCollection.create({
        ...payload,
        password: encryptedPassword,
    });
};

const createSession = () => {
    const accessToken = randomBytes(30).toString("base64");
    const refreshToken = randomBytes(30).toString("base64");

    return {
        accessToken,
        refreshToken,
        accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
        refreshTokenValidUntil: new Date(Date.now() + THIRTY_DAYS),
    };
};


export const loginUser = async (payload) => {
    const user = await UsersCollection.findOne({ email: payload.email });

    if (!user) throw new createHttpError.Unauthorized("Email or password is incorrect");

    const isEqual = await bcrypt.compare(payload.password, user.password);

    if (!isEqual) throw new createHttpError.Unauthorized("Email or password is incorrect");

    await SessionCollection.deleteOne({ userId: user._id });

    const newSession = createSession();

    return await SessionCollection.create({
        userId: user._id,
        ...newSession,
    });
};


export const logoutUser = async (sessionId) => {
    await SessionCollection.deleteOne({ _id: sessionId });
};

export const refreshUsersSession = async ({ sessionId, refreshToken }) => {
    const session = await SessionCollection.findOne({
        _id: sessionId,
        refreshToken,
    });
    if (!session) throw new createHttpError.Unauthorized("Session not found");

    if (session.refreshToken !== refreshToken) throw new createHttpError.Unauthorized("Refresh token is invalid");

    if (session.refreshTokenValidUntil < new Date()) throw new createHttpError.Unauthorized('Refresh token is expired');

    const newSession = createSession();

    await SessionCollection.deleteOne({ _id: sessionId, refreshToken });

    return await SessionCollection.create({
        userId: session.userId,
        ...newSession,
    });
};