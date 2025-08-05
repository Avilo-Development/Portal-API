import { Router } from "express";
import Service from "../services/contact.service.js";
import { authenticateToken } from "../middlewares/authentication.js";

const router = Router()
const service = new Service()

router.get('/', authenticateToken, async (req, res) => {
    const contact = await service.getAll()
    res.json(contact)
})
router.post('/', authenticateToken, async (req,res) => {
    const {body} = req
    const contact = await service.create(body);
    res.json(contact)
})
router.patch('/:id', authenticateToken, async (req,res) => {
    const {body} = req
    const {id} = req.params
    const contact = await service.update(id, body);
    res.json(contact)
})
router.delete('/:id', authenticateToken, async (req, res) => {
    const {id} = req.params
    const contact = await service.delete(id)
    res.json(contact)
})

export default router