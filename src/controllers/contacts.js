import createHttpError from "http-errors";
import { createContact, deleteContact, getAllContacts, getContactById, patchContact } from "../services/contacts.js";


export const getAllContactsController = async (req, res) => {
    const contacts = await getAllContacts();
    res.status(200).json({
        status: 200,
        message: "Successfully found contacts!",
        data: contacts
    });
};


export const getContactsByIdController = async (req, res) => {
    const { contactId } = req.params;
    const contact = await getContactById(contactId);

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
    const contact = await createContact(req.body);
    res.status(201).json({
        status: 201,
        message: "Successfully created a contact!",
        data: contact,
    });
};

export const patchContactController = async (req, res, next) => {
    const { contactId } = req.params;
    const contact = await patchContact(contactId, req.body);


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
    const contact = await deleteContact(contactId);

    if (!contact) {
        throw new createHttpError.NotFound("Contact not found");
    };

    res.status(204).send();
};