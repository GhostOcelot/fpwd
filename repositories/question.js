const { readFile, writeFile } = require('fs/promises')
const { v4: uuidv4 } = require('uuid')

const makeQuestionRepository = fileName => {
  const getQuestions = async () => {
    const fileContent = await readFile(fileName, { encoding: 'utf-8' })
    const questions = JSON.parse(fileContent)

    return questions
  }

  const getQuestionById = async ({ questionId }) => {
    const fileContent = await readFile(fileName, { encoding: 'utf-8' })
    const questions = JSON.parse(fileContent)
    const question = questions.find(q => q.id === questionId)

    return question
  }

  const addQuestion = async ({ author, summary }) => {
    const fileContent = await readFile(fileName, { encoding: 'utf-8' })
    let questions = JSON.parse(fileContent)

    const newQuestion = {
      id: uuidv4(),
      author: author,
      summary: summary,
      answers: []
    }

    questions = JSON.stringify([...questions, newQuestion])
    await writeFile(fileName, questions, { encoding: 'utf-8' })

    return newQuestion
  }

  const getAnswers = async ({ questionId }) => {
    const fileContent = await readFile(fileName, { encoding: 'utf-8' })
    const questions = JSON.parse(fileContent)
    const question = questions.find(q => q.id === questionId)
    const answers = question.answers

    return answers
  }

  const getAnswer = async ({ questionId, answerId }) => {
    const fileContent = await readFile(fileName, { encoding: 'utf-8' })
    const questions = JSON.parse(fileContent)
    const question = questions.find(q => q.id === questionId)
    const answers = question.answers
    const answer = answers.find(a => (a.id = answerId))

    return answer
  }

  const addAnswer = async ({ questionId }, { author, summary }) => {
    const fileContent = await readFile(fileName, { encoding: 'utf-8' })
    let questions = JSON.parse(fileContent)
    let question = questions.find(q => q.id === questionId)

    const newAnswer = {
      id: uuidv4(),
      author: author,
      summary: summary
    }

    question = { ...question, answers: [...question.answers, newAnswer] }
    questions = JSON.stringify([
      ...questions.filter(q => q.id !== questionId),
      question
    ])
    await writeFile(fileName, questions, { encoding: 'utf-8' })

    return newAnswer
  }

  return {
    getQuestions,
    getQuestionById,
    addQuestion,
    getAnswers,
    getAnswer,
    addAnswer
  }
}

module.exports = { makeQuestionRepository }
