import { Router } from "express";
import Service from "../services/notification.service.js";
import { authenticateToken } from "../middlewares/authentication.js";

const router = Router()
const service = new Service()

router.get('/', authenticateToken, async (req, res) => {
    const { username } = req?.user
    const notification = await service.getUnseen(username)
    res.json(notification)
})
router.post('/', authenticateToken, async (req,res) => {
    const {body} = req
    const notification = await service.create(body);
    res.json(notification)
})
router.patch('/:id', authenticateToken, async (req,res) => {
    const {username} = req.user
    const {id} = req.params
    const notification = await service.update(id, username);
    res.json(notification)
})
router.delete('/:id', authenticateToken, async (req, res) => {
    const {id} = req.params
    const notification = await service.delete(id)
    res.json(notification)
})

export default router