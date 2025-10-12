import { Router } from "express";
import { ctrlWrapper } from "../utils/ctrlWrapper.js";
import { createContactController, deleteContactController, getAllContactsController, getContactsByIdController, patchContactController } from "../controllers/contacts.js";


const router = Router();

router.get("/contacts", ctrlWrapper(getAllContactsController));

router.get("/contacts/:contactId", ctrlWrapper(getContactsByIdController));

router.post("/contacts", ctrlWrapper(createContactController));

router.patch("/contacts/:contactId", ctrlWrapper(patchContactController));

router.delete("/contacts/:contactId", ctrlWrapper(deleteContactController));


export default router;
