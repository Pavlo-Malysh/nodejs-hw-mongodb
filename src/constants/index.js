import path from "node:path";
import getEnvVar from "../utils/getEnvVar.js";

export const SORT_ORDER = {
    ASC: "asc",
    DESC: "desc",
};

export const PORT = Number(getEnvVar("PORT", "3000"));

export const FIFTEEN_MINUTES = 15 * 60 * 1000;
export const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000;

export const SMTP = {
    SMTP_HOST: 'SMTP_HOST',
    SMTP_PORT: 'SMTP_PORT',
    SMTP_USER: 'SMTP_USER',
    SMTP_PASSWORD: 'SMTP_PASSWORD',
    SMTP_FROM: 'SMTP_FROM',
};

export const JWT_SECRET = 'JWT_SECRET';
export const APP_DOMAIN = "APP_DOMAIN";

export const TEMP_UPLOAD_DIR = path.join(process.cwd(), 'src/tmp');
export const UPLOAD_DIR = path.join(process.cwd(), 'src/uploads');


export const CLOUDINARY = {
    CLOUD_NAME: 'CLOUD_NAME',
    API_KEY: 'API_KEY',
    API_SECRET: 'API_SECRET',
};