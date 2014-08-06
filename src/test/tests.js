/* global QUnit,splitSubject,getWikiMedia */
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

	module('googleSpreadsheet');
	if (!window.UrlFetchApp) {
		window.UrlFetchApp = {
			fetch: function(endpoint,vars){
				//console.log('UrlFetchApp.fetch',endpoint,vars); // log
				// only returns Farallon_Plate
				// http://en.wikipedia.org/w/api.php?titles=Farallon_Plate&format=json&action=query&prop=revisions&rvprop=content
				var oJSON = {"query":{"normalized":[{"from":"Farallon_Plate","to":"Farallon Plate"}],"pages":{"494305":{"pageid":494305,"ns":0,"title":"Farallon Plate","revisions":[{"contentformat":"text/x-wiki","contentmodel":"wikitext","*":"[[Image:Farallon Plate.jpg|thumb|250px|right|A software model by NASA of the remnants of the Farallon Plate, deep in Earth's mantle.]]\n[[Image:San Andreas Fault Sequential Diagrams.jpg|thumb|300px|Creation of the Juan de Fuca (including Explorer and Gorda) and Cocos plates (including Rivera) and of the San Andreas Fault from the Farallon plate]]\n\nThe '''Farallon Plate''' was an ancient [[oceanic plate]], which began [[subduct]]ing under the west coast of the [[North American Plate]]&mdash;then located in modern [[Utah]]&mdash;as [[Pangaea]] broke apart during the [[Jurassic]] Period. It is named for the [[Farallon Islands]] which are located just west of [[San Francisco, California]].\n\nOver time the central part of the Farallon Plate was completely subducted under the southwestern part of the North American Plate. The remains of the Farallon Plate are the [[Juan de Fuca Plate|Juan de Fuca]], [[Explorer Plate|Explorer]] and [[Gorda plate|Gorda]] Plates, subducting under the northern part of the [[North American Plate]]; the [[Cocos Plate]] subducting under [[Central America]]; and the [[Nazca Plate]] subducting under the [[South American Plate]].\n\nThe Farallon Plate is also responsible for transporting old [[island arc]]s and various fragments of [[continental crust]]al material rifted off from other distant plates and [[Accretion (geology)|accreting]] them to the North American Plate.\n\nThese fragments from elsewhere are called [[terrane]]s (sometimes, \"exotic\" terranes). Much of western North America is composed of these accreted terranes.\n\n== Current state==\nThe understanding of the Farallon Plate is rapidly evolving as details from [[seismic tomography]] provide improved details of the submerged remnants.<ref>{{Harvnb|Goes|2013}}.</ref> Since the North American west coast shows a convoluted structure, significant work has been required to resolve the complexity.  In 2013 a new and more nuanced explanation emerged, proposing two additional now-subducted plates which would account for some of the complexity.<ref>{{Harvnb|Sigloch|Mihalynuk|2013}}.</ref>\n\n===Historic view ===\nAs data accumulated, a common view was that one large oceanic plate, the Farallon plate, acted as a conveyor belt, conveying [[terrane]]s to North America's west coast, where they accreted. As the continent overran the subducting Farallon plate, the denser plate was subducted into the mantle below the continent. When the plates converged, the dense oceanic plate sank into the mantle to form a slab below the lighter continent.<ref>{{Harvnb|Goes|2013}}.</ref>\n\n===Farallon Plate subduction forms Cordilleran North America===\n[[Image:Cascadia subduction zone USGS.png|thumb|Region of the modern Cascadia subduction zone]]\n\nIn 2013, it is generally accepted that the western quarter of North America consists of accreted [[terrane]] accumulated over the past 200 million years as a result of the oceanic Farallon plate moving  terranes onto the [[continental margin]] as it [[subduct]]s under the continent. However this simple model was unable to explain many terrane complexities, and is inconsistent with [[Seismic tomography|seismic tomographic images]] of subducting slabs penetrating the [[Mantle (geology)|lower-mantle]]. In April 2013 Sigloch and Mihalynuk noted that under North America these subducting slabs formed massive, essentially vertical walls of 800&nbsp;km to 2,000&nbsp;km deep and 400\u2013600&nbsp;km wide, forming \"slab walls\". One such large \"slab wall\" runs from north-west Canada to the eastern USA and extends to Central America; this \"slab wall\" had traditionally been associated with the subducting Farallon plate. Sigloch and Mihalynuk proposed that the Farallon should be partitioned into Northern Farallon, [[Angayucham]], [[Mezcalera]] and Southern Farallon segments based on recent tomographic models. Under this model, the North American continent overrides a series of subduction trenches and incorporates [[microcontinent]]s (similar to those in the modern-day Indonesian archipelago) as it moves west in the following sequence:<ref>{{Harvnb|Sigloch|Mihalynuk|2013}}.</ref> \n* 165\u2013155 Myr ago the Mezcalera promontory (the leading terrane to strike North America) strikes land and begins to be overridden. The overridden segment is replaced by an incipient South Farallon trench. \n* 160\u2013155 Myr ago the Rocky Mountain deformation begins, recorded by a synorogenic (formed contemporaneously with the [[orogen]]) clastic wedge. The [[Franciscan Assemblage|Franciscan subduction complex]] on the South Farallon plate begins.\n* 125 Myr ago the collision of the North America margin with an archipelago of terranes (Mezcalera / Angayucham /Southern Farallon island arcs) begins. This broad expanse causes strong deformations and  creates the [[Sevier Mountains]] and the [[Canadian Rocky Mountains]]. \n* 124\u201390 Myr ago  the [[Omineca Country|Omenica magmatic belts]] are formed in the Pacific Northwest along with a gradual override of the Mezcalera promontory by the Pacific Northwest.\n* 85 Myr ago the South Farallon trench moves westward after accretion of the [[Shatsky Rise|Shatsky Rise Conjugate plateau]]. Sonora volcanism results from the slab sinking. The [[Sierra Madre Occidental|Tarahumara ignimbrite province]] is formed.\n* 85\u201355 Myr ago Strong [[Transpression|transpressive]] coupling of Farallon plate to terranes produces the buoyant [[Shatsky Rise]]. The [[Laramide orogeny]] results from basement uplift more than 1,000&nbsp;km inland.\n* 72\u201369 Myr ago the Angayucham arc, is overridden by North America and Carmacks volcanic episode results.\n*  85\u201355 Myr ago Conjugate subducts. Northward shuffle of Insular terrane, Intermontane terrane, and Angayucham terranes along margin.\n*   55\u201350 Myr ago saw the override of the Cascadia Root arc by the Pacific Northwest along with accretion of the [[Siletzia]] and Pacific Rim terranes. \n*  55\u201350 Myr ago Final override of westernmost Angayucham occurred, with an explosive end of Coast Mountain arc volcanism\n\nWhen the final archipelago, the Siletzia archipelago lodged as a terrane, the associated trench stepped west as the terrane accreted, converting an intra-oceanic subduction trench into the current [[Cascadia subduction zone]] and creating a slab window.<ref>{{Harvnb|Goes|2013}};  {{Harvnb|Sigloch|Mihalynuk|2013}}.</ref>\n\n==See also==\n* [[Izanagi Plate]]\n* [[Kula Plate]]\n* [[Kula\u2013Farallon Ridge]]\n* [[San Andreas Fault]]\n\n==Notes==\n{{Reflist|2}}\n\n==References==\n<!-- The Harv templates go into the text or note where you want to ref the source. -->\n{{Refbegin}}\n<!-- {{Harvnb|Goes|2013}} -->\n* {{cite journal\n |title= Western North America\u2019s jigsaw \n |last1= Goes |first1= Saskia \n |journal= Nature \n |date=April 2013 \n |volume= 496 |pages= 25\u201327\n |doi= 10.1038/496035a\n |url= http://www.nature.com/nature/journal/v496/n7443/full/496035a.html \n|bibcode = 2013Natur.496...35G }}\n<!-- {{Harvnb|Sigloch|Mihalynuk|2013}} -->\n* {{cite journal\n |last1= Sigloch |first1= Karin\n |last1= Mihalynuk |first1= Mitchell G.\n |title= Intra-oceanic subduction shaped the assembly of Cordilleran North America\n |journal= Nature\n |date= 4 April 2013\n |volume= 496 |pages= 50\u201356\n |doi= 10.1038/nature12019\n|bibcode = 2013Natur.496...50S }} \n<!-- {{Harvnb|Schellart|Stegman|Farrington|Freeman|2010}} -->\n* {{Cite journal \n |first1= W. P. |last1= Schellart \n |first2= D. R. |last2= Stegman\n |first3= R. J. |last3= Farrington \n |first4= J.    |last4= Freeman \n |first5= L.    |last5= Moresi \n |title= Cenozoic Tectonics of Western North America Controlled by Evolving Width of Farallon Slab \n |journal= Science \n |date= 16 July 2010\n |volume= 329 |issue= 5989 |pages= 316\u2013319 \n |doi= 10.1126/science.1190366\n |pmid= 20647465\n |bibcode= 2010Sci...329..316S \n}}\n<!-- {{Harvnb|Schmid|Goes|van der Lee|Giardini|2002}} -->\n* {{Cite journal \n |last1= Schmid |first1= C. \n |last2= Goes |first2= S. \n |last3= van der Lee |first3= S. \n |last4= Giardini |first4= D. \n |year= 2002 \n |title= Fate of the Cenozoic Farallon slab from a comparison of kinematic thermal modeling with tomographic images \n |journal= Earth Planetary Science Letters \n |volume= 204 |pages= 17\u201332\n |bibcode= 2002E&PSL.204...17S \n |doi= 10.1016/S0012-821X(02)00985-8 \n |url= http://www.earth.northwestern.edu/research/suzan/publications/24_Schmid_et_al_EPSL_2002.pdf\n}}\n----\n* {{Cite web\n |url= http://www.geodynamics.no/Web/Content/Animated/ \n |title= Global plate reconstructions with velocity fields from 150 Ma to present in 10 Ma increments \n |publisher= [[Norwegian Geological Survey|Geological Survey of Norway]]\n}}\n* {{Cite web\n |url= http://news.brown.edu/pressreleases/2013/03/farallon/\n |title= Under California: An ancient tectonic plate \n |publisher= [[Brown University]]\n}}\n{{Refend}}\n\n==External links==\n*[http://pubs.usgs.gov/gip/dynamic/Farallon.html Images from USGS Professional Paper 1515]\n*[http://www.gps.caltech.edu/~gurnis/Movies/Science_Captions/caption_farallon.html Demise of the Farallon Plate Beneath North America] \u2014 [[California Institute of Technology]]\n*[http://svs.gsfc.nasa.gov/vis/a000000/a001300/a001322/index.html The Farallon Plate] \u2014 [[Goddard Space Flight Center]]\n\n{{Tectonic plates}}\n\n[[Category:Tectonic plates]]\n[[Category:Historical tectonic plates]]\n[[Category:Natural history of North America]]\n[[Category:Historical geology]]\n[[Category:Mesozoic]]\n[[Category:Cenozoic]]"}]}}}};
				return JSON.stringify(oJSON);
			}
		};
	}
	if (!window.Utilities) {
		window.Utilities = {
			sleep: function(){}
		};
	}
	test( 'splitSubject', function() {
		expect(6);
		var oSubject1 = splitSubject('Future_of_the_Earth#Red_giant_stage:1,3-6,9')
			,oSubject2 = splitSubject('Farallon_Plate:1,3');
		ok(oSubject1.page==='Future_of_the_Earth','page');
		ok(oSubject1.heading==='Red giant stage','heading');
		ok(oSubject1.paragraphs[0]===1,'paragraphs');
		ok(oSubject1.paragraphs.length===6,'paragraphs.length');
		ok(oSubject2.page==='Farallon_Plate','page');
		ok(oSubject2.heading==='','heading');
	});
	test( 'getWikiMedia', function() {
		expect(3);
		var sContent = getWikiMedia('Farallon_Plate#Farallon_Plate_subduction_forms_Cordilleran_North_America:0,2-4');
		ok(getWikiMedia('Farallon_Plate').match(/\w+/).shift()==='Over','first paragraph');
		ok(sContent.match(/\w+/).shift()==='In','other paragraph');
		ok(sContent.split(/\n/).length===4,'number of paragraphs');
	});

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
