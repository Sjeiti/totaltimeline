import {getPercentage} from '../util'
import time from '../time'
import color from '../math/color'
import model from '../model'

/**
 * @name view
 */
const iLight1 = 150E6
  ,iLight2 = 1E9
  ,iLight0 = iLight1 + (iLight2-iLight1)/2
  ,iLightA = 0.25*(iLight2-iLight1)

  ,aBackgroundColors = [
     {time:time.UNIVERSE,					        color:'#171B30'}//171B30
    ,{time:time.UNIVERSE-iLight0+iLightA,	color:'#585873'}//585873
    ,{time:time.UNIVERSE-iLight0-iLightA,	color:'#799193'}//CCE7E7
    ,{time:Math.floor(0.8*time.UNIVERSE),	color:'#2E4346'}
    ,{time:Math.floor(0.4*time.UNIVERSE),	color:'#657851'}
    ,{time:time.NOW,					            color:'#D8945A'}
    ,{time:time.NOW-1,				            color:'#F7C367'}
    ,{time:-1E9,							            color:'#8A5246'}
    ,{time:-9E9,							            color:'#460505'}
  ]

  ,viewProto = {
    toString(){return '[object View]'}
  }
  ,writable = true
  ,view = Object.create(viewProto,{
    rangeGradient: {writable},
    colorFirst: {writable},
    colorLast: {writable}
  })

model.range.change.add(handleRangeChange,-1)
handleRangeChange(model.range)

// todo: document
function handleRangeChange(range){
  const gradients = getGradient(range)
  const hasGradients = gradients.length!==0
  view.rangeGradient = model.cssPrefix+'linear-gradient(left,'+gradients.map(a=>a.join(' ')).join(',')+')'
  view.colorFirst = hasGradients?gradients[0][0]:0
  view.colorLast = hasGradients?gradients[gradients.length-1][0]:0
  //console.log(view.rangeGradient)
  //console.log(view.colorFirst,view.colorLast)
}

// todo: document
function getGradient(range){
  const iAgoFrom = range.start.ago
    ,iAgoTo = range.end.ago
    ,iDeltaRange = range.duration
    ,aGradient = []
    //
  let oLastColor = color()
    ,bZeroSet = false

  for (let i=0,l=aBackgroundColors.length;i<l;i++) {
    const oColor = aBackgroundColors[i]
      ,iTime = oColor.time
      ,bTimeLow = iTime>iAgoFrom
      ,bTimeHigh = iTime<iAgoTo
      ,bTimeMiddle = !bTimeLow&&!bTimeHigh
      ,fPos = 1-(iTime-iAgoTo)/iDeltaRange

    // calculate average color when one or both colors are outside the range
    if (
      (!bZeroSet&&bTimeMiddle&&i!==0&&iTime!==iAgoFrom)
      ||bTimeHigh
    ) {
      if (!bZeroSet&&bTimeHigh) {
        aGradient.push(getAverageColor(oLastColor,oColor,fPos,true))
      }
      aGradient.push(getAverageColor(oLastColor,oColor,fPos,!bTimeHigh))
      if (bTimeHigh) break
      bZeroSet = true
    }
    // set the gradient position for values inside the range
    if (bTimeMiddle) {
      aGradient.push([oColor.color,getPercentage(fPos)])
    }
    oLastColor = oColor
    oLastColor.pos = fPos
  }
  return aGradient
}

function getAverageColor(last,current,pos,low){
  const fPosStart = last.pos
    ,fPart = (pos-(low?0:1))/(pos-fPosStart)
    ,oColorAvrg = color(current.color).average(color(last.color),fPart)

  return [oColorAvrg.toString(),(low?'0%':'100%')]
}

export default view
