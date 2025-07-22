const { Router } = require("express");
const { addMembers, getMembers } = require("../controller/memberController");
const memberRoutes = Router();

memberRoutes.get('/get-members', getMembers);
memberRoutes.post('/add-members', addMembers);

export default memberRoutes;