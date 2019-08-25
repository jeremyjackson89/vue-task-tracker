import createError from 'http-errors'
import express from 'express'
import jwt from 'express-jwt'
import cors from 'cors'

import { establishConnection } from './helpers/database'

import users from './routes/users'
import tasks from './routes/tasks'

const app = express()

establishConnection()

app.use(cors())
app.use(express.json({ limit: '1mb' }))

// Only check
app.use(jwt({ secret: 'jwt_secret' }).unless({
    path: [{ url: '/users/login', methods: ['POST'] }]
}))

app.use('/users', users)
app.use('/tasks', tasks)

// error handling
app.use(function(req, res, next) {
    next(createError(404));
});

const PORT = process.env.PORT || 4000
app.listen(PORT, () => console.log(`App is running at http://localhost:${PORT}`))