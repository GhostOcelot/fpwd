const { readFile, writeFile, rm } = require('fs/promises')
const { faker } = require('@faker-js/faker')
const { makeQuestionRepository } = require('./question')

describe('question repository', () => {
  const TEST_QUESTIONS_FILE_PATH = 'test-questions.json'
  let questionRepo

  beforeAll(async () => {
    await writeFile(TEST_QUESTIONS_FILE_PATH, JSON.stringify([]))

    questionRepo = makeQuestionRepository(TEST_QUESTIONS_FILE_PATH)
  })

  afterAll(async () => {
    await rm(TEST_QUESTIONS_FILE_PATH)
  })

  test('should return a list of 0 questions', async () => {
    expect(await questionRepo.getQuestions()).toHaveLength(0)
  })

  test('should return a list of 2 questions', async () => {
    const testQuestions = [
      {
        id: '4b824218-b448-4c29-a986-6f5da18e2c40',
        summary: 'What is my name?',
        author: 'Jack London',
        answers: [
          {
            id: 'd592c577-1624-3ac3-26db-09f84ea74ce3',
            summary: 'My name is Neo',
            author: 'Thomas Anderson'
          },
          {
            id: 'c53e649c-989d-0265-1f4a-738f9e1c5803',
            summary: 'The Name of the Game',
            author: 'Crystal Method'
          }
        ]
      },
      {
        id: 'e7096c01-73c3-4e2e-8881-b668d453b2dd',
        summary: 'Who are you?',
        author: 'Tim Doods',
        answers: []
      }
    ]

    await writeFile(TEST_QUESTIONS_FILE_PATH, JSON.stringify(testQuestions))

    expect(await questionRepo.getQuestions()).toHaveLength(2)
  })

  test('should return a single question with expected structure', async () => {
    expect(
      await questionRepo.getQuestionById({
        questionId: '4b824218-b448-4c29-a986-6f5da18e2c40'
      })
    ).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        author: expect.any(String),
        summary: expect.any(String),
        answers: expect.any(Array)
      })
    )
  })

  test('should return one added question with expected data', async () => {
    expect(
      await questionRepo.addQuestion({
        author: 'Julius Ceasar',
        summary: 'De Bello Gallico'
      })
    ).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        author: 'Julius Ceasar',
        summary: 'De Bello Gallico',
        answers: []
      })
    )
  })

  test("should return a 2 elements list of answers for Jack London's question", async () => {
    expect(
      await questionRepo.getAnswers({
        questionId: '4b824218-b448-4c29-a986-6f5da18e2c40'
      })
    ).toHaveLength(2)
  })

  test("should return Neo's answer with expected data for Jack London's question", async () => {
    expect(
      await questionRepo.getAnswer({
        questionId: '4b824218-b448-4c29-a986-6f5da18e2c40',
        answerId: 'd592c577-1624-3ac3-26db-09f84ea74ce3'
      })
    ).toEqual({
      id: 'd592c577-1624-3ac3-26db-09f84ea74ce3',
      summary: 'My name is Neo',
      author: 'Thomas Anderson'
    })
  })

  test("should return a newly created answer with expected data for Tim Doods's question", async () => {
    expect(
      await questionRepo.addAnswer(
        { questionId: 'e7096c01-73c3-4e2e-8881-b668d453b2dd' },
        {
          author: 'Tyler Durden',
          summary: 'We are the all singing, all dancing crap of the world'
        }
      )
    ).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        author: 'Tyler Durden',
        summary: 'We are the all singing, all dancing crap of the world'
      })
    )
  })
})
