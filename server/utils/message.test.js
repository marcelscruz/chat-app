const expect = require('expect')

const { generateMessage, generateLocationMessage } = require('./message')

describe('generateMessage', () => {
  it('should generate correct message object', () => {
    const from = 'Jen'
    const text = 'Some message'
    const message = generateMessage(from, text)

    expect(typeof message.createdAt).toBe('number')
    expect(message).toMatchObject({ from, text })
  })
})

describe('generateLocationMessage', () => {
  it('should generate correct location object', () => {
    const from = 'Rachael'
    const latitude = 15
    const longitude = 19
    const url = 'https://www.google.com/maps?q=15,19'
    const message = generateLocationMessage(from, latitude, longitude)

    expect(typeof message.createdAt).toBe('number')
    expect(message).toMatchObject({ from, url })
  })
})
