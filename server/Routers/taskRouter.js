import { Router } from "express";
import { gettasks, gettaskbyId, updatetask, createtask, deletetask, gettasksbyStatus} from "../controllers/taskController.js";

const router= Router()

router.get("/:id",gettaskbyId)
router.post("/",createtask)
router.put("/:id",updatetask)
router.delete("/:id",deletetask)
router.get("/", gettasks)
router.get("/filter",gettaskbyId)

export default router