(()=>{var I=class extends Array{},N="function";function L(e){return e instanceof I}var m=(e,t,...o)=>{let r=o.reduce((n,i)=>(Array.isArray(i)&&!L(i)?n.push(...i):n.push(i),n),[]);return new I(e,t||{},r)},w=(e,t="__r")=>{if(!L(e))return e;let[o,r,n]=e;r.key=r.key||t;let i=n.map((s,u)=>w(s,t+"c"+(s?.[1]?.key||u)));if(typeof o===N){let s=o({...r,children:i});return w(s,t+"e"+(s?.key||""))}return new I(o,r,i)},et=(e,t)=>{let[,o]=e._hic||[];return Object.entries(t).forEach(([r,n])=>{if(o&&typeof o[r]===N&&e.removeEventListener(r,o[r]),typeof n===N)e.addEventListener(r.toLowerCase(),n);else{if(r==="value"||r==="disabled"){e[r]=n;return}let i=e;i.getAttribute(r)!==n&&i.setAttribute(r,n)}}),e},rt=(e,t)=>{for(let o=t.length-1;o>=0;o--){let r=t[o],n=t[o+1]||null,i=r.nextSibling;(n!==i||!e.contains(r))&&e?.insertBefore(r,n)}for(;e.childNodes.length>t.length;)e?.removeChild(e.childNodes[0]);return e},F=(e,t)=>{let o=t;if(!e&&e!=="")return null;if(!L(e))return t?.nodeType!==3?document.createTextNode(e):(t.textContent!==e&&(t.textContent=e),t);let[r,n]=t?._hic||[],[i,s]=e;if(r!==i||!o){let a=s.xmlns||(i==="svg"?"http://www.w3.org/2000/svg":"http://www.w3.org/1999/xhtml");o=document.createElementNS(a,i)}et(o,s),o._hic=e;let c=(L(e)?e[2]:[]).filter(a=>a).map((a,f)=>{let g=t?.childNodes[f];return F(a,g)});return rt(o,c),t!==o&&t?.parentNode?.replaceChild(o,t),typeof s.ref===N&&s.ref!==n?.ref&&s.ref(o,s.key),o};function b(e,t,o){var r=e.createShader(t);e.shaderSource(r,o),e.compileShader(r);var n=e.getShaderParameter(r,e.COMPILE_STATUS);if(n)return r;console.log(e.getShaderInfoLog(r)),e.deleteShader(r)}function O(e,t,o){var r=e.createProgram();e.attachShader(r,t),e.attachShader(r,o),e.linkProgram(r);var n=e.getProgramParameter(r,e.LINK_STATUS);if(n)return r;console.log(e.getProgramInfoLog(r)),e.deleteProgram(r)}function j(e,t=!0){let o=e.clientWidth,r=e.clientHeight,n=t?o*2:o,i=t?r*2:r,s=e.width!==n||e.height!==i;return s&&(e.width=n,e.height=i),s}function V(e,t){return[1,0,0,0,1,0,e,t,1]}function ot(e){let t=Math.cos(e),o=Math.sin(e);return[t,-o,0,o,t,0,0,0,1]}function it(e,t){return[e,0,0,0,t,0,0,0,1]}function G(e,t){var o=e[0],r=e[0*3+1],n=e[0*3+2],i=e[1*3+0],s=e[1*3+1],u=e[1*3+2],c=e[2*3+0],a=e[2*3+1],f=e[2*3+2],g=t[0*3+0],A=t[0*3+1],S=t[0*3+2],x=t[1*3+0],l=t[1*3+1],p=t[1*3+2],d=t[2*3+0],h=t[2*3+1],y=t[2*3+2];return[g*o+A*i+S*c,g*r+A*s+S*a,g*n+A*u+S*f,x*o+l*i+p*c,x*r+l*s+p*a,x*n+l*u+p*f,d*o+h*i+y*c,d*r+h*s+y*a,d*n+h*u+y*f]}function _(e,t,o){return e*(1-o)+t*o}function P(e){let{x:t,y:o,rotation:r,scaleX:n,scaleY:i,originX:s,originY:u}=e,c=V(t,o),a=ot(r),f=it(n,i),g=V(-s,-u);return G(c,G(a,G(g,f)))}var nt=`#version 300 es

in vec2 a_texcoord;
in vec2 a_position;
uniform vec2 u_resolution;
uniform mat3 u_transform;

out vec2 v_texcoord;

void main() {
    vec2 position = (u_transform * vec3(a_position, 1)).xy;

    // convert the position from pixels to 0.0 to 1.0
    vec2 zeroToOne = position / u_resolution;

    // convert from 0->1 to 0->2
    vec2 zeroToTwo = zeroToOne * 2.0;

    vec2 clipSpace = zeroToTwo - 1.0;
    
    gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);
    v_texcoord = a_texcoord;
}
`,st=`#version 300 es
precision highp float;

in vec2 v_texcoord;
out vec4 outColor;
uniform float u_brightness;
uniform int u_sprite_idx;
uniform int u_sprite_count;
uniform sampler2D u_texture;

void main() {
    vec2 frame_texcoord = v_texcoord +
        vec2(float(u_sprite_idx) / float(u_sprite_count), 0);

    vec4 textureColor = texture(u_texture, frame_texcoord);
    vec4 brightenedColor = textureColor + u_brightness * vec4(1.0, 1.0, 1.0, 0.0);
    outColor = vec4(brightenedColor.rgb, textureColor.a);
}
`,B=class{gl=null;program=null;posA=null;texcoordA=null;resolutionU=null;brightnessU=null;transformU=null;spriteIdxU=null;spriteCountU=null;vao=null;sprites={};constructor(t){this.gl=t;let o=b(t,t.VERTEX_SHADER,nt),r=b(t,t.FRAGMENT_SHADER,st);this.program=O(t,o,r),this.posA=t.getAttribLocation(this.program,"a_position"),this.texcoordA=t.getAttribLocation(this.program,"a_texcoord"),this.resolutionU=t.getUniformLocation(this.program,"u_resolution"),this.brightnessU=t.getUniformLocation(this.program,"u_brightness"),this.transformU=t.getUniformLocation(this.program,"u_transform"),this.spriteIdxU=t.getUniformLocation(this.program,"u_sprite_idx"),this.spriteCountU=t.getUniformLocation(this.program,"u_sprite_count"),this.vao=t.createVertexArray();{t.bindVertexArray(this.vao);let n=t.createBuffer();t.bindBuffer(t.ARRAY_BUFFER,n),t.bufferData(t.ARRAY_BUFFER,new Float32Array([0,0,1,0,0,1,1,0,1,1,0,1]),t.STATIC_DRAW),t.enableVertexAttribArray(this.posA);let i=2,s=t.FLOAT,u=!1,c=0,a=0;t.vertexAttribPointer(this.posA,i,s,u,c,a)}{let n=t.createBuffer();t.bindBuffer(t.ARRAY_BUFFER,n),t.bufferData(t.ARRAY_BUFFER,new Float32Array([0,0,.5,0,0,1,.5,0,.5,1,0,1]),t.STATIC_DRAW),t.enableVertexAttribArray(this.texcoordA);let i=2,s=t.FLOAT,u=!1,c=0,a=0;t.vertexAttribPointer(this.texcoordA,i,s,u,c,a)}}loadSprite(t,o,r,n){let i=this.gl,s=i.createTexture();i.bindTexture(i.TEXTURE_2D,s),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_MAG_FILTER,i.NEAREST),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_WRAP_S,i.CLAMP_TO_EDGE),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_WRAP_T,i.CLAMP_TO_EDGE),i.texImage2D(i.TEXTURE_2D,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,new Uint8Array([0,0,255,255]));let u=new Image;u.src=t,u.addEventListener("load",()=>{i.bindTexture(i.TEXTURE_2D,s),i.texImage2D(i.TEXTURE_2D,0,i.RGBA,i.RGBA,i.UNSIGNED_BYTE,u),i.generateMipmap(i.TEXTURE_2D)}),this.sprites[t]={texture:s,url:t,origin:r,dimensions:o,frameCount:n}}getModelMatrix(t,o,r,n){return P({x:t,y:o,rotation:r,scaleX:this.sprites[n].dimensions[0],scaleY:this.sprites[n].dimensions[1],originX:this.sprites[n].origin[0],originY:this.sprites[n].origin[1]})}render(t,o,r){let{texture:n,frameCount:i}=this.sprites[o],{brightness:s,frame:u,modelMatrix:c}=r,a=this.gl;a.useProgram(this.program),a.bindVertexArray(this.vao),a.bindTexture(a.TEXTURE_2D,n),a.uniform2f(this.resolutionU,t.width,t.height),a.uniform1i(this.spriteIdxU,u),a.uniform1i(this.spriteCountU,i),a.uniform1f(this.brightnessU,s),a.uniformMatrix3fv(this.transformU,!1,c),a.drawArrays(a.TRIANGLES,0,6)}};var at=[-1,-1,1,-1,-1,1,1,-1,1,1,-1,1],lt=`#version 300 es

in vec2 a_position;

out vec2 v_texcoord;

void main() {
    gl_Position = vec4(a_position, 0.9, 1.);
}
`,ut=`#version 300 es
precision highp float;

#define SIZE 0.02
#define COLOR vec3(0.05, 0.05, 0.1)

uniform vec2 u_resolution;
uniform float u_time;
out vec4 outColor;

// got this from https://www.shadertoy.com/view/MdcfDj
float sinHash(vec2 p) {
	return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);   
}

vec3 layer(vec2 uv, float depth) {
    float t = u_time;

    // zoom
    uv = uv * depth;
    uv += t/3.;
    
    vec2 gridPos = floor(uv);
    vec2 relPos = uv - gridPos;
    
    float id = sinHash(gridPos+depth);
    float brightness = max(0., (sin(id*100000. + t)));
    relPos += vec2(-0.5);
    float xJimmy = (fract(id)) -0.5;
    float yJimmy = (fract(id*10.)) -0.5;
    relPos += vec2(xJimmy, yJimmy);
    //relPos += 0.1 * sin(u_time+id);
        
    // uv = vec2(0.1*sin(uv.x+u_time),0.1*cos(uv.y+t));
    
    vec3 col = vec3(0.);
    col += 1. - smoothstep(SIZE, SIZE + 0.003, length(relPos));
    return col * brightness;
}

void main() {
    vec2 uv = (gl_FragCoord.xy-0.5*u_resolution.xy)/u_resolution.y;
    
    // Apply multiple layers
    vec3 col = COLOR;
    col += layer(uv, 9.0);
    col += layer(uv, 15.0);

    // Output to screen
    outColor = vec4(col,1.0);
}`,X=class{gl=null;program=null;posA=null;resolutionU=null;timeU=null;vao=null;constructor(t){this.gl=t;let o=b(t,t.VERTEX_SHADER,lt),r=b(t,t.FRAGMENT_SHADER,ut);this.program=O(t,o,r),this.posA=t.getAttribLocation(this.program,"a_position"),this.resolutionU=t.getUniformLocation(this.program,"u_resolution"),this.timeU=t.getUniformLocation(this.program,"u_time"),this.vao=t.createVertexArray(),t.bindVertexArray(this.vao);let n=t.createBuffer();t.bindBuffer(t.ARRAY_BUFFER,n),t.bufferData(t.ARRAY_BUFFER,new Float32Array(at),t.STATIC_DRAW),t.enableVertexAttribArray(this.posA);let i=2,s=t.FLOAT,u=!1,c=0,a=0;t.vertexAttribPointer(this.posA,i,s,u,c,a)}render(t,o){let r=this.gl;r.useProgram(this.program),r.bindVertexArray(this.vao),r.uniform2f(this.resolutionU,o.width,o.height),r.uniform1f(this.timeU,t/2e3),r.drawArrays(r.TRIANGLES,0,6)}};var Y=class{tokens=[];raw="";idx=0;constructor(t){this.raw=t}isAtEnd(){return this.idx>=this.raw.length}},K=e=>e>="a"&&e<="z"||e>="A"&&e<="Z"||e>="0"&&e<="9",ct=e=>e>="0"&&e<="9",dt=e=>e===`
`||e===" "||e==="	",ht=e=>t=>{let o=t.idx;for(;!e(t);){if(t.isAtEnd())return t.idx=o,null;t.idx++}let r=t.idx;return t.idx=o,{start:o,end:r}},pt=()=>e=>e.isAtEnd()?{start:e.idx,end:e.idx}:null,C=e=>t=>{let o=t.idx,r=o;for(;e(t.raw[r])&&t.raw[r]!==void 0;)r++;if(r>o)return{start:o,end:r}},M=e=>t=>e(t)||{start:t.idx,end:t.idx},mt=C(K),k=C(ct),W=e=>t=>{if(e(t.raw[t.idx]))return{start:t.idx,end:t.idx+1}},It=W(dt),E=e=>W(t=>t===e),$=W(e=>!K(e)),U=e=>{let t=[];for(let o=0;o<e.length;o++)t.push(E(e[o]));return T(...t)},T=(...e)=>t=>{let o=t.idx,r=0;for(let n=0;n<e.length;n++){let i=e[n](t);if(!i)return t.idx=o,null;t.idx+=i.end-i.start,r+=i.end-i.start}return t.idx=o,{start:t.idx,end:t.idx+r}},ft=e=>t=>{let o=t.idx,r=e(t);if(r)return t.idx+=r.end-r.start,{start:o,end:o}},H=(e,t)=>o=>{let r=e(o);if(r)return r.type=t,r.parser=e,o.tokens.push(r),o.idx=r.end,r},xt=e=>t=>{for(;t.raw[t.idx]!==void 0;)e(t)},R=(...e)=>t=>{for(let o=0;o<e.length;o++){let r=e[o](t);if(r)return r}},Z=e=>t=>{let o=e(t);if(o)return{...o,end:o.start}},gt=(e,t=1)=>o=>{let r=o.idx;if(o.idx=o.idx-t,!e(o)){o.idx=r;return}return o.idx=r,{start:r,end:r}},vt=()=>e=>({start:e.idx,end:e.idx+1}),wt=T(mt,Z(E("("))),Pt=R(T(U("//"),M(C(e=>e!==`
`))),T(U("/*"),ht(R(U("*/"),pt())),M(U("*/")))),yt=R(T(E('"'),M(C(e=>e!=='"')),E('"')),T(E("'"),M(C(e=>e!=="'")),E("'"))),_t=T(k,M(E(".")),M(k)),Tt=e=>e.idx===0?{start:0,end:0}:null,At=e=>e.idx===e.raw.length?{start:e.idx,end:e.idx}:null,q=e=>T(R(Tt,gt($)),U(e),Z(R(At,$))),Q=xt(R(H(yt,"STRING"),H(_t,"NUMBER"),H(q("null"),"KEYWORD"),H(q("undefined"),"KEYWORD"),ft(vt())));var Et=({value:e})=>m("pre",{class:"editor_draw"},m("code",null,(()=>{let o=new Y(e);return parseResult=Q(o),o.tokens.length===0?[e]:o.tokens.reduce((r,n,i,s)=>{let c=s[i-1]?.end||0;n.start>c&&r.push(e.slice(c,n.start));let a=`parsed_${n.type}`,f=e.slice(n.start,n.end);return r.push(m("span",{class:a},f)),i===s.length-1&&r.push(e.slice(n.end)),r},[])})())),tt=({currentIndex:e,timeline:t,isExpanded:o,onExpandClick:r})=>{if(!o)return m("div",{id:"timeline-controls"},m("p",null,"Click ",m("button",{class:"inline",click:r},"here")," to show the JSON timeline."));let n=t.map((i,s)=>m("div",{class:"timeline-row",style:`opacity: ${s===e?1:.5};`},m(Et,{value:JSON.stringify(i)})));return m("div",{id:"timeline-controls"},m("p",null,"Click ",m("button",{class:"inline",click:r},"here")," to hide the JSON timeline."),m("div",{id:"timeline-rows-container"},n))};var z=[{missiles:{1:{x:100,y:200,rotation:5*Math.PI/4},2:{x:400,y:-100,rotation:Math.PI}},ships:{0:{x:100,y:300,health:100,rotation:3*Math.PI/2}}},{missiles:{1:{x:200,y:300,rotation:5*Math.PI/4},2:{x:400,y:0,rotation:Math.PI}},ships:{0:{x:200,y:300,health:100,rotation:3.5*Math.PI/2}}},{missiles:{2:{x:400,y:100,rotation:Math.PI}},ships:{0:{x:300,y:250,health:50,rotation:2*Math.PI}}},{missiles:{2:{x:400,y:200,rotation:Math.PI}},ships:{0:{x:400,y:200,health:50,rotation:2*Math.PI+Math.PI/4}}},{missiles:{},ships:{0:{x:500,y:180,health:20,rotation:2*Math.PI+2*Math.PI/4,thrusters:!0}}},{missiles:{},ships:{0:{x:600,y:150,health:20,rotation:2*Math.PI+3*Math.PI/4,thrusters:!0}}},{missiles:{},ships:{0:{x:600,y:150,health:20,rotation:2*Math.PI+3*Math.PI/4,thrusters:!0}}},{missiles:{},ships:{0:{x:600,y:150,health:20,rotation:2*Math.PI+3*Math.PI/4,thrusters:!0}}}];function St(){let e=document.getElementById("example-timeline-ships"),t=e.getContext("webgl2");t||console.error("Failed to init webgl."),t.disable(t.DEPTH_TEST),t.blendFunc(t.SRC_ALPHA,t.ONE_MINUS_SRC_ALPHA),t.enable(t.BLEND),j(e,!0);let o=new X(t),r=new B(t);r.loadSprite("resources/ship.png",[100,100],[50,50],2),r.loadSprite("resources/missile.png",[30,60],[15,15],2),r.loadSprite("resources/jet.png",[32,40],[16,0],2);let n={frameIdx:0,missiles:{1:{x:200,y:50,rotation:Math.PI},2:{x:400,y:-100,rotation:Math.PI}},ships:{0:{x:200,y:200,brightness:0,rotation:0,health:100,frame:0}}};function i(){let x=(n.ships[0].x-50)/2,l=(n.ships[0].y-50)/2,p=50*(n.ships[0].health/100),d=`left: ${x}px; width: ${p}px; top: ${l}px;`;F(w(m("div",{id:"example-timeline-ships-gui"},m("div",{class:"health-bar-background",style:d}),m("div",{class:"health-bar",style:d}))),document.getElementById("example-timeline-ships-gui"))}let s=!1;function u(){s=!s,c()}function c(){F(w(m(tt,{currentIndex:n.frameIdx,onExpandClick:u,isExpanded:s,timeline:z})),document.getElementById("timeline-controls"))}c();function a(x){let l=z[n.frameIdx],p=l.ships[0],d=x*.001,h=n.ships[0];h.x=_(h.x,p.x,5*d),h.y=_(h.y,p.y,5*d),h.rotation=_(h.rotation,p.rotation,5*d),h.health=_(h.health,p.health,20*d),h.health/p.health>1.01?h.brightness=1:h.brightness=0,h.thrusters=p.thrusters,Object.entries(l.missiles).forEach(([y,v])=>{n.missiles[y]||(n.missiles[y]={x:v.x,y:v.y,rotation:v.rotation})}),Object.entries(n.missiles).forEach(([y,v])=>{let D=l.missiles[y];if(D===void 0){delete n.missiles[y];return}v.x=_(v.x,D.x,5*d),v.y=_(v.y,D.y,5*d),v.rotation=_(v.rotation,D.rotation,5*d)})}function f(x){t.viewport(0,0,e.width,e.height),t.clearColor(0,0,0,0),t.clear(t.COLOR_BUFFER_BIT),o.render(x,e);let l=n.ships[0];if(l.thrusters){let d=P({x:l.x,y:l.y,rotation:l.rotation,scaleX:32,scaleY:40,originX:38,originY:-38}),h=P({x:l.x,y:l.y,rotation:l.rotation,scaleX:32,scaleY:40,originX:16-20,originY:-38});r.render(e,"resources/jet.png",{...l,brightness:0,modelMatrix:d}),r.render(e,"resources/jet.png",{...l,brightness:0,modelMatrix:h})}let p=r.getModelMatrix(l.x,l.y,l.rotation,"resources/ship.png");r.render(e,"resources/ship.png",{modelMatrix:p,brightness:l.brightness,frame:l.frame}),Object.values(n.missiles).forEach(d=>{let h=r.getModelMatrix(d.x,d.y,d.rotation,"resources/missile.png");r.render(e,"resources/missile.png",{...d,modelMatrix:h,brightness:0,frame:0})}),i()}let g=0,A=0,S=0;window.requestAnimationFrame(function x(l){let p=l-S;p>500&&(p=10),l-g>200&&(n.frameIdx=(n.frameIdx+1)%z.length,g=l,c()),l-A>200&&(n.ships[0].frame=(n.ships[0].frame+1)%2,A=l),a(p),f(l),window.requestAnimationFrame(x),S=l})}window.onload=function(){St()};})();
