import { Router } from 'express'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

import User from '../models/user'
import Task from '../models/task'

const router = Router()

router.post('/login', async (req, res) => {
    const { username, password } = req.body
    const user = await User.findOne({ username: username }).select('-__v')

    if (!user) {
        return res.status(404).send({error: 'User not found'})
    }

    if (!(await bcrypt.compare(password, user.password))) {
        return res.status(401).send({error: 'Invalid password'})
    }

    // we don't need these on the front
    delete user.password

    const signedJwt = jwt.sign({ id: user._id }, 'jwt_secret', { expiresIn: '1 year' })
    res.send({ jwt: signedJwt, user })
})

export default router