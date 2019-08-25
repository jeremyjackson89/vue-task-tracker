import mongoose from 'mongoose'
const Schema = mongoose.Schema
const ObjectId = mongoose.ObjectId

const taskSchema = new Schema ({
    description: { type: String, required: true },
    is_complete: { type: Boolean, default: false },
    due_date: { type: Date, required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    created_at: { type: Date, required: true },
    updated_at: { type: Date }
})

const Task = mongoose.model('Task', taskSchema)

export default Task