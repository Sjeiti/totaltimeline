import {getPercentage} from '../util'
import {UNIVERSE, NOW} from '../time'
import {color} from '../math/color'
import {cssPrefix, currentRange} from '../model'

/**
 * @name view
 */
const light1 = 150E6
const light2 = 1E9
const light0 = light1 + (light2-light1)/2
const lightA = 0.25*(light2-light1)

const backgroundColors = [
  {time:UNIVERSE,					          color:'#171B30'}//171B30
  ,{time:UNIVERSE-light0+lightA,	  color:'#585873'}//585873
  ,{time:UNIVERSE-light0-lightA,	  color:'#799193'}//CCE7E7
  ,{time:Math.floor(0.8*UNIVERSE),	color:'#2E4346'}
  ,{time:Math.floor(0.4*UNIVERSE),	color:'#657851'}
  ,{time:NOW,					              color:'#D8945A'}
  ,{time:NOW-1,				              color:'#F7C367'}
  ,{time:-1E9,							        color:'#8A5246'}
  ,{time:-9E9,							        color:'#460505'}
]

const viewProto = {
  toString(){return '[object View]'}
}
const writable = true
export const view = Object.create(viewProto,{
  rangeGradient: {writable},
  colorFirst: {writable},
  colorLast: {writable}
})

currentRange.change.add(handleRangeChange,-1)
handleRangeChange(currentRange)

// todo: document
function handleRangeChange(range){
  const gradients = getGradient(range)
  const hasGradients = gradients.length!==0
  view.rangeGradient = cssPrefix+'linear-gradient(left,'+gradients.map(a=>a.join(' ')).join(',')+')'
  view.colorFirst = hasGradients?gradients[0][0]:0
  view.colorLast = hasGradients?gradients[gradients.length-1][0]:0
}

// todo: document
function getGradient(range){
  const agoFrom = range.start.ago
  const agoTo = range.end.ago
  const deltaRange = range.duration
  const gradients = []
  //
  let lastColor = color()
  let isZeroSet = false

  for (let i=0,l=backgroundColors.length;i<l;i++) {
    const color = backgroundColors[i]
    const time = color.time
    const isTimeLow = time>agoFrom
    const isTimeHigh = time<agoTo
    const isTimeMiddle = !isTimeLow&&!isTimeHigh
    const pos = 1-(time-agoTo)/deltaRange

    // calculate average color when one or both colors are outside the range
    if (
      (!isZeroSet&&isTimeMiddle&&i!==0&&time!==agoFrom)
      ||isTimeHigh
    ) {
      if (!isZeroSet&&isTimeHigh) {
        gradients.push(getAverageColor(lastColor,color,pos,true))
      }
      gradients.push(getAverageColor(lastColor,color,pos,!isTimeHigh))
      if (isTimeHigh) break
      isZeroSet = true
    }
    // set the gradient position for values inside the range
    if (isTimeMiddle) {
      gradients.push([color.color,getPercentage(pos)])
    }
    lastColor = color
    lastColor.pos = pos
  }
  return gradients
}

function getAverageColor(last,current,pos,low){
  const posStart = last.pos
  const part = (pos-(low?0:1))/(pos-posStart)
  const colorAvarage = color(current.color).average(color(last.color),part)

  return [colorAvarage.toString(),(low?'0%':'100%')]
}