import * as fs from "node:fs/promises";
import path from "node:path";
import createHttpError from "http-errors";
import { createContact, deleteContact, getAllContacts, getContactById, patchContact } from "../services/contacts.js";
import { parsePaginationParams } from "../utils/parsePaginationParams.js";
import { parseSortParams } from "../utils/parseSortParams.js";
import { parseFilterParams } from "../utils/parseFilterParams.js";
import { APP_DOMAIN, UPLOAD_DIR } from "../constants/index.js";
import { saveFileToCloudinary } from "../utils/ saveFileToCloudinary.js";
import getEnvVar from "../utils/getEnvVar.js";

export const getAllContactsController = async (req, res) => {
    const { page, perPage } = parsePaginationParams(req.query);
    const { sortBy, sortOrder } = parseSortParams(req.query);
    const filter = parseFilterParams(req.query);

    const contacts = await getAllContacts({ page, perPage, sortBy, sortOrder, filter, userId: req.user._id });

    res.status(200).json({
        status: 200,
        message: "Successfully found contacts!",
        data: contacts
    });
};


export const getContactsByIdController = async (req, res) => {
    const { contactId } = req.params;
    const contact = await getContactById(contactId, req.user.id);

    if (!contact) {
        throw new createHttpError.NotFound("Contact not found");
    };

    res.status(200).json({
        status: 200,
        message: `Successfully found contact with id ${contactId}!`,
        data: contact,
    });
};

export const createContactController = async (req, res, next) => {

    let photoUrl;

    if (getEnvVar("UPLOAD_CLOUDINARY") === "true") {
        photoUrl = await saveFileToCloudinary(req.file);
    } else {
        const destPath = path.join(UPLOAD_DIR, req.file.filename);
        await fs.rename(req.file.path, destPath);

        photoUrl = `${getEnvVar(APP_DOMAIN)}/uploads/${req.file.filename}`;
    }

    const contact = await createContact({
        ...req.body,
        photo: photoUrl,
        userId: req.user.id
    });
    res.status(201).json({
        status: 201,
        message: "Successfully created a contact!",
        data: contact,
    });
};

export const patchContactController = async (req, res, next) => {
    const { contactId } = req.params;
    const userId = req.user.id;

    let photoUrl;

    if (getEnvVar("UPLOAD_CLOUDINARY") === "true") {
        photoUrl = await saveFileToCloudinary(req.file);
    } else {
        const destPath = path.join(UPLOAD_DIR, req.file.filename);
        await fs.rename(req.file.path, destPath);

        photoUrl = `${getEnvVar(APP_DOMAIN)}/uploads/${req.file.filename}`;
    }
    const payload = { ...req.body, photo: photoUrl };
    const contact = await patchContact(contactId, userId, payload);


    if (!contact) {
        throw new createHttpError.NotFound("Contact not found");
    };

    res.status(200).json({
        status: 200, message: "Successfully patched a contact!",
        data: contact
    });

};

export const deleteContactController = async (req, res, next) => {
    const { contactId } = req.params;
    const contact = await deleteContact(contactId, req.user.id);

    if (!contact) {
        throw new createHttpError.NotFound("Contact not found");
    };

    res.status(204).send();
};