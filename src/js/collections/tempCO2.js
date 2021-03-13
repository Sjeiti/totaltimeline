import { graphs, graphCollection } from './graphs'
import {getMinMax, getMap} from '../util'

/**
 * Temperature collections
 * @type collectionInstance
 * @name temperature
 */
export default graphCollection(
  'Epica-tpt-co2.csv'
  ,(data)=> {

    const lines = data.split(/\n/g)
    const headers = lines[4].split(/,/g)
    const cols = lines.slice(5).map(line=>line.split(/,/g).map(parseFloat))

    const colTime = cols.map(col=>col[0])
    const colRest = headers.slice(1).map((s,i)=>cols.map(col=>col[i+1]))

    const colors = [
      '#ee513f'
      ,'#8b478c'
      // '#ffe9d5'
      // ,'#fdd5ff'
      ,'#9b6325'
      ,'#366b24'
    ]

    const colRestMinMax = colRest.map(getMinMax)

    const mapRest = colRestMinMax.map(mm=>getMap(mm.min,mm.max))

    colRest.forEach((values,i)=>{
      i!==2&&graphs.add(headers[i+1], colTime, values, mapRest[i], colors[i])
    })
  }
)
