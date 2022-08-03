const fs = require('fs')
const mnist = require('mnist')

const set = mnist.set(4000, 1000)
const trainingSet = set.training
const testSet = set.test

// one way to do filtering
const theSevens = trainingSet.filter(
  (x) => x.output.join(',') === '0,0,0,0,0,0,0,1,0,0'
)

// create a training file source
const trainingContent = trainingSet.map((x) => JSON.stringify(x)).join('\n')
fs.writeFileSync('data/training_source.json', trainingContent)

// create a test file source
const testContent = testSet.map((x) => JSON.stringify(x)).join('\n')
fs.writeFileSync('data/test_source.json', testContent)

// read content back and use it
const receivedContent = () =>
  fs.readFileSync('data/data.json', { encoding: 'ascii' })
const jsonify = (content) => content.split('\n').map((x) => JSON.parse(x))

console.log('receivedContent', jsonify(receivedContent()))
