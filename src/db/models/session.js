import { Schema, model } from "mongoose";

const sessionsSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        reqiured: true,
    },
    accessToken: {
        type: String,
        reqiured: true,
    },
    refreshToken: {
        type: String,
        reqiured: true,
    },
    accessTokenValidUntil: {
        type: Date,
        required: true,
    },
    refreshTokenValidUntil: {
        type: Date,
        required: true,
    },
}, {
    versionKey: false,
    timestamps: true,
});

export const SessionCollection = model("Session", sessionsSchema);


