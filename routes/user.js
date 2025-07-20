import { Router } from "express";
import UserService from "../services/user.service.js";
import { generateAccessToken } from "../auth/index.js";
import { authenticateToken } from "../middlewares/authentication.js";
import passport from "passport";

const router = Router()

const service = new UserService()

router.get('/', authenticateToken, async (req, res) => {
    const users = await service.getAll();
    res.json(users)
})
router.get('/account', authenticateToken, async (req, res) => {
    const id = req.user.username
    const account = await service.get({id: id})
    res.json(account)
})
router.post('/', async (req,res) => {
    const {body} = req
    const user = (await service.create(body)).toJSON();
    const token = generateAccessToken({username: user.id})
    delete user.password
    res.json({user, token:token})
})
router.post('/login',
    passport.authenticate('local'),
    (req,res, next) => {
        if (!req.user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        req.logIn(req.user, (err)=> {
            if(err){return next(err)}
            return res.json(req.user)
        })
    }
)
router.patch('/:id', async (req,res) => {
    const {body} = req
    const {id} = req.params
    const user = await service.update(id, body);
    res.json(user)
})
router.delete('/:id', async (req, res) => {
    const {id} = req.params
    const user = await service.delete(id)
    res.json(user)
})

export default router