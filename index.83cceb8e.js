var e="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:"undefined"!=typeof window?window:"undefined"!=typeof global?global:{},n={},t={},i=e.parcelRequire4141;null==i&&((i=function(e){if(e in n)return n[e].exports;if(e in t){var i=t[e];delete t[e];var o={id:e,exports:{}};return n[e]=o,i.call(o.exports,o,o.exports),o.exports}var r=new Error("Cannot find module '"+e+"'");throw r.code="MODULE_NOT_FOUND",r}).register=function(e,n){t[e]=n},e.parcelRequire4141=i);var o=i("ilwiq");const r=new(0,i("7lx9d").GLTFLoader),a=new o.Scene,d=new o.PerspectiveCamera(50,window.innerWidth/window.innerHeight,.1,1e3),l=new o.WebGLRenderer({canvas:document.querySelector("#litle-verse"),alpha:!0,antialias:!0});function s(){const e=l.domElement,n=e.clientWidth,t=e.clientHeight;e.width===n&&e.height===t||(l.setSize(n,t,!1),d.aspect=n/t,d.updateProjectionMatrix())}let c;l.shadowMap.enabled=!0,l.shadowMap.type=o.PCFSoftShadowMap,r.load("assets/gallery-2/scene.gltf",(function(e){c=e.scene,a.add(c),s()}),(e=>{}),(e=>{console.log(e)})),d.position.setZ(160),d.position.setY(50),window.addEventListener("resize",s,!1),s(),function e(){requestAnimationFrame(e),c&&(c.rotation.y+=.003*Math.sin((new Date).getTime()/1e4)),l.render(a,d)}();
//# sourceMappingURL=index.83cceb8e.js.map