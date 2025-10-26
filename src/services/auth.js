import * as fs from "node:fs";
import path from "node:path";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import Handlebars from "handlebars";
import { randomBytes } from "crypto";
import createHttpError from "http-errors";
import { UsersCollection } from "../db/models/user.js";
import { THIRTY_DAYS, FIFTEEN_MINUTES, SMTP, JWT_SECRET, APP_DOMAIN } from "../constants/index.js";
import { SessionCollection } from "../db/models/session.js";
import getEnvVar from "../utils/getEnvVar.js";
import { sendEmail } from "../utils/sendMail.js";

const SEND_RESET_EMAIL_TEMPLATE = fs.readFileSync(path.resolve("src/templates/send-reset-email.html"), { encoding: "utf-8" });


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


export const sendResetEmail = async (email) => {
    const user = await UsersCollection.findOne({ email });

    if (!user) throw new createHttpError.Unauthorized("User not found");

    const resetToken = jwt.sign(
        {
            sub: user._id,
            email,
        },
        getEnvVar(JWT_SECRET),
        {
            expiresIn: "5m"
        }
    );

    const template = Handlebars.compile(SEND_RESET_EMAIL_TEMPLATE);


    await sendEmail({
        from: getEnvVar(SMTP.SMTP_FROM),
        to: email,
        subject: "Reset your password",
        html: template({
            name: user.name,
            resetToken: `${getEnvVar(APP_DOMAIN)}/reset-password?token=${resetToken}`,
        })
    });
};


export const resetPassword = async (token, password) => {
    try {
        const decoded = jwt.verify(token, getEnvVar(JWT_SECRET));

        const user = await UsersCollection.findOne({ _id: decoded.sub, email: decoded.email });
        if (!user) throw new createHttpError.Unauthorized("User not found");

        const hashedNewPassword = await bcrypt.hash(password, 10);
        await UsersCollection.updateOne({ _id: decoded.sub }, { password: hashedNewPassword });
        await SessionCollection.deleteOne({ _id: decoded.sub });

    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            throw createHttpError.Unauthorized("Token is expired or invalid.");
        }

        if (error.name === 'JsonWebTokenError') {
            throw createHttpError.Unauthorized('Token is expired or invalid.');
        }
        throw error;
    }
};