import {event} from './event'
import {eventInfo} from '../time/eventInfo'
import {moment} from '../time/moment'

export const about = event(moment(0),eventInfo({
  name: 'totaltimeline',
  explanation: `<p>TotalTimeLine is a timeline of everything. It is an <a href="https://github.com/Sjeiti/totaltimeline">open source project</a> that tries to make <a href="#homo">people</a> aware of their insignificance.</p>
<p>The depicted events are astronomical events, natural events or major accomplishments in the history of human kind.<br/>
Most things in history are uncertain; either hearsay or speculation. So a lot of events are about the oldest -thing- we can see or have found, it does not necessarily mean it was not there before.</p>
<h4>why</h4>
<p>I've never been much into the history they teach at schools. I did like <a href="#earliest-dinosaur">dinosaurs</a>, but society rather teaches you what <a href="#world-war-i">wars</a> your great-great-great-great-great grandfather fought.<br/>
Only later in life did I see the scale and proportion of the time we live. Yet <a href="#life">life</a> seems to emerge the moment the <a href="#earth">earth</a> solidifies.</p>`
}),0)