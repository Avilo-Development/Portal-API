import { Router } from "express";
import CustomerService from "../services/customer.service.js";

const router = Router()
const service = new CustomerService()

router.get('/', async (req, res) => {
    const query = req.query
    console.log(query)
    const customer = await service.getAll(query)
    res.json(customer)
})
router.get('/:id', async (req, res) => {
    const {id} = req.params
    const customer = await service.getOne(id)
    res.json(customer)
})
router.get('/by/:id', async (req, res) => {
    const {id} = req.params
    const customer = await service.getBy(id)
    res.json(customer)
})
router.get('/total/:id', async (req, res) => {
    const {id} = req.params
    const customer = await service.getTotal(id)
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