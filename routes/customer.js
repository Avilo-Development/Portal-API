import { Router } from "express";
import CustomerService from "../services/customer.service.js";

const router = Router()
const service = new CustomerService()

router.get('/', async (req, res) => {
    const customer = await service.getAll()
    res.json(customer)
})
router.post('/', async (req,res) => {
    const {body} = req
    const customer = await service.create(body);
    res.json(customer)
})
router.patch('/:id', async (req,res) => {
    const {body} = req
    const {id} = req.params
    const customer = await service.update(id, body);
    res.json(customer)
})
router.delete('/:id', async (req, res) => {
    const {id} = req.params
    const customer = await service.delete(id)
    res.json(customer)
})

export default router