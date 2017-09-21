import event from './event'
import eventInfo from '../time/eventInfo'
import moment from '../time/moment'

export default event(moment(0),eventInfo({
  name: 'totaltimeline',
  explanation: `<p>TotalTimeLine is a timeline of everything. It is an open source project that tries to make <a href="#homo">people</a> aware of their insignificance.</p>
<p>This timeline is not one to show historic events per se. It is a timeline of firsts. The depicted events are astronomical events, natural events or major accomplishments in the history of human kind.<br/>
Most things in history are uncertain; either hearsay or speculation. So a lot of events are about the oldest -thing- we can see or have found, it does not necessarily mean the -thing- was not there before.</p>
<h2>why</h2>
<p>I've never been much into the history they teach at schools. I did like <a href="#earliest-dinosaur">dinosaurs</a>, but society rather teaches you what <a href="#world-war-i">wars</a> your great-great-great-great-great grandfather fought.<br/>
When a friend of mine told me he drew a timeline like this on paper and was awed by it I tried a similar one in code. The weirdest insight I got from this was that when you look at time like this: <a href="#life">life</a> seems to emerge the moment the <a href="#earth">earth</a> is created.<br/>
Like a lot of things I code it this was just a rudimentary prototype I shelved. But this one nagged me in a sense that I think more people should know these facts. So I build it into something whole.</p>`
}),0)