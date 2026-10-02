import { Router } from "express";
import { getboardbyId, createboard, updateboard, deleteboard, getboards } from "../controllers/boardController.js";
import authenticationMiddleware from "../middlewares/authenticationMiddleware.js";
import isOwnerUserMiddleware from "../middlewares/isOwnerUserMiddleware.js";

const router= Router()

router.get("/:id",authenticationMiddleware,getboardbyId)
router.post("/",authenticationMiddleware,createboard)
router.patch("/:id",authenticationMiddleware,isOwnerUserMiddleware,updateboard)
router.delete("/:id",authenticationMiddleware,isOwnerUserMiddleware,deleteboard)
router.get("/",authenticationMiddleware,getboards)

export default router