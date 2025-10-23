import { loginUser, logoutUser, refreshUsersSession, registerUser } from "../services/auth.js";


export const registerUserController = async (req, res) => {
    const user = await registerUser(req.body);

    res.status(201).json({
        status: 201,
        message: "Succesfully registered a user",
        data: user,
    });
};

const setupSession = (res, session) => {

    res.cookie("refreshToken", session.refreshToken, {
        httpOnly: true,
        expires: session.refreshTokenValidUntil,
    });

    res.cookie("sessionId", session._id, {
        httpOnly: true,
        expires: session.refreshTokenValidUntil,
    });
};



export const loginUserController = async (req, res) => {
    const session = await loginUser(req.body);

    setupSession(res, session);

    res.status(200).json({
        status: 200,
        message: "Successfully logged in an user!",
        data: {
            accessToken: session.accessToken
        },
    });

};

export const logoutUserController = async (req, res) => {
    if (req.cookies.sessionId) {
        await logoutUser(req.cookies.sessionId);
    };
    res.clearCookie('sessionId');
    res.clearCookie('refreshToken');

    res.send({ status: 204, message: 'User logout successfully' });
};

export const refreshUsersSessionControllers = async (req, res) => {
    const { sessionId, refreshToken } = req.cookies;

    const session = await refreshUsersSession({ sessionId, refreshToken });

    setupSession(res, session);

    res.status(200).json({
        status: 200,
        message: "Successfully refreshed a session!",
        data: {
            accessToken: session.accessToken,
        }
    });
};

