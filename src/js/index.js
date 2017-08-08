import readyState from './signal/readyState'
import {initialise} from './component'
import time from './time'
import moment from './time/moment'
import range from './time/range'
import animate from './animate'
import {getData} from './spreadsheetProxy'
import eventInfo from './time/eventInfo'
import model from './model'
import color from './math/color'
import './console'
import './search'

initialise()

const c1 = color(33,234,22)
  ,c2 = color(123,214,122)
console.log(c1,c2,c1.clone().average(c2))

console.log(time.formatAnnum(time.UNIVERSE,2))

readyState.add(console.log.bind(console))
console.log('rs',document.readyState)

console.log(moment(2838))
console.log(moment(1974,moment.YEAR))

console.log('eventInfo',eventInfo({name:'asdd'}))

const key = '1wn2bs7T2ZzajyhaQYmJvth3u2ikZv10ZUEpvIB9iXhM'
  ,worksheet = 1//'events'
  ,callback = d=>console.log('d',eventInfo(d))
getData(key,worksheet,callback)

console.log(model.range)

// INIT
//view(model)
//location(model)


/*
const life = range(
  moment(1974,moment.YEAR)
  ,moment(2017,moment.YEAR)
)
life.change.add(console.log.bind(console))
console.log(life.duration)

console.log(life.factory===range,life)

life.moveStart(100)
console.log(life.duration)
*/
