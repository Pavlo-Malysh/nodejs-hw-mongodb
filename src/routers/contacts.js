import { Router } from "express";
import { ctrlWrapper } from "../utils/ctrlWrapper.js";
import { createContactController, deleteContactController, getAllContactsController, getContactsByIdController, patchContactController } from "../controllers/contacts.js";
import { validateBody } from "../middlewares/validateBody.js";
import { createContactSchema, updateContactSchema } from "../validation/contacts.js";
import { isValidId } from "../middlewares/isValidId.js";
import { authenticate } from "../middlewares/authenticate.js";
import { upload } from "../middlewares/upload.js";


const router = Router();

router.use(authenticate);

router.get("/", ctrlWrapper(getAllContactsController));

router.get("/:contactId", isValidId, ctrlWrapper(getContactsByIdController));

router.post("/", upload.single("photo"), validateBody(createContactSchema), ctrlWrapper(createContactController));

router.patch("/:contactId", isValidId, upload.single("photo"), validateBody(updateContactSchema), ctrlWrapper(patchContactController));

router.delete("/:contactId", isValidId, ctrlWrapper(deleteContactController));


export default router;
