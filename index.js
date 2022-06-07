const express = require('express')
const { urlencoded, json } = require('body-parser')
const makeRepositories = require('./middleware/repositories')

const STORAGE_FILE_PATH = 'questions.json'
const PORT = 3000

const app = express()

app.use(urlencoded({ extended: true }))
app.use(json())
app.use(makeRepositories(STORAGE_FILE_PATH))

app.get('/', (_, res) => {
  res.send({ message: 'Welcome to responder!' })
})

app.get('/questions', async (req, res) => {
  const questions = await req.repositories.questionRepo.getQuestions()
  res.send(questions)
})

app.get('/questions/:questionId', async (req, res) => {
  const question = await req.repositories.questionRepo.getQuestionById(
    req.params
  )
  res.send(question)
})

app.post('/questions', async (req, res) => {
  const questions = await req.repositories.questionRepo.addQuestion(req.body)
  res.send(questions)
})

app.get('/questions/:questionId/answers', async (req, res) => {
  const answers = await req.repositories.questionRepo.getAnswers(req.params)
  res.send(answers)
})

app.get('/questions/:questionId/answers/:answerId', async (req, res) => {
  const answer = await req.repositories.questionRepo.getAnswer(req.params)
  res.send(answer)
})

app.post('/questions/:questionId/answers', async (req, res) => {
  const questions = await req.repositories.questionRepo.addAnswer(
    req.params,
    req.body
  )
  res.send(questions)
})

app.listen(PORT, () => {
  console.log(`Responder app listening on port ${PORT}`)
})
