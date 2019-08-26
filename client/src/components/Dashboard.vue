<template>
  <app>
    <div class="row mt-3 dash-header">
        <div class="col-12 col-md-6">
            <h1>Dashboard!</h1>
            <div>Welcome back, {{ user.username }}!</div>
        </div>
        <div class="col-12 col-md-6">
            <button class="logout-btn btn btn-danger float-right" @click="logout">Logout</button>
        </div>
    </div>
    
    <div class="row">
        <div class="col-12 col-md-6 card new-task-form">
            <h2 class="mt-2">New Task</h2>
            <form @submit.prevent="createTask">
                <div class="form-group">
                    <label for="description">Description</label>
                    <textarea 
                        class="form-control"
                        placeholder="What do you have to do?"
                        id="description"
                        rows="3"
                        v-model="newTask.description"></textarea>
                </div>
                <div class="form-group">
                    <label for="due_date">Due Date</label>
                    <input class="form-control" type="date" v-model="newTask.due_date">
                </div>
            </form>
            <button type="submit" @click="createTask" class="btn btn-primary btn-block">Create Task</button>
        </div>
        <div class="col-12 col-md-5 offset-md-1 card float-right">
            <div class="row mt-2">
                <div class="col-12 col-md-6">
                    <h2>Tasks ({{ showCompletedTasks ? tasks.completed.length : tasks.todo.length }})</h2>
                </div>
                <div class="col-12 col-md-6">
                    <button class="btn btn-info float-right" @click="showCompletedTasks = !showCompletedTasks">
                        {{ showCompletedTasks ? 'See Incomplete Tasks' : 'See Completed Tasks' }}
                    </button>
                </div>
            </div>
            <div v-if="showCompletedTasks">
                <div class="alert alert-primary">These are your completed tasks</div>
                <div class="task-item card" v-for="task in tasks.completed" :key="task._id">
                    {{ task.description }}
                    <br/>
                    <small class="due-date">Due on: {{ new Date(task.due_date).toDateString() }}</small>
                </div>
            </div>
            <div v-else>
                <div class="alert alert-primary">Click an item to remove it from the task list</div>
                <div 
                    class="task-item card"
                        v-for="task in tasks.todo"
                        :key="task._id"
                        @click="completeTask(task, index)">
                    {{ task.description }}
                    <br/>
                    <small class="due-date">Due on: {{ new Date(task.due_date).toDateString() }}</small>
                </div>
            </div>
        </div>
    </div>
  </app>
</template>

<script>
import App from '../App.vue'

export default {
    data() {
        return {
            user: {},
            tasks: {
                todo: [],
                completed: []
            },
            showCompletedTasks: false,
            newTask: {
                description: '',
                due_date: ''
            }
        }
    },
    components: {
        App
    },
    methods: {
        logout() {
            const confirmed = confirm('Are you sure you want to logout?')
            if (confirmed) {
                localStorage.clear()
                window.location = '/login'
            }
        },
        async getTasks() {
            const response = await fetch('http://localhost:4000/tasks', {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            })
            const body = await response.json()
            body.tasks.forEach(task => {
                if (task.is_complete) {
                    this.tasks.completed.push(task)
                } else {
                    this.tasks.todo.push(task)
                }
            })
        },
        async createTask() {
            if (!this.newTask.description || !this.newTask.due_date) {
                return
            }

            const due_date = new Date(this.newTask.due_date)
            due_date.setHours(24, 0, 0, 0)

            const response = await fetch('http://localhost:4000/tasks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    description: this.newTask.description,
                    due_date: due_date
                })
            })
            
            const body = await response.json()
            this.tasks.todo.push(body.task)

            this.newTask.description = ''
            this.newTask.due_date = ''
        },
        async completeTask(task, index) {
            const response = await fetch(`http://localhost:4000/tasks/${task._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    is_complete: true
                })
            })
            
            const body = await response.json()

            if (!body.error) {
                this.tasks.completed.push(body.task)
                this.tasks.todo.splice(index, 1)
            }
        },
    },
    beforeCreate() {
        if (!localStorage.getItem('token')) {
            window.location = '/login'
        }
    },
    created() {
        this.user = JSON.parse(localStorage.getItem('user'))
        this.getTasks()
    }
}
</script>

<style scoped>
    .dash-header {
        adding-bottom: 15px;
        border-bottom: 1px solid #ccc;
        margin-bottom: 20px;
    }
    .task-item {
        margin: 10px 0px;
        padding: 10px;
    }
    .task-item:hover {
        cursor: pointer;
        background-color: #f0f0f0;
    }
    .alert {
        padding: 5px;
        margin: 0px;
    }
    .new-task-form {
        height: 340px;
    }
</style>
