import { Router } from "express";
import { addMembers, getMembers } from "../controller/memberController";
const memberRoutes = Router();

memberRoutes.get('/get-members', getMembers);
memberRoutes.post('/add-members', addMembers);

export default memberRoutes;