import { Router } from "express";
import { authenticateToken, authorizeRoles } from "../middlewares/authentication.js";
import FinanceService from "../services/finace.service.js";

const router = Router()
const service = new FinanceService()

router.get('/', authenticateToken, async (req, res) => {
    const query = req.query
    const finances = await service.getAll(query)
    res.json(finances)
})
router.get('/customers', authenticateToken, async (req,res) => {
    const query = req.query
    const finances = await service.getCustomers(query)
    res.json(finances)
})
router.get('/grouped', authenticateToken, async (req, res) => {
    const {date} = req.query
    const finances = await service.getGrouped(date)
    res.json(finances)
})
router.get('/summary', authenticateToken, async (req,res) => {
    const {date} = req.query
    const finance = await service.getTotal(date)
    res.json(finance[0])
})
router.get('/:id', authenticateToken, async (req,res) => {
    const {id} = req.params
    const finance = await service.getByPK(id)
    res.json(finance)
})
router.get('/by/:id', authenticateToken, async (req,res) => {
    const {id} = req.params
    const finance = await service.getOne(id)
    res.json(finance)
})
router.get('/responsible/:id', authenticateToken, async (req,res) => {
    const {id} = req.params
    const query = req.query
    const finance = await service.getByResponsible({responsible:id, query})
    res.json(finance)
})
router.get('/invoice/:status', authenticateToken, async (req,res) => {
    const {status} = req.params
    const query = req.query
    const finance = await service.getByInvoiceStatus({status, query})
    res.json(finance)
})
router.patch('/:id', authenticateToken, authorizeRoles('908mbdf4-5c1e-49e9-9c5a-324c921a80e8','908mbdf4-5c1e-49e9-9c5a-324c921a90r3','908mbdf4-5c1e-49e9-9c5a-324c921a90r4'), async (req, res) => {
    const {responsible_id} = req.body
    const {id} = req.params
    const finance = await service.update(id, {responsible_id})
    res.json(finance)
})
<router.patch('/responsible/:id', authenticateToken, authorizeRoles('908mbdf4-5c1e-49e9-9c5a-324c921a80e8','908mbdf4-5c1e-49e9-9c5a-324c921a90r3','908mbdf4-5c1e-49e9-9c5a-324c921a90r4'), async (req, res) => {
    const body = req.body
    const {username} = req.user
    const {id} = req.params
    const finance = await service.setResponsible(id, {...body, created_by: username})
    res.json(finance)
})>
router.post('/', authenticateToken, async (req,res) => {
    const body = req.body
    const {username} = req.user
    const finance = await service.create({...body, responsible_id:username})
    res.json(finance)
})
router.post('/reporting', authenticateToken, async (req,res) => {
    const body = req.body
    const finance = await service.reporting({...body, responsible_id:null})
    res.json(finance)
})
// router.post('/invoice', authenticateToken, async (req,res) => {
//     const body = req.body
//     const finance = await service.addInvoice(body)
//     res.json(finance)
// })

export default router