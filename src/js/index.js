// import readyState from './signal/readyState'
// import time from './time'
// import moment from './time/moment'
// import range from './time/range'
// import animate from './animate'

// import {getData} from './spreadsheetProxy'
// import eventInfo from './time/eventInfo'
// import color from './math/color'

import model from './model'
import view from './view'
import './view/console'
import './view/search'

view(model)

// const c1 = color(33,234,22)
//   ,c2 = color(123,214,122)
// console.log(c1,c2,c1.clone().average(c2))
//
// const c5 = color(255,127,0)
//   ,c6 = color(0,127,255)
// console.log(c5,c6,c5.clone().average(c6),c5.brightness)
//
// console.log('color(15)',color(15)); // todo: remove log

// console.log(time.formatAnnum(time.UNIVERSE,2))
//
// readyState.add(console.log.bind(console))
// console.log('rs',document.readyState)
//
// console.log(moment(2838))
// console.log(moment(1974,moment.YEAR))
//
// console.log('eventInfo',eventInfo({name:'asdd'}))

// https://spreadsheets.google.com/feeds/list/1wn2bs7T2ZzajyhaQYmJvth3u2ikZv10ZUEpvIB9iXhM/2/public/values?alt=json-in-script&callback=rvjsonp2223
// https://spreadsheets.google.com/feeds/list/1wn2bs7T2ZzajyhaQYmJvth3u2ikZv10ZUEpvIB9iXhM/events/public/values?alt=json-in-script&callback=mtuwmjenzqzmtayoa2223
// const key = '1wn2bs7T2ZzajyhaQYmJvth3u2ikZv10ZUEpvIB9iXhM'
//   ,worksheet = 1//'events'
//   ,callback = d=> {
//     console.log('eventInfo',d.map(eventInfo)); // todo: remove log
//   }
// getData(key,worksheet,callback)
//
// getData(key,2,d=>{
//   console.log('d2',d); // todo: remove log
// })
//
// getData(key,3,d=>{
//   console.log('d3',d); // todo: remove log
// })
//
// getData(key,4,d=>{
//   console.log('d4',d); // todo: remove log
// })

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
