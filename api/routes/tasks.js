import { Router } from 'express'

import Task from '../models/task'

const router = Router()

// req.user.id comes from the parsed JWT
router.get('/', async (req, res) => {
    const tasks = await Task.find({ user: req.user.id }).select('-__v')
    res.send({ tasks })
})

// create task
router.post('/', async (req, res) => {
    const { description, due_date } = req.body
    
    const newTask = new Task()
    newTask.description = description
    newTask.due_date = due_date
    newTask.user = req.user.id
    newTask.created_at = new Date()

    res.send({task: await newTask.save()})
})

// update task
router.put('/:id', async (req, res) => {
    const update = req.body
    update.updated_at = new Date()
    const updatedTask = await Task.findByIdAndUpdate(req.params.id, update, { new: true }).select('-__v')
    res.send({task: updatedTask})
})

export default router