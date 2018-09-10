const moment = require('moment')

// const date = new Date()
// console.log(date.getMonth())

const date = moment()
date.add(1, 'year').subtract(9, 'months')
console.log(date.format('DD.MM.YY'))

console.log(date.format('h:mm a'))
