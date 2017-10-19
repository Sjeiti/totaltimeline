import collection from './collection'
import moment from '../time/moment'
import range from '../time/range'
import {stringToElement} from '../util'
import {fetchFile} from '../fetchProxy'
import color from '../math/color'

/**
 * Temperature collections
 * @type collectionInstance
 * @name temperature
 */
export const graphs = collection(
  'graphs'
  ,null
  ,function(){

    const cnv = document.createElement('canvas')
    const ctx = cnv.getContext('2d')
    let w = 1, h = cnv.width = cnv.height = 1
    Object.assign(cnv.style,{
      width: '100%'
      ,height: '100%'
      ,position: 'absolute'
      ,left: 0
      ,top: 0
    })
    this.wrapper.appendChild(cnv)

    const ul = document.createElement('ul')
    ul.style.position = 'relative'
    ul.style.top = '15vh'
    ul.style.left = '10px'
    this.wrapper.appendChild(ul)

    Object.assign(this,{
      add
      ,resize
      ,draw
    })

    function add(name,times,values,map,color){
      const timeStart = -times[0]
      const timeEnd = -times[times.length-1]
      const timesRange = range(moment(timeStart),moment(timeEnd))
      const info = {name, explanation:'', wikimedia:''}
      this.push({name,times,timesRange,values,map,color,info}) // todo: Object.create
      ul.appendChild(stringToElement(`<li style="color:${color};">${name}</li>`))
    }

    function resize(_w,_h,range){
      w = _w
      h = _h
      cnv.width = w
      cnv.height = h
      this.draw(range)
    }

    function draw(currentRange){
      cnv.width = w
      this.forEach(graphInst=>{
        const {times,timesRange,values,map} = graphInst
          ,clr = graphInst.color
        if (currentRange.coincides(timesRange)) {
          //
          const durationPart = timesRange.duration/currentRange.duration
          const globalAlpha = Math.min(Math.max(durationPart*2-0.2,0),1)
          //
          if (globalAlpha>0) {
            //
            const agoStart = currentRange.start.ago
            const agoEnd = currentRange.end.ago
            const agoRange = agoStart - agoEnd
            //
            const setVertex = index => {
                  const ago = -times[index]
                  const time = (ago - agoEnd)/agoRange
                  const val = values[index]
                  line.push([w-w*time,h-0.25*h-0.5*h*map(val)])
            }
            //
            const line = []
            const timeLengthMinusOne = times.length//-1
            let inRangeLast = false
            let isAfterEndLast = true
            let isBeforeStartLast = false
            times.forEach((t,indexTimes)=>{ // runs from end to start
              const ago = -t
              //
              const inRange = ago<agoStart && ago>agoEnd
              const inRangeChanged = inRange!==inRangeLast&&(indexTimes>0&&indexTimes<timeLengthMinusOne)
              //
              const isAfterEnd = ago<agoEnd
              const isAfterEndChanged = isAfterEnd!==isAfterEndLast
              //
              const isBeforeStart = ago>agoStart
              const isBeforeStartChanged = isBeforeStart!==isBeforeStartLast
              //
              if (inRange) {
                // first vertex
                inRangeChanged&&setVertex(indexTimes-1)
                // current vertex
                setVertex(indexTimes)
              } else if (inRangeChanged) {
                 // last vertex
                 setVertex(indexTimes)
              } else if (isAfterEndChanged&&isBeforeStartChanged&&!isBeforeStart) {
                // vertices both outside range
                setVertex(indexTimes-1)
                setVertex(indexTimes)
              }
              inRangeLast = inRange
              isAfterEndLast = isAfterEnd
              isBeforeStartLast = isBeforeStart
            })
            // ctx.globalAlpha = globalAlpha*0.3
            // ctx.lineWidth = 3
            // ctx.strokeStyle = color(clr).multiply(0.4).toString()
            // ctx.beginPath()
            // line.forEach((xy,i)=>(i===0&&ctx.moveTo||ctx.lineTo).bind(ctx)(...xy))
            // ctx.stroke()
            ctx.globalAlpha = globalAlpha*1
            ctx.lineWidth = 2
            ctx.strokeStyle = clr
            ctx.beginPath()
            line.forEach((xy,i)=>(i===0&&ctx.moveTo||ctx.lineTo).bind(ctx)(...xy))
            ctx.stroke()
            //
            // ctx.globalAlpha = globalAlpha*0.3
            // ctx.lineWidth = 4
            // ctx.strokeStyle = clr
            // ctx.beginPath()
            // line.forEach((xy,i)=>(i===0&&ctx.moveTo||ctx.lineTo).bind(ctx)(...xy))
            // ctx.stroke()
            // ctx.globalAlpha = globalAlpha*1
            // ctx.lineWidth = 2
            // ctx.strokeStyle = color(clr).multiply(4.4).toString()
            // ctx.beginPath()
            // line.forEach((xy,i)=>(i===0&&ctx.moveTo||ctx.lineTo).bind(ctx)(...xy))
            // ctx.stroke()
          }
        }
      })
    }

    this.dataLoaded.dispatch(this)
  }
  ,function(range){
    this.draw(range)
  }
)

//////////////////////////////////////////////////////////////////////////

export function graphCollection(dataFileName,callback){
  fetchFile(dataFileName).then(callback)
}

export default {
  graphs
  ,graphCollection
}