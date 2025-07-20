import { Router } from "express";
import Service from "../services/comment.service.js";
import { authenticateToken } from "../middlewares/authentication.js";

const router = Router()
const service = new Service()

router.get('/', authenticateToken, async (req, res) => {
    const comment = await service.getAll()
    res.json(comment)
})
router.post('/', authenticateToken, async (req,res) => {
    const {body} = req
    const {username} = req.user
    const comment = await service.create({...body, created_by: username});
    res.json(comment)
})
router.patch('/:id', authenticateToken, async (req,res) => {
    const {body} = req
    const {id} = req.params
    const comment = await service.update(id, body);
    res.json(comment)
})
router.delete('/:id', authenticateToken, async (req, res) => {
    const {id} = req.params
    const comment = await service.delete(id)
    res.json(comment)
})

export default router