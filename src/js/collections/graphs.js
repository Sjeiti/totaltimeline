import collection from './collection'
import moment from '../time/moment'
import model from '../model'
import range from '../time/range'
import {stringToElement} from '../util'
import {fetchFile} from '../fetchProxy'
import color from '../math/color'
import view from '../view'

/**
 * Temperature collections
 * @type collectionInstance
 * @name temperature
 */
export const graphs = collection(
  'graphs'
  ,null
  ,function(){

    const cnv = stringToElement('<canvas class="graph-canvas"></canvas>')
    const ctx = cnv.getContext('2d')
    let w = 1, h = cnv.width = cnv.height = 1
    this.wrapper.appendChild(cnv)

    const legend = stringToElement('<div class="graph-legend"></div>')
    this.wrapper.appendChild(legend)

    const axis = stringToElement('<div class="graph-axis"></div>')
    this.wrapper.appendChild(axis)

    const axisOffset = 5;
    this.wrapper.appendChild(stringToElement(`<style>
.graph-canvas {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
}
.graph-legend {
  position: relative;
  left: 10px;
  top: 15vh;
}
.graph-axis {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  font-size: 10px;
  line-height: 100%;
  font-weight: bold;
}
.graph-axis div {
  position: absolute;
  top: 0;
  padding: 1px 2px;
  transform: translateY(-${axisOffset}px);
  background-color: rgba(255,255,255,0.5);
}
.graph-axis div.graph-axe-left {
  left: 10px;
  border-radius: 0 2px 2px 0;
}
.graph-axis div.graph-axe-right {
  right: 10px;
  border-radius: 2px 0 0 2px;
}
.graph-axis div:before {
  content: '';
  position: absolute;
  top: ${axisOffset - 5}px;
  border-style: solid;
  border-width: 6px 10px 6px 10px;
  border-color: inherit;
}
.graph-axis div.graph-axe-left:before {
  left: -20px;
}
.graph-axis div.graph-axe-right:before {
  right: -20px;
}
</style>`))

    Object.assign(this,{
      add
      ,resize
      ,draw
    })

    const currentRange = model.range
    const boundRangeChange = onRangeChange.bind(this)
    currentRange.change.add(onRangeChange.bind(this))

    function add(name,times,values,map,color){
      const timeStart = -times[0]
      const timeEnd = -times[times.length-1]
      const timesRange = range(moment(timeStart),moment(timeEnd))
      const info = {name, explanation:'', wikimedia:''}
      const element = stringToElement(`<li style="color:${color};">${name}</li>`)
      const axeLeft = stringToElement(`<div class="graph-axe-left" style="border-color: transparent ${color} transparent transparent;color:${color};">0</div>`)
      const axeRight = stringToElement(`<div class="graph-axe-right" style="border-color: transparent transparent transparent ${color};color:${color};">0</div>`)
      this.push({name,times,timesRange,values,map,color,info,element,axeLeft,axeRight}) // todo: Object.create
      legend.appendChild(element)
      axis.appendChild(axeLeft)
      axis.appendChild(axeRight)
      boundRangeChange()
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
          ,isGraphInRange = currentRange.coincides(timesRange)
        //
        const durationPart = timesRange.duration/currentRange.duration
        const globalAlpha = Math.min(Math.max(durationPart*2-0.2,0),1)
        const hideElements = !isGraphInRange||globalAlpha===0
        //
        const {element,axeLeft,axeRight} = graphInst;
        [element,axeLeft,axeRight].forEach(elm=>elm.classList.toggle('hide',hideElements))
        //
        if (!hideElements) {
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
                  line.push([w-w*time,h-0.25*h-0.5*h*map(val),val])
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
            //
            const interpolateAxis = (elm,vertex1,vertex2,offset=0)=>{
              const isEnd = !!offset
              const x1 = vertex1[0] - offset
              const x2 = vertex2[0] - offset
              const isXlt = x1<0&&x2>0
              const isXgt = x1>0&&x2>0
              const isOverEnd = isEnd&&!isXlt
              const isUnderStart = !isEnd&&isXgt
              //
              const dist = x2-x1
              const dist1 = Math.abs(x1)
              const distDelta = dist1/dist
              const y1 = vertex1[1]
              const y2 = vertex2[1]
              const y0 = isOverEnd ? y2 : isUnderStart ? y1 : y1 + distDelta*(y2-y1)
              const val1 = vertex1[2]
              const val2 = vertex2[2]
              const val0 = isOverEnd ? val2 : isUnderStart ? val1 : val1 + distDelta*(val2-val1)

              elm.textContent = val0.toFixed(2)
              elm.style.top = 100*(y0/h)+'%'
              // elm.style.backgroundColor = isEnd?view.colorLast:view.colorFirst
            }
            const lineLength = line.length
            if (lineLength>1) {
              interpolateAxis(graphInst.axeLeft,line[0],line[1]);
              interpolateAxis(graphInst.axeRight,line[lineLength-2],line[lineLength-1],w);
            }
            //
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

    /**
     * When the range changes the labels of the colors should to
     */
    function onRangeChange(){ // todo: possibly refactor since also called by collections -> col.dataLoaded
      // console.log('onRangeChange',this); // todo: remove log
      this.forEach(({axeLeft,axeRight})=>{
        axeLeft.style.backgroundColor = view.colorFirst
        axeRight.style.backgroundColor = view.colorLast
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