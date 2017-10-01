import collection from './collection'
import moment from '../time/moment'
import range from '../time/range'
import {stringToElement} from '../util'
import color from '../math/color'

/**
 * Temperature collections
 * @type collectionInstance
 * @name temperature
 */
export default collection(
  'Epica'
  ,'Epica-tpt-co2.csv'
  ,function(data){

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

    const lines = data.split(/\n/g)
    const headers = lines[4].split(/,/g)
    const cols = lines.slice(5).map(line=>line.split(/,/g).map(parseFloat))

    const colTime = cols.map(col=>col[0])
    const colRest = headers.slice(1).map((s,i)=>cols.map(col=>col[i+1]))
    // only second data column
    headers.splice(2,1)
    colRest.splice(2,1)
    //
    const colors = [
      '#ee513f'
      ,'#8b478c'
      ,'#9b6325'
      ,'#366b24'
    ]

    const timeStart = -colTime[0]
    const timeEnd = -colTime[colTime.length-1]
    colTime.range = range(moment(timeStart),moment(timeEnd))

    const colTimeMinMax = getMinMax(colTime)
    const colRestMinMax = colRest.map(getMinMax)
    // console.log('colRestMinMax',colRestMinMax); // todo: remove log

    const mapTime = getMap(colTimeMinMax.min,colTimeMinMax.max)
    const mapRest = colRestMinMax.map(mm=>getMap(mm.min,mm.max))

    const ul = document.createElement('ul')
    ul.style.position = 'relative'
    ul.style.top = '15vh'
    ul.style.left = '10px'
    headers.slice(1).forEach((name,i)=>ul.appendChild(stringToElement(`<li style="color:${colors[i]};">${name}</li>`)))
    this.wrapper.appendChild(ul)

    this.resize = (_w,_h,range)=>{
      w = _w
      h = _h
      cnv.width = w
      cnv.height = h
      this.draw(range)
    }

    this.draw = currentRange=>{
      cnv.width = w
      if (currentRange.coincides(colTime.range)) {
        //
        const durationPart = colTime.range.duration/currentRange.duration
        const globalAlpha = Math.min(Math.max(durationPart*2-0.2,0),1)
        //
        if (globalAlpha>0) {
          //
          const agoStart = currentRange.start.ago
          const agoEnd = currentRange.end.ago
          //
          const lines = colRest.map(()=>[])
          colTime.forEach((t,timeIndex)=>{
            const ago = -t
            const agoRange = agoStart - agoEnd
            const inRange = ago<agoStart && ago>agoEnd
            if (inRange) {
              const time = (ago - agoEnd)/agoRange
              colRest.forEach((col,colIndex)=>{
                const val = col[timeIndex]
                lines[colIndex].push([w-w*time,h-0.25*h-0.5*h*mapRest[colIndex](val)])
              })
            }
          })
          lines.forEach((line,lineIndex)=>{
            ctx.globalAlpha = globalAlpha*0.3
            ctx.lineWidth = 3
            ctx.strokeStyle = color(colors[lineIndex]).multiply(0.4).toString()
            ctx.beginPath()
            line.forEach((xy,i)=>(i===0&&ctx.moveTo||ctx.lineTo).bind(ctx)(...xy))
            ctx.stroke()
            ctx.globalAlpha = globalAlpha*1
            ctx.lineWidth = 1
            ctx.strokeStyle = colors[lineIndex]
            ctx.beginPath()
            line.forEach((xy,i)=>(i===0&&ctx.moveTo||ctx.lineTo).bind(ctx)(...xy))
            ctx.stroke()
          })
        }
      }
    }

    function getMap(min,max) {
      const range = max - min
      return val=>(val-min)/range
    }

    function getMinMax(array){
      return array.reduce((minmax,val)=>{
        if (isNaN(val)) val
        else if (val<minmax.min) minmax.min = val
        else if  (val>minmax.max) minmax.max = val
        return minmax
      },{min:Number.POSITIVE_INFINITY,max:Number.NEGATIVE_INFINITY})
    }

    this.dataLoaded.dispatch(this)
  }
  ,function(range){
    this.draw(range)
  }
)
