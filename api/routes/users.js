import { Router } from 'express'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

import User from '../models/user'

const router = Router()

router.post('/login', async (req, res) => {
    const { username, password } = req.body
    const user = await User.findOne({ username: username }).select('-__v')
    
    const error = !user || !(await bcrypt.compare(password, user.password))
    
    if (error) {
        return res.status(500).send({error: 'Invalid username or password'})
    }

    delete user.password

    const signedJwt = jwt.sign({ id: user._id }, 'jwt_secret', { expiresIn: '1 year' })
    res.send({ jwt: signedJwt, user })
})

export default router