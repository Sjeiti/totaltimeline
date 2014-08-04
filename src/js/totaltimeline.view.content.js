/**
 * @namespace totaltimeline.view.content
 */
iddqd.ns('totaltimeline.view.content',(function(){
	'use strict';

	var string = totaltimeline.string
		,collection = totaltimeline.collection
		,emptyElement = totaltimeline.util.emptyElement
		,event = collection.events.event
		,period = collection.periods.period
		,resize = iddqd.signals.resize
		,mContent
		,oContentStyle
		,mContentWrapper
		,mFragment = document.createDocumentFragment()
		,oGrow = {
			'-webkit-box-flex': 1
			,'-moz-box-flex': 1
			,'-webkit-flex-grow': 1
			,'-moz-flex-grow': 1
			,'-ms-flex-grow': 1
			,'flex-grow': 1
		}
	;

	function init(model){
		initVariables();
		initEvents(model);
		initView();
	}

	/**
	 * Initialise Variables
	 */
	function initVariables(){
		mContent = document.getElementById('content');
		oContentStyle = iddqd.style.select('#content');
		mContentWrapper = zen('div.content').pop();
	}

	/**
	 * Initialise event listeners (and signals).
	 * @param {model} model
	 */
	function initEvents(model){
		model.entryShown.add(handleEntryShown);
		mContent.addEventListener(string.scroll,handleContentScroll);
		resize.add(handleContentScroll);
	}

	/**
	 * Initialise view
	 */
	function initView(){
		mContent.appendChild(mContentWrapper);
	}

	// todo:document
	function handleEntryShown(entry) {
		//console.log('handleEntryShown',Date.now(),entry&&entry.info.name,entry); // log
		//totaltimeline.view.log('handleEntryShown',entry.info.name);
		init.currentEntry = entry;
		emptyElement(mContentWrapper);
		emptyElement(mFragment);
		setContentGrow(1);
		mContent.scrollTop = 0;
		if (entry) {
			var sTime = '';
			if (entry.factory===event) {
				sTime = entry.moment.toString();
			} else if (entry.factory===period) {
				sTime = entry.range.start.toString()+' - '+entry.range.end.toString();
			}
			mContentWrapper.innerHTML = iddqd.tmpl('content_tmpl',iddqd.extend(entry,{
				time: sTime
			}));
		}
	}

	// todo:document
	function handleContentScroll(){
		var iScrollTop = mContent.scrollTop
			,iScrollHeight = mContent.scrollHeight
			,iHeight = mContent.offsetHeight
			,bSameHeight = iHeight===iScrollHeight
			,fPart
		;
		if (bSameHeight&&oGrow['flex-grow']!==1) {
			fPart = 1;
		} else if (bSameHeight) {
			fPart = 0;
		} else {
			fPart = iScrollTop/(iScrollHeight-iHeight);
		}
		//console.log('\tiScrollTop',iScrollTop); // log
		//console.log('\tiScrollHeight',iScrollHeight); // log
		//console.log('\tiHeight',iHeight); // log
		//console.log('\t\tfPart',fPart); // log
		setContentGrow(1+fPart*2); // todo: get that 1 from less
	}

	// todo:document
	function setContentGrow(value){
		for (var s in oGrow) {
			oGrow[s] = value;
		}
		oContentStyle.set(oGrow);
	}

	return init;//iddqd.extend(init,{show: show});
})());