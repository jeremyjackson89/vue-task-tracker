import mongoose from 'mongoose'
import bcrypt from 'bcrypt'

import User from '../models/user'
import Task from '../models/task'

export const establishConnection = () => {
    // prevents deprecation warnings
    mongoose.set('useCreateIndex', true)
    mongoose.set('useFindAndModify', false)

    const mongoDB = 'mongodb://127.0.0.1/hcs_challenge'
    mongoose.connect(mongoDB, { useNewUrlParser: true })
    const db = mongoose.connection
    db.on('error', console.error.bind(console, 'connection error:'))
    db.once('open', function() {
        console.log(`Connected to db`)
        initializeDataIfEmpty()
    })
}

const initializeDataIfEmpty = async () => {
    const users = await User.find({})

    if (users.length < 1) {
        const password = await bcrypt.hash('test', 7)
        
        const newUser = new User()
        newUser.username = 'test'
        newUser.password = password
        
        const user = await newUser.save()

        const today = new Date()
        const tomorrow = new Date()
        tomorrow.setDate(today.getDate() + 1)

        const tasks = [{
            description: 'Pay for internet',
            due_date: tomorrow,
            user: user._id,
            created_at: new Date()
        }, {
            description: 'Get an oil change',
            due_date: tomorrow,
            user: user._id,
            created_at: new Date()
        }, {
            description: 'Talk to Alex about a potential client',
            due_date: new Date(),
            user: user._id,
            created_at: new Date()
        }]

        tasks.forEach(task => {
            const newTask = new Task()
            Object.keys(task).forEach(key => {
                newTask[key] = task[key]
            })
            newTask.save()
        })

        console.log(`Created test user and tasks`)
    }
}