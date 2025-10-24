import { ContactsCollection } from "../db/models/contacts.js";
import { calculatePaginationData } from "../utils/calculatePaginationData.js";


export const getAllContacts = async ({ page, perPage, sortBy, sortOrder, filter, userId }) => {
    const limit = perPage;
    const skip = page > 0 ? (page - 1) * perPage : 0;
    const contactQuery = ContactsCollection.find({ userId });

    if (filter.type) {
        contactQuery.where("contactType").equals(filter.type);
    };

    if (filter.isFavourite) {
        contactQuery.where("isFavourite").equals(filter.isFavourite);
    }

    const [contactCount, contacts] = await Promise.all([
        ContactsCollection.find().merge(contactQuery).countDocuments(),
        contactQuery.skip(skip).limit(limit).sort({ [sortBy]: sortOrder }).exec()
    ]);

    const paginationData = calculatePaginationData(contactCount, perPage, page);


    return {
        data: contacts,
        ...paginationData
    };

};


export const getContactById = async (contactId, userId) => {
    const contact = await ContactsCollection.findOne({ _id: contactId, userId });
    return contact;
};

export const createContact = async (payload) => {
    const contact = await ContactsCollection.create(payload);
    return contact;
};

export const patchContact = async (contactId, userId, payload) => {
    const contact = await ContactsCollection.findOneAndUpdate({ _id: contactId, userId }, { $set: payload }, { new: true });
    return contact;
};

export const deleteContact = async (contactId, userId) => {
    const contact = await ContactsCollection.findByIdAndDelete({ _id: contactId, userId });
    return contact;
};