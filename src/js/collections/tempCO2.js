import collection from './collection'
// import event from './event'
// import moment from '../time/moment'
// import eventInfo from '../time/eventInfo'
// import {getPercentage} from '../util'

console.log('tempCO2.js'); // todo: remove log

/**
 * Temperature collections
 * @type collectionInstance
 * @name temperature
 */
export default collection(
  'temperature'
  ,'Epica-tpt-co2.csv'
  ,function(data){
    ///////////////////////////////
    const lines = data.split(/\n/g)
    //const headers = lines[4].split(/,/g)
    //const rows = lines.slice(5).map(line=>line.split(/,/g).map(parseFloat))
    //console.log('rows',rows); // todo: remove log
    //this.foo = 234
    ///////////////////////////////
    ///////////////////////////////
    ///////////////////////////////
    ///////////////////////////////
    const w = 512
    const h = 256
    const cnv = document.createElement('canvas')
    cnv.width = w
    cnv.height = h
    const ctx = cnv.getContext('2d')
    // this.canvas = cnv
      this.wrapper.appendChild(cnv)
    // document.body.appendChild(cnv)

    // const data = getData()
    // const lines = data.split(/\n/g)
    //const headers = lines[0].split(/,/g)
    //const cols = lines.slice(1).map(line=>line.split(/,/g).map(parseFloat))
    const headers = lines[4].split(/,/g)
    const cols = lines.slice(5).map(line=>line.split(/,/g).map(parseFloat))

    const colTime = cols.map(col=>col[0])
    const colTemp = cols.map(col=>col[1])
    const colRest = cols.map(col=>col[1])

    const colTimeMinMax = getMinMax(colTime)
    const colTempMinMax = getMinMax(colTemp)

    const mapTime = getMap(colTimeMinMax.min,colTimeMinMax.max)
    const mapTemp = getMap(colTempMinMax.min,colTempMinMax.max)

    cols.forEach((col,i)=>{
      const time = colTime[i]
      const temp = colTemp[i]
      const fnc = (i===0&&ctx.moveTo||ctx.lineTo).bind(ctx)
      fnc(w*mapTime(time),h-h*mapTemp(temp))
    })
    ctx.stroke();

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
    ///////////////////////////////
    ///////////////////////////////
    ///////////////////////////////
    ///////////////////////////////
    ///////////////////////////////
    ///////////////////////////////
    this.dataLoaded.dispatch(this)
  }
  ,function(range){
    console.log('cotemp'); // todo: remove log
    // this.canvas && fragment.appendChild(this.canvas)
    // console.log('this.foo',this.foo); // todo: remove log
    /*const rangeStart = range.start.ago
      ,rangeEnd = range.end.ago
      ,duration = range.duration
    this.forEach(event=>{
      const ago = event.moment.ago
        ,isInside = ago<=rangeStart&&ago>=rangeEnd
      if (isInside) {
        const element = event.element
          ,fRel = 1-((ago-rangeEnd)/duration)
        element.style.left = getPercentage(fRel)
        fragment.appendChild(element)
      }
      event.inside(isInside)
    })*/
  }
)
