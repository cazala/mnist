const mnist = require('mnist')

const set = mnist.set(40, 10)

const trainingSet = set.training
const testSet = set.test

console.log('# of entries: ', trainingSet.length)
//console.log('trainingSet', trainingSet)

// get all the 7s
const theSevens = trainingSet.filter(x => x.output.join(',') === '0,0,0,0,0,0,0,1,0,0')

console.log('How many sevens?')
console.log(theSevens.length)


