const Joi = require('joi')
const express = require('express')
const app = express()

app.use(express.json())


// app.get() -> get existing resource
// app.post() -> create new resource
// app.put() -> update existing resource
// app.delete() -> delete existing resource

const courses = [
    {id: 1, name: 'course1'},
    {id: 2, name: 'course2'},
    {id: 3, name: 'course3'},
]

app.get('/', (req, res) => {
    res.send('Hello World')
})

app.get('/api/courses', (req, res) => {
    res.send(courses)
})

app.post('/api/courses', (req, res) => {
    const schema = Joi.object({
        name: Joi.string().min(3).required()
    })
    
    const { error, value } = schema.validate(req.body)
    console.log(error)
    console.log(value)
    if(error) return res.status(400).send(error.details[0].message)

    const course = {
        id: courses.length + 1,
        name: value.name
    }
    
    courses.push(course)
    res.send(course)
})

app.put('/api/courses/:id', (req, res) => {
    // look up the course
    const course = courses.find(c => c.id === parseInt(req.params.id))
    // if doesn't exist, return 404
    if(!course) return res.status(404).send(`Ooops! The course with id ${req.params.id} was not found.`)
    // validate
    const {error} = validateCourse(req.body)
    const {value} = validateCourse(req.body)
    // if invalid return 400 - bad request
    if(error){
        //400 bad request
        res.status(400).send(error.details[0].message)
        return
    }
    // update course
    course.name = value.name
    // return the updated course to the client
    res.send(course)
})

function validateCourse(course){
    const schema = Joi.object({
        name: Joi.string().min(3).required()
    })
    
    return { error, value } = schema.validate(course)
}

app.delete('/api/courses/:id', (req, res) => {
    //look up the course
    const course = courses.find(c => c.id === parseInt(req.params.id))
    //doesn't exist, return 404
    if(!course) return res.status(404).send(`Ooops! The course with id ${req.params.id} was not found.`)
    //delete
    const index = courses.indexOf(course)
    courses.splice(index, 1)
    //return the same course
    res.send(course)
})

app.get('/api/courses/:id', (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id))
    if (!course) return res.status(404).send(`Ooops! The course with id ${req.params.id} was not found.`)

    res.send(course)
})

//PORT
const port = process.env.PORT || 3000
app.listen(port, () => console.log(`Listening on port ${port}...`))
