import { graphs, graphCollection } from './graphs'
import {getMinMax, getMap} from '../util'

/**
 * Population
 * @type collectionInstance
 * @name temperature
 */
graphCollection(
  'Hyde-3.1-population.csv'
  ,(data)=> {

    const lines = data.split(/\n/g)
    const headers = lines[0].split(/,/g)
    const cols = lines.slice(1).map(line=>line.split(/,/g).map(parseFloat))

    const colTime = cols.map(col=>col[0]).map(year=>year-2017)
    const colRest = headers.slice(1).map((s,i)=>cols.map(col=>col[i+1]))

    const colRestMinMax = colRest.map(getMinMax)

    const mapRest = colRestMinMax.map(mm=>getMap(mm.min,mm.max))

    const ind = 2

    graphs.add('Population', colTime, colRest[ind], mapRest[ind], '#9b6325')
  }
)
