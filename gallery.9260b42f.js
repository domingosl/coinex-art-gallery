function e(e){return e&&e.__esModule?e.default:e}var t="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:"undefined"!=typeof window?window:"undefined"!=typeof global?global:{},n={},s={},o=t.parcelRequire4141;null==o&&((o=function(e){if(e in n)return n[e].exports;if(e in s){var t=s[e];delete s[e];var o={id:e,exports:{}};return n[e]=o,t.call(o.exports,o,o.exports),o.exports}var i=new Error("Cannot find module '"+e+"'");throw i.code="MODULE_NOT_FOUND",i}).register=function(e,t){s[e]=t},t.parcelRequire4141=o);var i=o("3NNSQ"),a=o("33SoD"),r=o("ilwiq"),l=o("7lx9d");class d{static createButton(e){const t=document.createElement("button");function n(){t.style.display="",t.style.cursor="auto",t.style.left="calc(50% - 75px)",t.style.width="150px",t.onmouseenter=null,t.onmouseleave=null,t.onclick=null}function s(e){e.style.position="absolute",e.style.bottom="20px",e.style.padding="12px 6px",e.style.border="1px solid #fff",e.style.borderRadius="4px",e.style.background="rgba(0,0,0,0.1)",e.style.color="#fff",e.style.font="normal 13px sans-serif",e.style.textAlign="center",e.style.opacity="0.5",e.style.outline="none",e.style.zIndex="999"}if("xr"in navigator)return t.id="VRButton",t.style.display="none",s(t),navigator.xr.isSessionSupported("immersive-vr").then((function(s){s?function(){let n=null;async function s(s){s.addEventListener("end",o),await e.xr.setSession(s),t.textContent="EXIT VR",n=s}function o(){n.removeEventListener("end",o),t.textContent="ENTER VR",n=null}t.style.display="",t.style.cursor="pointer",t.style.left="calc(50% - 50px)",t.style.width="100px",t.textContent="ENTER VR",t.onmouseenter=function(){t.style.opacity="1.0"},t.onmouseleave=function(){t.style.opacity="0.5"},t.onclick=function(){if(null===n){const e={optionalFeatures:["local-floor","bounded-floor","hand-tracking","layers"]};navigator.xr.requestSession("immersive-vr",e).then(s)}else n.end()}}():(n(),t.textContent="VR NOT SUPPORTED"),s&&d.xrSessionIsGranted&&t.click()})).catch((function(e){n(),console.warn("Exception when trying to call xr.isSessionSupported",e),t.textContent="VR NOT ALLOWED"})),t;{const e=document.createElement("a");return!1===window.isSecureContext?(e.href=document.location.href.replace(/^http:/,"https:"),e.innerHTML="WEBXR NEEDS HTTPS"):(e.href="https://immersiveweb.dev/",e.innerHTML="WEBXR NOT AVAILABLE"),e.style.left="calc(50% - 90px)",e.style.width="180px",e.style.textDecoration="none",s(e),e}}static xrSessionIsGranted=!1;static registerSessionGrantedListener(){if("xr"in navigator){if(/WebXRViewer\//i.test(navigator.userAgent))return;navigator.xr.addEventListener("sessiongranted",(()=>{d.xrSessionIsGranted=!0}))}}}d.registerSessionGrantedListener(),o("8vghX").config();var h=o("hXJAl"),p=o("fZ8NE");r=o("ilwiq"),l=o("7lx9d");const c={Handedness:Object.freeze({NONE:"none",LEFT:"left",RIGHT:"right"}),ComponentState:Object.freeze({DEFAULT:"default",TOUCHED:"touched",PRESSED:"pressed"}),ComponentProperty:Object.freeze({BUTTON:"button",X_AXIS:"xAxis",Y_AXIS:"yAxis",STATE:"state"}),ComponentType:Object.freeze({TRIGGER:"trigger",SQUEEZE:"squeeze",TOUCHPAD:"touchpad",THUMBSTICK:"thumbstick",BUTTON:"button"}),ButtonTouchThreshold:.05,AxisTouchThreshold:.1,VisualResponseProperty:Object.freeze({TRANSFORM:"transform",VISIBILITY:"visibility"})};async function u(e){const t=await fetch(e);if(t.ok)return t.json();throw new Error(t.statusText)}async function m(e,t,n=null,s=!0){if(!e)throw new Error("No xrInputSource supplied");if(!t)throw new Error("No basePath supplied");const o=await async function(e){if(!e)throw new Error("No basePath supplied");return await u(`${e}/profilesList.json`)}(t);let i;if(e.profiles.some((e=>{const n=o[e];return n&&(i={profileId:e,profilePath:`${t}/${n.path}`,deprecated:!!n.deprecated}),!!i})),!i){if(!n)throw new Error("No matching profile name found");const e=o[n];if(!e)throw new Error(`No matching profile name found and default profile "${n}" missing.`);i={profileId:n,profilePath:`${t}/${e.path}`,deprecated:!!e.deprecated}}const a=await u(i.profilePath);let r;if(s){let t;if(t="any"===e.handedness?a.layouts[Object.keys(a.layouts)[0]]:a.layouts[e.handedness],!t)throw new Error(`No matching handedness, ${e.handedness}, in profile ${i.profileId}`);t.assetPath&&(r=i.profilePath.replace("profile.json",t.assetPath))}return{profile:a,assetPath:r}}const x={xAxis:0,yAxis:0,button:0,state:c.ComponentState.DEFAULT};class f{constructor(e){this.componentProperty=e.componentProperty,this.states=e.states,this.valueNodeName=e.valueNodeName,this.valueNodeProperty=e.valueNodeProperty,this.valueNodeProperty===c.VisualResponseProperty.TRANSFORM&&(this.minNodeName=e.minNodeName,this.maxNodeName=e.maxNodeName),this.value=0,this.updateFromComponent(x)}updateFromComponent({xAxis:e,yAxis:t,button:n,state:s}){const{normalizedXAxis:o,normalizedYAxis:i}=function(e=0,t=0){let n=e,s=t;if(Math.sqrt(e*e+t*t)>1){const o=Math.atan2(t,e);n=Math.cos(o),s=Math.sin(o)}return{normalizedXAxis:.5*n+.5,normalizedYAxis:.5*s+.5}}(e,t);switch(this.componentProperty){case c.ComponentProperty.X_AXIS:this.value=this.states.includes(s)?o:.5;break;case c.ComponentProperty.Y_AXIS:this.value=this.states.includes(s)?i:.5;break;case c.ComponentProperty.BUTTON:this.value=this.states.includes(s)?n:0;break;case c.ComponentProperty.STATE:this.valueNodeProperty===c.VisualResponseProperty.VISIBILITY?this.value=this.states.includes(s):this.value=this.states.includes(s)?1:0;break;default:throw new Error(`Unexpected visualResponse componentProperty ${this.componentProperty}`)}}}class g{constructor(e,t){if(!(e&&t&&t.visualResponses&&t.gamepadIndices&&0!==Object.keys(t.gamepadIndices).length))throw new Error("Invalid arguments supplied");this.id=e,this.type=t.type,this.rootNodeName=t.rootNodeName,this.touchPointNodeName=t.touchPointNodeName,this.visualResponses={},Object.keys(t.visualResponses).forEach((e=>{const n=new f(t.visualResponses[e]);this.visualResponses[e]=n})),this.gamepadIndices=Object.assign({},t.gamepadIndices),this.values={state:c.ComponentState.DEFAULT,button:void 0!==this.gamepadIndices.button?0:void 0,xAxis:void 0!==this.gamepadIndices.xAxis?0:void 0,yAxis:void 0!==this.gamepadIndices.yAxis?0:void 0}}get data(){return{id:this.id,...this.values}}updateFromGamepad(e){if(this.values.state=c.ComponentState.DEFAULT,void 0!==this.gamepadIndices.button&&e.buttons.length>this.gamepadIndices.button){const t=e.buttons[this.gamepadIndices.button];this.values.button=t.value,this.values.button=this.values.button<0?0:this.values.button,this.values.button=this.values.button>1?1:this.values.button,t.pressed||1===this.values.button?this.values.state=c.ComponentState.PRESSED:(t.touched||this.values.button>c.ButtonTouchThreshold)&&(this.values.state=c.ComponentState.TOUCHED)}void 0!==this.gamepadIndices.xAxis&&e.axes.length>this.gamepadIndices.xAxis&&(this.values.xAxis=e.axes[this.gamepadIndices.xAxis],this.values.xAxis=this.values.xAxis<-1?-1:this.values.xAxis,this.values.xAxis=this.values.xAxis>1?1:this.values.xAxis,this.values.state===c.ComponentState.DEFAULT&&Math.abs(this.values.xAxis)>c.AxisTouchThreshold&&(this.values.state=c.ComponentState.TOUCHED)),void 0!==this.gamepadIndices.yAxis&&e.axes.length>this.gamepadIndices.yAxis&&(this.values.yAxis=e.axes[this.gamepadIndices.yAxis],this.values.yAxis=this.values.yAxis<-1?-1:this.values.yAxis,this.values.yAxis=this.values.yAxis>1?1:this.values.yAxis,this.values.state===c.ComponentState.DEFAULT&&Math.abs(this.values.yAxis)>c.AxisTouchThreshold&&(this.values.state=c.ComponentState.TOUCHED)),Object.values(this.visualResponses).forEach((e=>{e.updateFromComponent(this.values)}))}}class v{constructor(e,t,n){if(!e)throw new Error("No xrInputSource supplied");if(!t)throw new Error("No profile supplied");this.xrInputSource=e,this.assetUrl=n,this.id=t.profileId,this.layoutDescription=t.layouts[e.handedness],this.components={},Object.keys(this.layoutDescription.components).forEach((e=>{const t=this.layoutDescription.components[e];this.components[e]=new g(e,t)})),this.updateFromGamepad()}get gripSpace(){return this.xrInputSource.gripSpace}get targetRaySpace(){return this.xrInputSource.targetRaySpace}get data(){const e=[];return Object.values(this.components).forEach((t=>{e.push(t.data)})),e}updateFromGamepad(){Object.values(this.components).forEach((e=>{e.updateFromGamepad(this.xrInputSource.gamepad)}))}}class y extends r.Object3D{constructor(){super(),this.motionController=null,this.envMap=null}setEnvironmentMap(e){return this.envMap==e||(this.envMap=e,this.traverse((e=>{e.isMesh&&(e.material.envMap=this.envMap,e.material.needsUpdate=!0)}))),this}updateMatrixWorld(e){super.updateMatrixWorld(e),this.motionController&&(this.motionController.updateFromGamepad(),Object.values(this.motionController.components).forEach((e=>{Object.values(e.visualResponses).forEach((e=>{const{valueNode:t,minNode:n,maxNode:s,value:o,valueNodeProperty:i}=e;t&&(i===c.VisualResponseProperty.VISIBILITY?t.visible=o:i===c.VisualResponseProperty.TRANSFORM&&(t.quaternion.slerpQuaternions(n.quaternion,s.quaternion,o),t.position.lerpVectors(n.position,s.position,o)))}))})))}}function w(e,t){!function(e,t){Object.values(e.components).forEach((e=>{const{type:n,touchPointNodeName:s,visualResponses:o}=e;if(n===c.ComponentType.TOUCHPAD)if(e.touchPointNode=t.getObjectByName(s),e.touchPointNode){const t=new(0,r.SphereGeometry)(.001),n=new(0,r.MeshBasicMaterial)({color:255}),s=new(0,r.Mesh)(t,n);e.touchPointNode.add(s)}else console.warn(`Could not find touch dot, ${e.touchPointNodeName}, in touchpad component ${e.id}`);Object.values(o).forEach((e=>{const{valueNodeName:n,minNodeName:s,maxNodeName:o,valueNodeProperty:i}=e;if(i===c.VisualResponseProperty.TRANSFORM){if(e.minNode=t.getObjectByName(s),e.maxNode=t.getObjectByName(o),!e.minNode)return void console.warn(`Could not find ${s} in the model`);if(!e.maxNode)return void console.warn(`Could not find ${o} in the model`)}e.valueNode=t.getObjectByName(n),e.valueNode||console.warn(`Could not find ${n} in the model`)}))}))}(e.motionController,t),e.envMap&&t.traverse((t=>{t.isMesh&&(t.material.envMap=e.envMap,t.material.needsUpdate=!0)})),e.add(t)}r=o("ilwiq");const b=new(0,(r=o("ilwiq")).Matrix4),N=new(0,r.Vector3);class E{constructor(e,t,n,s,o){let i;this.controller=t,this.handModel=e,this.envMap=null,o&&o.primitive&&"sphere"!==o.primitive?"box"===o.primitive&&(i=new(0,r.BoxGeometry)(1,1,1)):i=new(0,r.SphereGeometry)(1,10,10);const a=new(0,r.MeshStandardMaterial);this.handMesh=new(0,r.InstancedMesh)(i,a,30),this.handMesh.instanceMatrix.setUsage(r.DynamicDrawUsage),this.handMesh.castShadow=!0,this.handMesh.receiveShadow=!0,this.handModel.add(this.handMesh),this.joints=["wrist","thumb-metacarpal","thumb-phalanx-proximal","thumb-phalanx-distal","thumb-tip","index-finger-metacarpal","index-finger-phalanx-proximal","index-finger-phalanx-intermediate","index-finger-phalanx-distal","index-finger-tip","middle-finger-metacarpal","middle-finger-phalanx-proximal","middle-finger-phalanx-intermediate","middle-finger-phalanx-distal","middle-finger-tip","ring-finger-metacarpal","ring-finger-phalanx-proximal","ring-finger-phalanx-intermediate","ring-finger-phalanx-distal","ring-finger-tip","pinky-finger-metacarpal","pinky-finger-phalanx-proximal","pinky-finger-phalanx-intermediate","pinky-finger-phalanx-distal","pinky-finger-tip"]}updateMesh(){const e=this.controller.joints;let t=0;for(let n=0;n<this.joints.length;n++){const s=e[this.joints[n]];s.visible&&(N.setScalar(s.jointRadius||.008),b.compose(s.position,s.quaternion,N),this.handMesh.setMatrixAt(n,b),t++)}this.handMesh.count=t,this.handMesh.instanceMatrix.needsUpdate=!0}}l=o("7lx9d");class C{constructor(e,t,n,s){this.controller=t,this.handModel=e,this.bones=[];const o=new(0,l.GLTFLoader);o.setPath(n||"https://cdn.jsdelivr.net/npm/@webxr-input-profiles/assets@1.0/dist/profiles/generic-hand/"),o.load(`${s}.glb`,(e=>{const t=e.scene.children[0];this.handModel.add(t);const n=t.getObjectByProperty("type","SkinnedMesh");n.frustumCulled=!1,n.castShadow=!0,n.receiveShadow=!0;["wrist","thumb-metacarpal","thumb-phalanx-proximal","thumb-phalanx-distal","thumb-tip","index-finger-metacarpal","index-finger-phalanx-proximal","index-finger-phalanx-intermediate","index-finger-phalanx-distal","index-finger-tip","middle-finger-metacarpal","middle-finger-phalanx-proximal","middle-finger-phalanx-intermediate","middle-finger-phalanx-distal","middle-finger-tip","ring-finger-metacarpal","ring-finger-phalanx-proximal","ring-finger-phalanx-intermediate","ring-finger-phalanx-distal","ring-finger-tip","pinky-finger-metacarpal","pinky-finger-phalanx-proximal","pinky-finger-phalanx-intermediate","pinky-finger-phalanx-distal","pinky-finger-tip"].forEach((e=>{const n=t.getObjectByName(e);void 0!==n?n.jointName=e:console.warn(`Couldn't find ${e} in ${s} hand mesh`),this.bones.push(n)}))}))}updateMesh(){const e=this.controller.joints;for(let t=0;t<this.bones.length;t++){const n=this.bones[t];if(n){const t=e[n.jointName];if(t.visible){const e=t.position;n.position.copy(e),n.quaternion.copy(t.quaternion)}}}}}class A extends r.Object3D{constructor(e){super(),this.controller=e,this.motionController=null,this.envMap=null,this.mesh=null}updateMatrixWorld(e){super.updateMatrixWorld(e),this.motionController&&this.motionController.updateMesh()}}var S;const M=new class{constructor(e=null){this.gltfLoader=e,this.path="https://cdn.jsdelivr.net/npm/@webxr-input-profiles/assets@1.0/dist/profiles",this._assetCache={},this.gltfLoader||(this.gltfLoader=new(0,l.GLTFLoader))}createControllerModel(e){const t=new y;let n=null;return e.addEventListener("connected",(e=>{const s=e.data;"tracked-pointer"===s.targetRayMode&&s.gamepad&&m(s,this.path,"generic-trigger").then((({profile:e,assetPath:o})=>{t.motionController=new v(s,e,o);const i=this._assetCache[t.motionController.assetUrl];if(i)n=i.scene.clone(),w(t,n);else{if(!this.gltfLoader)throw new Error("GLTFLoader not set.");this.gltfLoader.setPath(""),this.gltfLoader.load(t.motionController.assetUrl,(e=>{this._assetCache[t.motionController.assetUrl]=e,n=e.scene.clone(),w(t,n)}),null,(()=>{throw new Error(`Asset ${t.motionController.assetUrl} missing or malformed.`)}))}})).catch((e=>{console.warn(e)}))})),e.addEventListener("disconnected",(()=>{t.motionController=null,t.remove(n),n=null})),t}},T=new class{constructor(){this.path=null}setPath(e){return this.path=e,this}createHandModel(e,t){const n=new A(e);return e.addEventListener("connected",(s=>{const o=s.data;o.hand&&!n.motionController&&(n.xrInputSource=o,void 0===t||"spheres"===t?n.motionController=new E(n,e,this.path,o.handedness,{primitive:"sphere"}):"boxes"===t?n.motionController=new E(n,e,this.path,o.handedness,{primitive:"box"}):"mesh"===t&&(n.motionController=new C(n,e,this.path,o.handedness))),e.visible=!0})),e.addEventListener("disconnected",(()=>{e.visible=!1})),n}};S=(e,t)=>{const n=[0,1].map((function(n){const s=e.xr.getController(n);t.add(s);const o=e.xr.getControllerGrip(n),i=M.createControllerModel(o);o.add(i),t.add(o);const a=e.xr.getHand(n);return a.add(T.createHandModel(a,"mesh")),t.add(a),{hand:a,grip:o,controller:s}})),s=n[0].controller,o=n[1].controller,i=n[0].hand,a=n[1].hand;return{controller1:s,controller2:o,controllerGrip1:n[0].grip,controllerGrip2:n[1].grip,hand1:i,hand2:a}};var P=o("6Awmu"),I=P.displayPainting;P.clearPaintings;let R,O,L;const j=new RegExp("^0x[a-fA-F0-9]{40}$"),U=new Proxy(new URLSearchParams(window.location.search),{get:(e,t)=>e.get(t)}),G=new(0,l.GLTFLoader),D=new r.Scene;let F=new r.PerspectiveCamera(75,window.innerWidth/window.innerHeight,.1,1e3);const k=new r.Group;k.add(F);const B=new r.WebGLRenderer({antialias:!0});function H(){F.aspect=window.innerWidth/window.innerHeight,F.updateProjectionMatrix(),B.setSize(window.innerWidth,window.innerHeight)}B.shadowMap.enabled=!0,D.background=new r.Color(135,206,235),B.setSize(window.innerWidth,window.innerHeight),B.xr.enabled=!0,window.init3d=e=>new Promise(((t,n)=>{const s=p.findById(e);console.log("Gallery Preset",s),G.load(s.location,(async function(e){R=e.scene,R.scale.set(s.scene.scale,s.scene.scale,s.scene.scale),R.position.set(s.scene.position.x,s.scene.position.y,s.scene.position.z),F.fov=s.camera.fov,F.updateProjectionMatrix(),F.position.set(s.camera.position.x,s.camera.position.y,s.camera.position.z),"function"==typeof s.postRenderModifier&&await s.postRenderModifier(R),D.add(R),D.add(k),B.xr.addEventListener("sessionstart",(function(){S(B,k)})),window.addEventListener("resize",H,!1),H(),B.setAnimationLoop((function(){B.render(D,F)})),t()}),(()=>{}),(e=>{console.log(e),n()})),document.body.appendChild(B.domElement),document.body.appendChild(d.createButton(B))})),window.loadGallery=async()=>{if(!j.test(U.g)&&"example"!==U.g)return alert("Invalid Gallery Address!");O=new(e(i))("https://testnet-rpc.coinex.net"),L=new O.eth.Contract(e(a),"example"===U.g?"0x1cF90b43Cb52478C4a066F57a1DFB1849C191048":U.g),h.show();const t=parseInt(await L.methods.getGalleryIndex().call()),n=await L.methods.getPaintings().call();console.log("Paintings",n),await init3d(t);for(const e in n)I(R,n[e].posX,n[e].posY,n[e].posZ,n[e].rotX,n[e].rotY,n[e].rotZ,n[e].width,n[e].aspect,n[e].url);h.hide()},loadGallery();
//# sourceMappingURL=gallery.9260b42f.js.map