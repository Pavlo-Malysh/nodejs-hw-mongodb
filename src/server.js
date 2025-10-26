import * as fs from "node:fs";
import express from "express";
import cors from "cors";
import pino from "pino-http";
import swaggerUI from "swagger-ui-express";
import { errorHandler } from "./middlewares/errorHandler.js";
import { notFoundHandler } from "./middlewares/notFoundHandler.js";
import routers from "./routers/index.js";
import cookieParser from "cookie-parser";
import { PORT, UPLOAD_DIR } from "./constants/index.js";
import path from "node:path";



export default function setupServer() {
    const SWAGGER_DOCUMENT = JSON.parse(fs.readFileSync(path.join("docs", "swagger.json")));

    const app = express();

    app.use(express.json());
    app.use(cors());
    app.use(cookieParser());


    app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(SWAGGER_DOCUMENT));

    app.use(
        pino({
            transport: {
                target: "pino-pretty",
            }
        })
    );

    app.use('/uploads', express.static(UPLOAD_DIR));


    app.use(routers);
    app.use(notFoundHandler);
    app.use(errorHandler);


    app.listen(PORT, (err) => {

        if (err) {
            console.log(err);
        };
        console.log(`Server is running on port ${PORT}`);

    });
};