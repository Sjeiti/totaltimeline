/*global THREE*/
/**
 * Periods collection
 * @type collectionInstance
 * @namespace totaltimeline.collection.tectonics
 */
iddqd.ns('totaltimeline.collection.tectonics',(function(undefined){
	'use strict';

	var collection = totaltimeline.collection
		,string = totaltimeline.string
		,imageLoad = iddqd.image.load
		,animate = iddqd.signals.animate
		,time = totaltimeline.time
		,moment = time.moment
		//,range = time.range
		,eventInfo = time.eventInfo
		//,getPercentage = totaltimeline.util.getPercentage
		,sBaseUri = '/data/tectonics/'
		,aImages = [
			 [600E6,'a-600Ma_.jpg']
			,[560E6,'b-560Ma_.jpg']
			,[540E6,'c-540Ma_.jpg']
			,[500E6,'d-500Ma_.jpg']
			,[470E6,'e-470Ma_.jpg']
			,[450E6,'f-450Ma_.jpg']
			,[440E6,'g-440Ma_.jpg']
			,[430E6,'h-430Ma_.jpg']
			,[400E6,'j-400Ma_.jpg']
			,[370E6,'k-370Ma_.jpg']
			,[340E6,'l-340Ma_.jpg']
			,[300E6,'m-300Ma_.jpg']
			,[280E6,'n-280Ma_.jpg']
			,[260E6,'o-260Ma_.jpg']
			,[240E6,'p-240Ma_.jpg']
			,[220E6,'q-220Ma_.jpg']
			,[200E6,'qq200Ma_.jpg']
			,[170E6,'s-170Ma_.jpg']
			,[150E6,'t-150Ma_.jpg']
			,[120E6,'u-120Ma_.jpg']
			,[105E6,'v-105Ma_.jpg']
			,[090E6,'w-090Ma_.jpg']
			,[65E6,'x-065Ma_.jpg']
			,[50E6,'xx-050Ma_.jpg']
			,[35E6,'y-035Ma_.jpg']
			,[20E6,'yy-020Ma_.jpg']
			,[3E6,'yyy-Pleistocene.jpg']
			,[0,'yz-earth-present.jpg']
			,[-100E6,'zz-earth-future+100_.jpg']
		]
		//
		,mBody
		,mWrapper
		,mRenderer
		//
		,scene
		,camera
		,renderer
		,mesh
		,texture
		//
		,bMouseDown = false
		,iLastX = -1
		,iLastY = -1
		,fFrc = 0.9
		,fSpdX = 0
		,fSpdY = 0
		,fRotX = 0
		,fRotY = 0
		//
		,aInstance
	;
	if (totaltimeline.util.canWebGL()) {
		aInstance = collection.add(
			'tectonics'
			,undefined
			,handleGetData.bind(null,aImages)
			,populate
			,true
		);
		mWrapper = aInstance.wrapper;
	}

	// todo: document
	function handleGetData(data){
		var iImagesLoading = data.length;
		function handleImageLoad(item,load){
			item.img = load.img;
			iImagesLoading--;
			if (iImagesLoading===0) {
				imagesLoaded();
			}
		}
		data.forEach(function(img){
			var sUri = img[1]
				,oItem = {
					moment: moment(img[0])
					,info: eventInfo().parse({name:sUri})
				}
			;
			oItem.load = imageLoad(sBaseUri+sUri,handleImageLoad.bind(null,oItem));
			aInstance.push(oItem);
		});
	}

	// todo: document
	function imagesLoaded(){
		window.WebGLRenderingContext&&initView();
		aInstance.dataLoaded.dispatch(aInstance);
	}

	// todo: document
	function initView(){
		mBody = document.body;
		var mScene = document.createElement('div')
			,iSize = 400;

		mScene.style.width = iSize+'px';
		mScene.style.height = iSize+'px';
		mScene.style.position = 'absolute';
		mScene.style.right = '10px';
		mScene.style.bottom = '10px';

		mBody.appendChild(mScene);

//		mWrapper.addEventListener(string.click, handleWrapperClick, false);
		/////////////

		scene = new THREE.Scene();
		camera = new THREE.PerspectiveCamera( 75, iSize/iSize, 0.1, 1000 );

		renderer = new THREE.WebGLRenderer( { alpha: true } );
		renderer.setSize( iSize,iSize );
		mRenderer = renderer.domElement;

		mRenderer.addEventListener(string.mousedown,handleMouseDownUp,true);

		/////////////

		texture = new THREE.Texture();

		var material = new THREE.MeshPhongMaterial({
			map: texture
			,bumpMap: texture
			,bumpScale: 0.005
			,color: 0xFFFFFF
			,ambient: 0xFFFFFF
			,specular: 0x886633
			,shininess: 10
			,shading: THREE.SmoothShading
		});

		var geometry = new THREE.SphereGeometry(2, 32, 24);

		mesh = new THREE.Mesh( geometry, material );
		mesh.rotation.y = 1;
		scene.add( mesh );

		camera.position.z = 3.3;

		/////////////

		scene.add( new THREE.AmbientLight( 0x222222 ) );

		var directionalLight = new THREE.DirectionalLight( 0xffffff, 1 );
		directionalLight.position.set( -1, 1, 1 ).normalize();
		scene.add( directionalLight );
	}

	// todo: document
	function handleMouseDownUp(e){
		bMouseDown = e.type===string.mousedown;
		if (bMouseDown) {
			document.addEventListener(string.mousemove,handleMouseMove,true);
			mBody.addEventListener(string.mouseup,handleMouseDownUp,true);
			e.stopPropagation();
		} else {
			document.removeEventListener(string.mousemove,handleMouseMove,true);
			mBody.removeEventListener(string.mouseup,handleMouseDownUp,true);
			iLastX = -1;
		}
	}

	// todo: document
	function handleMouseMove(e){
		var mouseX = e.clientX;
		var mouseY = e.clientY;
		if (iLastX<0||iLastY<0) {
			iLastX = mouseX;
			iLastY = mouseY;
		}
		fSpdX -= (iLastY - mouseY) / 1000;
		fSpdY -= (iLastX - mouseX) / 1000;
		iLastX = mouseX;
		iLastY = mouseY;
	}

	// todo: document
	function handleAnimate(deltaT){
		fSpdX *= fFrc;
		fSpdY *= fFrc;
		fRotX += fSpdX;
		fRotY += fSpdY;
		if (!bMouseDown) fRotY += 0.0001*deltaT;
		mesh.rotation.x = fRotX;
		mesh.rotation.y = fRotY;
		renderer.render(scene, camera);
	}

	// todo: document
	function populate(fragment,range){
		if (renderer) {
			var iClosest = setTextureImage(range)
				,bIsChild = mRenderer.parentNode===mWrapper
				,bVisible = iClosest<101E6
			;
			if (bVisible&&!bIsChild) {
				mWrapper.appendChild( mRenderer );
				animate.add(handleAnimate);
			} else if (!bVisible&&bIsChild) {
				mWrapper.removeChild( mRenderer );
				animate.remove(handleAnimate);
			}
		}
	}

	// todo: document
	function setTextureImage(range){
		var iClosest = 4E9;
		if (texture&&range) {
			var iRangeCenterAgo = range.start.ago - range.duration/2
				,oItem = aInstance[0]
			;
			// find closest to range center
			for (var i=0,l=aInstance.length;i<l;i++) {
				var oCheckItem = aInstance[i]
					,iDiff = Math.abs(oCheckItem.moment.ago - iRangeCenterAgo)
				;
				if (iDiff<iClosest) {
					iClosest = iDiff;
					oItem = oCheckItem;
				}
			}
			texture.image = oItem.img;
			texture.needsUpdate = true;
		}
		return iClosest;
	}

	return aInstance;
})());