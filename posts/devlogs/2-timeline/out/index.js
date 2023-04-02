(()=>{var b=class extends Array{},U="function";function M(e){return e instanceof b}var x=(e,t,...o)=>{let r=o.reduce((n,i)=>(Array.isArray(i)&&!M(i)?n.push(...i):n.push(i),n),[]);return new b(e,t||{},r)},I=(e,t="__r")=>{if(!M(e))return e;let[o,r,n]=e;r.key=r.key||t;let i=n.map((s,c)=>I(s,t+"c"+(s?.[1]?.key||c)));if(typeof o===U){let s=o({...r,children:i});return I(s,t+"e"+(s?.key||""))}return new b(o,r,i)},tt=(e,t)=>{let[,o]=e._hic||[];return Object.entries(t).forEach(([r,n])=>{if(o&&typeof o[r]===U&&e.removeEventListener(r,o[r]),typeof n===U)e.addEventListener(r.toLowerCase(),n);else{if(r==="value"||r==="disabled"){e[r]=n;return}let i=e;i.getAttribute(r)!==n&&i.setAttribute(r,n)}}),e},et=(e,t)=>{for(let o=t.length-1;o>=0;o--){let r=t[o],n=t[o+1]||null,i=r.nextSibling;(n!==i||!e.contains(r))&&e?.insertBefore(r,n)}for(;e.childNodes.length>t.length;)e?.removeChild(e.childNodes[0]);return e},C=(e,t)=>{let o=t;if(!e&&e!=="")return null;if(!M(e))return t?.nodeType!==3?document.createTextNode(e):(t.textContent!==e&&(t.textContent=e),t);let[r,n]=t?._hic||[],[i,s]=e;if(r!==i||!o){let u=s.xmlns||(i==="svg"?"http://www.w3.org/2000/svg":"http://www.w3.org/1999/xhtml");o=document.createElementNS(u,i)}tt(o,s),o._hic=e;let p=(M(e)?e[2]:[]).filter(u=>u).map((u,f)=>{let d=t?.childNodes[f];return C(u,d)});return et(o,p),t!==o&&t?.parentNode?.replaceChild(o,t),typeof s.ref===U&&s.ref!==n?.ref&&s.ref(o,s.key),o};function A(e,t,o){var r=e.createShader(t);e.shaderSource(r,o),e.compileShader(r);var n=e.getShaderParameter(r,e.COMPILE_STATUS);if(n)return r;console.log(e.getShaderInfoLog(r)),e.deleteShader(r)}function N(e,t,o){var r=e.createProgram();e.attachShader(r,t),e.attachShader(r,o),e.linkProgram(r);var n=e.getProgramParameter(r,e.LINK_STATUS);if(n)return r;console.log(e.getProgramInfoLog(r)),e.deleteProgram(r)}function V(e,t=!0){let o=e.clientWidth,r=e.clientHeight,n=t?o*2:o,i=t?r*2:r,s=e.width!==n||e.height!==i;return s&&(e.width=n,e.height=i),s}function X(e,t){return[1,0,0,0,1,0,e,t,1]}function Y(e){let t=Math.cos(e),o=Math.sin(e);return[t,-o,0,o,t,0,0,0,1]}function J(e,t){return[e,0,0,0,t,0,0,0,1]}function D(e,t){var o=e[0],r=e[0*3+1],n=e[0*3+2],i=e[1*3+0],s=e[1*3+1],c=e[1*3+2],p=e[2*3+0],u=e[2*3+1],f=e[2*3+2],d=t[0*3+0],l=t[0*3+1],a=t[0*3+2],m=t[1*3+0],h=t[1*3+1],g=t[1*3+2],S=t[2*3+0],R=t[2*3+1],z=t[2*3+2];return[d*o+l*i+a*p,d*r+l*s+a*u,d*n+l*c+a*f,m*o+h*i+g*p,m*r+h*s+g*u,m*n+h*c+g*f,S*o+R*i+z*p,S*r+R*s+z*u,S*n+R*c+z*f]}function v(e,t,o){return e*(1-o)+t*o}var rt=`#version 300 es

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
`,ot=`#version 300 es
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
`,L=class{gl=null;program=null;posA=null;texcoordA=null;resolutionU=null;brightnessU=null;transformU=null;spriteIdxU=null;spriteCountU=null;vao=null;sprites={};constructor(t){this.gl=t;let o=A(t,t.VERTEX_SHADER,rt),r=A(t,t.FRAGMENT_SHADER,ot);this.program=N(t,o,r),this.posA=t.getAttribLocation(this.program,"a_position"),this.texcoordA=t.getAttribLocation(this.program,"a_texcoord"),this.resolutionU=t.getUniformLocation(this.program,"u_resolution"),this.brightnessU=t.getUniformLocation(this.program,"u_brightness"),this.transformU=t.getUniformLocation(this.program,"u_transform"),this.spriteIdxU=t.getUniformLocation(this.program,"u_sprite_idx"),this.spriteCountU=t.getUniformLocation(this.program,"u_sprite_count"),this.vao=t.createVertexArray();{t.bindVertexArray(this.vao);let n=t.createBuffer();t.bindBuffer(t.ARRAY_BUFFER,n),t.bufferData(t.ARRAY_BUFFER,new Float32Array([0,0,1,0,0,1,1,0,1,1,0,1]),t.STATIC_DRAW),t.enableVertexAttribArray(this.posA);let i=2,s=t.FLOAT,c=!1,p=0,u=0;t.vertexAttribPointer(this.posA,i,s,c,p,u)}{let n=t.createBuffer();t.bindBuffer(t.ARRAY_BUFFER,n),t.bufferData(t.ARRAY_BUFFER,new Float32Array([0,0,.5,0,0,1,.5,0,.5,1,0,1]),t.STATIC_DRAW),t.enableVertexAttribArray(this.texcoordA);let i=2,s=t.FLOAT,c=!1,p=0,u=0;t.vertexAttribPointer(this.texcoordA,i,s,c,p,u)}}loadSprite(t,o,r,n){let i=this.gl,s=i.createTexture();i.bindTexture(i.TEXTURE_2D,s),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_MAG_FILTER,i.NEAREST),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_WRAP_S,i.CLAMP_TO_EDGE),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_WRAP_T,i.CLAMP_TO_EDGE),i.texImage2D(i.TEXTURE_2D,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,new Uint8Array([0,0,255,255]));let c=new Image;c.src=t,c.addEventListener("load",()=>{i.bindTexture(i.TEXTURE_2D,s),i.texImage2D(i.TEXTURE_2D,0,i.RGBA,i.RGBA,i.UNSIGNED_BYTE,c),i.generateMipmap(i.TEXTURE_2D)}),this.sprites[t]={texture:s,url:t,origin:r,dimensions:o,frameCount:n}}render(t,o,r){let{dimensions:n,origin:i,texture:s,frameCount:c}=this.sprites[o],{brightness:p,x:u,y:f,rotation:d,frame:l}=r,a=this.gl;a.useProgram(this.program),a.bindVertexArray(this.vao),a.bindTexture(a.TEXTURE_2D,s),a.uniform2f(this.resolutionU,t.width,t.height);let m=X(u,f),h=Y(d),g=J(n[0],n[1]),S=X(-i[0],-i[1]),R=D(m,D(h,D(S,g)));a.uniform1i(this.spriteIdxU,l),a.uniform1i(this.spriteCountU,c),a.uniform1f(this.brightnessU,p),a.uniformMatrix3fv(this.transformU,!1,R),a.drawArrays(a.TRIANGLES,0,6)}};var it=[-1,-1,1,-1,-1,1,1,-1,1,1,-1,1],nt=`#version 300 es

in vec2 a_position;

out vec2 v_texcoord;

void main() {
    gl_Position = vec4(a_position, 0.9, 1.);
}
`,st=`#version 300 es
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
}`,F=class{gl=null;program=null;posA=null;resolutionU=null;timeU=null;vao=null;constructor(t){this.gl=t;let o=A(t,t.VERTEX_SHADER,nt),r=A(t,t.FRAGMENT_SHADER,st);this.program=N(t,o,r),this.posA=t.getAttribLocation(this.program,"a_position"),this.resolutionU=t.getUniformLocation(this.program,"u_resolution"),this.timeU=t.getUniformLocation(this.program,"u_time"),this.vao=t.createVertexArray(),t.bindVertexArray(this.vao);let n=t.createBuffer();t.bindBuffer(t.ARRAY_BUFFER,n),t.bufferData(t.ARRAY_BUFFER,new Float32Array(it),t.STATIC_DRAW),t.enableVertexAttribArray(this.posA);let i=2,s=t.FLOAT,c=!1,p=0,u=0;t.vertexAttribPointer(this.posA,i,s,c,p,u)}render(t,o){let r=this.gl;r.useProgram(this.program),r.bindVertexArray(this.vao),r.uniform2f(this.resolutionU,o.width,o.height),r.uniform1f(this.timeU,t/2e3),r.drawArrays(r.TRIANGLES,0,6)}};var B=class{tokens=[];raw="";idx=0;constructor(t){this.raw=t}isAtEnd(){return this.idx>=this.raw.length}},K=e=>e>="a"&&e<="z"||e>="A"&&e<="Z"||e>="0"&&e<="9",at=e=>e>="0"&&e<="9",lt=e=>e===`
`||e===" "||e==="	",ut=e=>t=>{let o=t.idx;for(;!e(t);){if(t.isAtEnd())return t.idx=o,null;t.idx++}let r=t.idx;return t.idx=o,{start:o,end:r}},ct=()=>e=>e.isAtEnd()?{start:e.idx,end:e.idx}:null,P=e=>t=>{let o=t.idx,r=o;for(;e(t.raw[r])&&t.raw[r]!==void 0;)r++;if(r>o)return{start:o,end:r}},E=e=>t=>e(t)||{start:t.idx,end:t.idx},dt=P(K),j=P(at),W=e=>t=>{if(e(t.raw[t.idx]))return{start:t.idx,end:t.idx+1}},St=W(lt),y=e=>W(t=>t===e),$=W(e=>!K(e)),w=e=>{let t=[];for(let o=0;o<e.length;o++)t.push(y(e[o]));return _(...t)},_=(...e)=>t=>{let o=t.idx,r=0;for(let n=0;n<e.length;n++){let i=e[n](t);if(!i)return t.idx=o,null;t.idx+=i.end-i.start,r+=i.end-i.start}return t.idx=o,{start:t.idx,end:t.idx+r}},ht=e=>t=>{let o=t.idx,r=e(t);if(r)return t.idx+=r.end-r.start,{start:o,end:o}},O=(e,t)=>o=>{let r=e(o);if(r)return r.type=t,r.parser=e,o.tokens.push(r),o.idx=r.end,r},pt=e=>t=>{for(;t.raw[t.idx]!==void 0;)e(t)},T=(...e)=>t=>{for(let o=0;o<e.length;o++){let r=e[o](t);if(r)return r}},Z=e=>t=>{let o=e(t);if(o)return{...o,end:o.start}},mt=(e,t=1)=>o=>{let r=o.idx;if(o.idx=o.idx-t,!e(o)){o.idx=r;return}return o.idx=r,{start:r,end:r}},ft=()=>e=>({start:e.idx,end:e.idx+1}),Rt=_(dt,Z(y("("))),bt=T(_(w("//"),E(P(e=>e!==`
`))),_(w("/*"),ut(T(w("*/"),ct())),E(w("*/")))),xt=T(_(y('"'),E(P(e=>e!=='"')),y('"')),_(y("'"),E(P(e=>e!=="'")),y("'"))),gt=_(j,E(y(".")),E(j)),vt=e=>e.idx===0?{start:0,end:0}:null,_t=e=>e.idx===e.raw.length?{start:e.idx,end:e.idx}:null,k=e=>_(T(vt,mt($)),w(e),Z(T(_t,$))),q=pt(T(O(xt,"STRING"),O(gt,"NUMBER"),O(k("null"),"KEYWORD"),O(k("undefined"),"KEYWORD"),ht(ft())));var Q=({value:e})=>x("pre",{class:"editor_draw"},x("code",null,(()=>{let o=new B(e);return parseResult=q(o),o.tokens.length===0?[e]:o.tokens.reduce((r,n,i,s)=>{let p=s[i-1]?.end||0;n.start>p&&r.push(e.slice(p,n.start));let u=`parsed_${n.type}`,f=e.slice(n.start,n.end);return r.push(x("span",{class:u},f)),i===s.length-1&&r.push(e.slice(n.end)),r},[])})()));var H=[{missiles:{1:{x:100,y:200,rotation:5*Math.PI/4},2:{x:400,y:-100,rotation:Math.PI}},ships:{0:{x:100,y:300,health:100,rotation:3*Math.PI/2}}},{missiles:{1:{x:200,y:300,rotation:5*Math.PI/4},2:{x:400,y:0,rotation:Math.PI}},ships:{0:{x:200,y:300,health:100,rotation:3.5*Math.PI/2}}},{missiles:{2:{x:400,y:100,rotation:Math.PI}},ships:{0:{x:300,y:250,health:50,rotation:2*Math.PI}}},{missiles:{2:{x:400,y:200,rotation:Math.PI}},ships:{0:{x:400,y:200,health:50,rotation:2*Math.PI+Math.PI/4}}},{missiles:{},ships:{0:{x:500,y:180,health:20,rotation:2*Math.PI+2*Math.PI/4}}},{missiles:{},ships:{0:{x:600,y:150,health:20,rotation:2*Math.PI+3*Math.PI/4}}},{missiles:{},ships:{0:{x:600,y:150,health:20,rotation:2*Math.PI+3*Math.PI/4}}},{missiles:{},ships:{0:{x:600,y:150,health:20,rotation:2*Math.PI+3*Math.PI/4}}}];function yt(){let e=document.getElementById("example-timeline-ships"),t=e.getContext("webgl2");t||console.error("Failed to init webgl."),t.disable(t.DEPTH_TEST),t.blendFunc(t.SRC_ALPHA,t.ONE_MINUS_SRC_ALPHA),t.enable(t.BLEND),V(e,!0);let o=new F(t),r=new L(t);r.loadSprite("resources/ship.png",[100,100],[50,50],2),r.loadSprite("resources/missile.png",[30,60],[15,15],2);let n={frameIdx:0,missiles:{1:{x:200,y:50,rotation:Math.PI},2:{x:400,y:-100,rotation:Math.PI}},ships:{0:{x:200,y:200,brightness:0,rotation:0,health:100,frame:0}}};function i(){let d=(n.ships[0].x-50)/2,l=(n.ships[0].y-50)/2,a=50*(n.ships[0].health/100),m=`left: ${d}px; width: ${a}px; top: ${l}px;`;C(I(x("div",{id:"example-timeline-ships-gui"},x("div",{class:"health-bar-background",style:m}),x("div",{class:"health-bar",style:m}))),document.getElementById("example-timeline-ships-gui"))}function s(){let d=H.map((a,m)=>{let h=`opacity: ${m===n.frameIdx?1:.5};`;return x("div",{class:"timeline-row",style:h},x(Q,{value:JSON.stringify(a)}))});C(I(x("div",{id:"timeline-controls"},d)),document.getElementById("timeline-controls"))}s();function c(){let d=H[n.frameIdx],l=d.ships[0],a=n.ships[0];a.x=v(a.x,l.x,.1),a.y=v(a.y,l.y,.1),a.health=v(a.health,l.health,.5),a.rotation=v(a.rotation,l.rotation,.1),a.health>l.health?a.brightness=1-l.health/a.health:a.brightness=0,Object.entries(d.missiles).forEach(([m,h])=>{n.missiles[m]||(n.missiles[m]={x:h.x,y:h.y,rotation:h.rotation})}),Object.entries(n.missiles).forEach(([m,h])=>{let g=d.missiles[m];if(g===void 0){delete n.missiles[m];return}h.x=v(h.x,g.x,.1),h.y=v(h.y,g.y,.1),h.rotation=v(h.rotation,g.rotation,.1)})}function p(d){t.viewport(0,0,e.width,e.height),t.clearColor(0,0,0,0),t.clear(t.COLOR_BUFFER_BIT),o.render(d,e),r.render(e,"resources/ship.png",n.ships[0]),Object.values(n.missiles).forEach(l=>{r.render(e,"resources/missile.png",{...l,brightness:0,frame:0})}),i()}let u=0,f=0;window.requestAnimationFrame(function d(l){l-u>200&&(n.frameIdx=(n.frameIdx+1)%H.length,u=l,s()),l-f>200&&(n.ships[0].frame=(n.ships[0].frame+1)%2,f=l),c(),p(l),window.requestAnimationFrame(d)})}window.onload=function(){yt()};})();
