(()=>{var b=class extends Array{},U="function";function w(e){return e instanceof b}var x=(e,t,...o)=>{let r=o.reduce((i,n)=>(Array.isArray(n)&&!w(n)?i.push(...n):i.push(n),i),[]);return new b(e,t||{},r)},M=(e,t="__r")=>{if(!w(e))return e;let[o,r,i]=e;r.key=r.key||t;let n=i.map((s,d)=>M(s,t+"c"+(s?.[1]?.key||d)));if(typeof o===U){let s=o({...r,children:n});return M(s,t+"e"+(s?.key||""))}return new b(o,r,n)},tt=(e,t)=>{let[,o]=e._hic||[];return Object.entries(t).forEach(([r,i])=>{if(o&&typeof o[r]===U&&e.removeEventListener(r,o[r]),typeof i===U)e.addEventListener(r.toLowerCase(),i);else{if(r==="value"||r==="disabled"){e[r]=i;return}let n=e;n.getAttribute(r)!==i&&n.setAttribute(r,i)}}),e},et=(e,t)=>{for(let o=t.length-1;o>=0;o--){let r=t[o],i=t[o+1]||null,n=r.nextSibling;(i!==n||!e.contains(r))&&e?.insertBefore(r,i)}for(;e.childNodes.length>t.length;)e?.removeChild(e.childNodes[0]);return e},z=(e,t)=>{let o=t;if(!e&&e!=="")return null;if(!w(e))return t?.nodeType!==3?document.createTextNode(e):(t.textContent!==e&&(t.textContent=e),t);let[r,i]=t?._hic||[],[n,s]=e;if(r!==n||!o){let u=s.xmlns||(n==="svg"?"http://www.w3.org/2000/svg":"http://www.w3.org/1999/xhtml");o=document.createElementNS(u,n)}tt(o,s),o._hic=e;let h=(w(e)?e[2]:[]).filter(u=>u).map((u,c)=>{let l=t?.childNodes[c];return z(u,l)});return et(o,h),t!==o&&t?.parentNode?.replaceChild(o,t),typeof s.ref===U&&s.ref!==i?.ref&&s.ref(o,s.key),o};function _(e,t,o){var r=e.createShader(t);e.shaderSource(r,o),e.compileShader(r);var i=e.getShaderParameter(r,e.COMPILE_STATUS);if(i)return r;console.log(e.getShaderInfoLog(r)),e.deleteShader(r)}function C(e,t,o){var r=e.createProgram();e.attachShader(r,t),e.attachShader(r,o),e.linkProgram(r);var i=e.getProgramParameter(r,e.LINK_STATUS);if(i)return r;console.log(e.getProgramInfoLog(r)),e.deleteProgram(r)}function V(e,t=!0){let o=e.clientWidth,r=e.clientHeight,i=t?o*2:o,n=t?r*2:r,s=e.width!==i||e.height!==n;return s&&(e.width=i,e.height=n),s}function X(e,t){return[1,0,0,0,1,0,e,t,1]}function Y(e){let t=Math.cos(e),o=Math.sin(e);return[t,-o,0,o,t,0,0,0,1]}function J(e,t){return[e,0,0,0,t,0,0,0,1]}function N(e,t){var o=e[0],r=e[0*3+1],i=e[0*3+2],n=e[1*3+0],s=e[1*3+1],d=e[1*3+2],h=e[2*3+0],u=e[2*3+1],c=e[2*3+2],l=t[0*3+0],p=t[0*3+1],a=t[0*3+2],m=t[1*3+0],E=t[1*3+1],T=t[1*3+2],S=t[2*3+0],R=t[2*3+1],H=t[2*3+2];return[l*o+p*n+a*h,l*r+p*s+a*u,l*i+p*d+a*c,m*o+E*n+T*h,m*r+E*s+T*u,m*i+E*d+T*c,S*o+R*n+H*h,S*r+R*s+H*u,S*i+R*d+H*c]}function f(e,t,o){return e*(1-o)+t*o}var rt=`#version 300 es

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
`,D=class{gl=null;program=null;posA=null;texcoordA=null;resolutionU=null;brightnessU=null;transformU=null;spriteIdxU=null;spriteCountU=null;vao=null;sprites={};constructor(t){this.gl=t;let o=_(t,t.VERTEX_SHADER,rt),r=_(t,t.FRAGMENT_SHADER,ot);this.program=C(t,o,r),this.posA=t.getAttribLocation(this.program,"a_position"),this.texcoordA=t.getAttribLocation(this.program,"a_texcoord"),this.resolutionU=t.getUniformLocation(this.program,"u_resolution"),this.brightnessU=t.getUniformLocation(this.program,"u_brightness"),this.transformU=t.getUniformLocation(this.program,"u_transform"),this.spriteIdxU=t.getUniformLocation(this.program,"u_sprite_idx"),this.spriteCountU=t.getUniformLocation(this.program,"u_sprite_count"),this.vao=t.createVertexArray();{t.bindVertexArray(this.vao);let i=t.createBuffer();t.bindBuffer(t.ARRAY_BUFFER,i),t.bufferData(t.ARRAY_BUFFER,new Float32Array([0,0,1,0,0,1,1,0,1,1,0,1]),t.STATIC_DRAW),t.enableVertexAttribArray(this.posA);let n=2,s=t.FLOAT,d=!1,h=0,u=0;t.vertexAttribPointer(this.posA,n,s,d,h,u)}{let i=t.createBuffer();t.bindBuffer(t.ARRAY_BUFFER,i),t.bufferData(t.ARRAY_BUFFER,new Float32Array([0,0,.5,0,0,1,.5,0,.5,1,0,1]),t.STATIC_DRAW),t.enableVertexAttribArray(this.texcoordA);let n=2,s=t.FLOAT,d=!1,h=0,u=0;t.vertexAttribPointer(this.texcoordA,n,s,d,h,u)}}loadSprite(t,o,r,i){let n=this.gl,s=n.createTexture();n.bindTexture(n.TEXTURE_2D,s),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_MIN_FILTER,n.NEAREST),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_MAG_FILTER,n.NEAREST),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_WRAP_S,n.CLAMP_TO_EDGE),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_WRAP_T,n.CLAMP_TO_EDGE),n.texImage2D(n.TEXTURE_2D,0,n.RGBA,1,1,0,n.RGBA,n.UNSIGNED_BYTE,new Uint8Array([0,0,255,255]));let d=new Image;d.src=t,d.addEventListener("load",()=>{n.bindTexture(n.TEXTURE_2D,s),n.texImage2D(n.TEXTURE_2D,0,n.RGBA,n.RGBA,n.UNSIGNED_BYTE,d),n.generateMipmap(n.TEXTURE_2D)}),this.sprites[t]={texture:s,url:t,origin:r,dimensions:o,frameCount:i}}render(t,o,r){let{dimensions:i,origin:n,texture:s,frameCount:d}=this.sprites[o],{brightness:h,x:u,y:c,rotation:l,frame:p}=r,a=this.gl;a.useProgram(this.program),a.bindVertexArray(this.vao),a.bindTexture(a.TEXTURE_2D,s),a.uniform2f(this.resolutionU,t.width,t.height);let m=X(u,c),E=Y(l),T=J(i[0],i[1]),S=X(-n[0],-n[1]),R=N(m,N(E,N(S,T)));a.uniform1i(this.spriteIdxU,p),a.uniform1i(this.spriteCountU,d),a.uniform1f(this.brightnessU,h),a.uniformMatrix3fv(this.transformU,!1,R),a.drawArrays(a.TRIANGLES,0,6)}};var nt=[-1,-1,1,-1,-1,1,1,-1,1,1,-1,1],it=`#version 300 es

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
}`,L=class{gl=null;program=null;posA=null;resolutionU=null;timeU=null;vao=null;constructor(t){this.gl=t;let o=_(t,t.VERTEX_SHADER,it),r=_(t,t.FRAGMENT_SHADER,st);this.program=C(t,o,r),this.posA=t.getAttribLocation(this.program,"a_position"),this.resolutionU=t.getUniformLocation(this.program,"u_resolution"),this.timeU=t.getUniformLocation(this.program,"u_time"),this.vao=t.createVertexArray(),t.bindVertexArray(this.vao);let i=t.createBuffer();t.bindBuffer(t.ARRAY_BUFFER,i),t.bufferData(t.ARRAY_BUFFER,new Float32Array(nt),t.STATIC_DRAW),t.enableVertexAttribArray(this.posA);let n=2,s=t.FLOAT,d=!1,h=0,u=0;t.vertexAttribPointer(this.posA,n,s,d,h,u)}render(t,o){let r=this.gl;r.useProgram(this.program),r.bindVertexArray(this.vao),r.uniform2f(this.resolutionU,o.width,o.height),r.uniform1f(this.timeU,t/2e3),r.drawArrays(r.TRIANGLES,0,6)}};var O=class{tokens=[];raw="";idx=0;constructor(t){this.raw=t}isAtEnd(){return this.idx>=this.raw.length}},k=e=>e>="a"&&e<="z"||e>="A"&&e<="Z"||e>="0"&&e<="9",at=e=>e>="0"&&e<="9",ut=e=>e===`
`||e===" "||e==="	",lt=e=>t=>{let o=t.idx;for(;!e(t);){if(t.isAtEnd())return t.idx=o,null;t.idx++}let r=t.idx;return t.idx=o,{start:o,end:r}},ct=()=>e=>e.isAtEnd()?{start:e.idx,end:e.idx}:null,P=e=>t=>{let o=t.idx,r=o;for(;e(t.raw[r])&&t.raw[r]!==void 0;)r++;if(r>o)return{start:o,end:r}},y=e=>t=>e(t)||{start:t.idx,end:t.idx},dt=P(k),j=P(at),W=e=>t=>{if(e(t.raw[t.idx]))return{start:t.idx,end:t.idx+1}},St=W(ut),v=e=>W(t=>t===e),K=W(e=>!k(e)),I=e=>{let t=[];for(let o=0;o<e.length;o++)t.push(v(e[o]));return g(...t)},g=(...e)=>t=>{let o=t.idx,r=0;for(let i=0;i<e.length;i++){let n=e[i](t);if(!n)return t.idx=o,null;t.idx+=n.end-n.start,r+=n.end-n.start}return t.idx=o,{start:t.idx,end:t.idx+r}},ht=e=>t=>{let o=t.idx,r=e(t);if(r)return t.idx+=r.end-r.start,{start:o,end:o}},F=(e,t)=>o=>{let r=e(o);if(r)return r.type=t,r.parser=e,o.tokens.push(r),o.idx=r.end,r},pt=e=>t=>{for(;t.raw[t.idx]!==void 0;)e(t)},A=(...e)=>t=>{for(let o=0;o<e.length;o++){let r=e[o](t);if(r)return r}},q=e=>t=>{let o=e(t);if(o)return{...o,end:o.start}},mt=(e,t=1)=>o=>{let r=o.idx;if(o.idx=o.idx-t,!e(o)){o.idx=r;return}return o.idx=r,{start:r,end:r}},ft=()=>e=>({start:e.idx,end:e.idx+1}),Rt=g(dt,q(v("("))),bt=A(g(I("//"),y(P(e=>e!==`
`))),g(I("/*"),lt(A(I("*/"),ct())),y(I("*/")))),xt=A(g(v('"'),y(P(e=>e!=='"')),v('"')),g(v("'"),y(P(e=>e!=="'")),v("'"))),gt=g(j,y(v(".")),y(j)),vt=e=>e.idx===0?{start:0,end:0}:null,_t=e=>e.idx===e.raw.length?{start:e.idx,end:e.idx}:null,Z=e=>g(A(vt,mt(K)),I(e),q(A(_t,K))),$=pt(A(F(xt,"STRING"),F(gt,"NUMBER"),F(Z("null"),"KEYWORD"),F(Z("undefined"),"KEYWORD"),ht(ft())));var Q=({value:e})=>x("pre",{class:"editor_draw"},x("code",null,(()=>{let o=new O(e);return parseResult=$(o),o.tokens.length===0?[e]:o.tokens.reduce((r,i,n,s)=>{let h=s[n-1]?.end||0;i.start>h&&r.push(e.slice(h,i.start));let u=`parsed_${i.type}`,c=e.slice(i.start,i.end);return r.push(x("span",{class:u},c)),n===s.length-1&&r.push(e.slice(i.end)),r},[])})()));var B=[{missiles:{1:{x:100,y:200,rotation:5*Math.PI/4},2:{x:400,y:-100,rotation:Math.PI}},ships:{0:{x:100,y:300,health:100,rotation:3*Math.PI/2}}},{missiles:{1:{x:200,y:300,rotation:5*Math.PI/4},2:{x:400,y:0,rotation:Math.PI}},ships:{0:{x:200,y:300,health:100,rotation:3.5*Math.PI/2}}},{missiles:{2:{x:400,y:100,rotation:Math.PI}},ships:{0:{x:300,y:250,health:50,rotation:2*Math.PI}}},{missiles:{2:{x:400,y:200,rotation:Math.PI}},ships:{0:{x:400,y:200,health:50,rotation:2*Math.PI+Math.PI/4}}},{missiles:{},ships:{0:{x:500,y:180,health:20,rotation:2*Math.PI+2*Math.PI/4}}},{missiles:{},ships:{0:{x:600,y:150,health:20,rotation:2*Math.PI+3*Math.PI/4}}},{missiles:{},ships:{0:{x:600,y:150,health:20,rotation:2*Math.PI+3*Math.PI/4}}},{missiles:{},ships:{0:{x:600,y:150,health:20,rotation:2*Math.PI+3*Math.PI/4}}}];function yt(){let e=document.getElementById("example-timeline-ships"),t=e.getContext("webgl2");t||console.error("Failed to init webgl."),t.disable(t.DEPTH_TEST),t.blendFunc(t.SRC_ALPHA,t.ONE_MINUS_SRC_ALPHA),t.enable(t.BLEND),V(e,!0);let o=new L(t),r=new D(t);r.loadSprite("resources/ship.png",[100,100],[50,50],2),r.loadSprite("resources/missile.png",[30,60],[15,15],2);let i={frameIdx:0,missiles:{1:{x:200,y:50,rotation:Math.PI},2:{x:400,y:-100,rotation:Math.PI}},ships:{0:{x:200,y:200,brightness:0,rotation:0,health:100,frame:0}}};function n(){let u=B.map((l,p)=>{let a=`opacity: ${p===i.frameIdx?1:.5};`;return x("div",{class:"timeline-row",style:a},x(Q,{value:JSON.stringify(l)}))});z(M(x("div",{id:"timeline-controls"},u)),document.getElementById("timeline-controls"))}n();function s(){let u=B[i.frameIdx],c=u.ships[0],l=i.ships[0];l.x=f(l.x,c.x,.1),l.y=f(l.y,c.y,.1),l.health=f(l.health,c.health,.1),l.rotation=f(l.rotation,c.rotation,.1),l.health>c.health?l.brightness=1-c.health/l.health:l.brightness=0,Object.entries(u.missiles).forEach(([p,a])=>{i.missiles[p]||(i.missiles[p]={x:a.x,y:a.y,rotation:a.rotation})}),Object.entries(i.missiles).forEach(([p,a])=>{let m=u.missiles[p];if(m===void 0){delete i.missiles[p];return}a.x=f(a.x,m.x,.1),a.y=f(a.y,m.y,.1),a.health=f(a.health,m.health,.1),a.rotation=f(a.rotation,m.rotation,.1)})}let d=0,h=0;window.requestAnimationFrame(function u(c){c-d>200&&(i.frameIdx=(i.frameIdx+1)%B.length,d=c,n()),c-h>200&&(i.ships[0].frame=(i.ships[0].frame+1)%2,h=c),s(),t.viewport(0,0,e.width,e.height),t.clearColor(0,0,0,0),t.clear(t.COLOR_BUFFER_BIT),o.render(c,e),r.render(e,"resources/ship.png",i.ships[0]),Object.values(i.missiles).forEach(l=>{r.render(e,"resources/missile.png",{...l,brightness:0,frame:0})}),window.requestAnimationFrame(u)})}window.onload=function(){yt()};})();
