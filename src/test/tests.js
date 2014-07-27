/* global QUnit */
(function(QUnit){
	'use strict';

	var module = QUnit.module
		,test = QUnit.test
		,expect = QUnit.expect
		,assert = QUnit.assert
		,ok = assert.ok
		//
		,time = totaltimeline.time
	;

	module('totaltimeline.time');
	test( 'formatAnnum', function() {
		expect(5);
		ok(time.formatAnnum(time.UNIVERSE)==='14 Ga','time.UNIVERSE - 14 Ga');
		ok(time.formatAnnum(time.NOW)==='2014','time.NOW - 2014');
		ok(time.formatAnnum(120000)==='120 ka','120000 - 120 ka');
		ok(time.formatAnnum(999E6)==='999 Ma','999E6 - 999 Ma');
		ok(time.formatAnnum(13.6E9,1,false)==='13.6Ga','13.6E9 - 13.6Ga');
	});
	test( 'unformatAnnum', function() {
		expect(5);
		ok(time.unformatAnnum('14 Ga')===14E9,'14 Ga - 14E9');
		ok(time.unformatAnnum('2014')===time.NOW,'2014 - time.NOW');
		ok(time.unformatAnnum('120 ka')===120000,'120 ka - 120000');
		ok(time.unformatAnnum('999 Ma')===999E6,'999 Ma - 999E6');
		ok(time.unformatAnnum('13.6Ga')===13.6E9,'13.6Ga - 13.6E9');
	});

})(QUnit);

/*
ok( (function(){
	var s = '';
	$zen('ul>(li>input[value=a$]+li>select>option[value=b$])*3',{a:aList.slice(0,3),b:aList.slice(3)}).find('li').tsort('>input,>select',{useVal:true})
	.each(function(i,el){ s += $(el).find('>*').val(); });
	return s=='aar-eax-eek-myr-oac-oif-';
})(),'$Li.tsort(\'>input,>select\',{useVal:true})');
ok( (function(){
	var s = '';
	$zen('ul>li#a${a}*6',{a:aList}).find('li').tsort({attr:'id'})
	.each(function(i,el){ s += $(el).attr('id'); });
	return s==sJoin;
})(),'$Li.tsort({attr:\'id\'});');
*/
