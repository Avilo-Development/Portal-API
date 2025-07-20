import express from 'express'
import cors from 'cors'

import user from './routes/user.js'
import project from './routes/project.js'
import customer from './routes/customer.js'
import contact from './routes/contact.js'
import finance from './routes/finance.js'
import comment from './routes/comment.js'
import address from './routes/address.js'

import connection from './db/index.js'
import config from './config/index.js'
import session from 'express-session'
import passport from 'passport'
import local_strategy from './auth/strategies/passport.local.js'

import { createProxyMiddleware } from 'http-proxy-middleware'

const app = express()

try {
  const corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200 // some legacy browsers choke on 204
  };

  app.use(cors(corsOptions))

  const port = config.port
  app.use(express.json())

  app.use(session({
    secret: config.token_secret,
    resave: false,
    saveUninitialized: false
  }))
  app.use(passport.initialize())
  app.use(passport.session())

  local_strategy()

  await connection()

  app.get('/', (req, res) => {
    res.send('AVILO API providing excelence and quality services')
  })

  app.use('/user', user)
  app.use('/project', project)
  app.use('/customer', customer)
  app.use('/contact', contact)
  app.use('/finance', finance)
  app.use('/comment', comment)
  app.use('/address', address)

  app.use('/housecalpro', createProxyMiddleware({
    target: 'https://api.housecallpro.com',
    changeOrigin: true,
    pathRewrite: {
      '^/housecalpro': '',
    },
    headers: {
      'Authorization': `Bearer ${config.hcp_token}`
    }
  }));

  app.listen(port, () => {
    console.log(`Running at port ${port}`)
  })
}catch(err){
  console.error(err)
}