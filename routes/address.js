import { Router } from "express";
import AddressService from "../services/address.service.js";

const router = Router()
const service = new AddressService()

router.get('/', async (req, res) => {
    const address = await service.getAll()
    res.json(address)
})
router.post('/', async (req,res) => {
    const {body} = req
    const address = await service.create(body);
    res.json(address)
})
router.patch('/:id', async (req,res) => {
    const {body} = req
    const {id} = req.params
    const address = await service.update(id, body);
    res.json(address)
})
router.delete('/:id', async (req, res) => {
    const {id} = req.params
    const address = await service.delete(id)
    res.json(address)
})

export default router