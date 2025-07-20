import { Router } from "express";
import ProjectService from "../services/project.service.js";
import { authenticateToken } from "../middlewares/authentication.js";

const router = Router()
const service = new ProjectService()

router.get('/', async (req, res) => {
    const project = await service.getAll()
    res.json(project)
})
router.post('/', authenticateToken, async (req,res) => {
    const {name,estimate,hcp_url,address,deadline_date,send_date,budget,quote,visit,progress,finished} = req.body
    const user_id = req.user.username
    const project = await service.create({name,estimate,hcp_url,address,deadline_date,send_date,budget,quote,visit, progress,finished, user_id});

    res.json(project)
})
router.patch('/:id', authenticateToken, async (req,res) => {
    const {body} = req
    const {id} = req.params
    const project = await service.update(id, body);
    res.json(project)
})
router.delete('/:id', authenticateToken, async (req, res) => {
    const {id} = req.params
    const project = await service.delete(id)
    res.json(project)
})

export default router