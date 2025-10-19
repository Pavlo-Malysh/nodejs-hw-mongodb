import { ContactsCollection } from "../db/models/contacts.js";
import { calculatePaginationData } from "../utils/calculatePaginationData.js";


export const getAllContacts = async ({ page, perPage, sortBy, sortOrder, filter }) => {
    const limit = perPage;
    const skip = page > 0 ? (page - 1) * perPage : 0;
    const contactQuery = ContactsCollection.find();

    if (filter.type) {
        contactQuery.where("contactType").equals(filter.type);
    };

    if (filter.isFavourite) {
        contactQuery.where("isFavourite").equals(filter.isFavourite);
    }

    const contactCount = await ContactsCollection.find().merge(contactQuery).countDocuments();

    const contacts = await contactQuery.skip(skip).limit(limit).sort({ [sortBy]: sortOrder }).exec();

    const paginationData = calculatePaginationData(contactCount, perPage, page);


    return {
        data: contacts,
        ...paginationData
    };

};


export const getContactById = async (contactId) => {
    const contact = await ContactsCollection.findById(contactId);
    return contact;
};

export const createContact = async (payload) => {
    const contact = await ContactsCollection.create(payload);
    return contact;
};

export const patchContact = async (contactId, payload) => {
    const contact = await ContactsCollection.findByIdAndUpdate(contactId, payload, { new: true });
    return contact;
};

export const deleteContact = async (contactId) => {
    const contact = await ContactsCollection.findByIdAndDelete(contactId);
    return contact;
};