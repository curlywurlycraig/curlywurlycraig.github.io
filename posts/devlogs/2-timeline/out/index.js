(()=>{var b=class{tokens=[];raw="";idx=0;constructor(t){this.raw=t}isAtEnd(){return this.idx>=this.raw.length}},J=e=>e>="a"&&e<="z"||e>="A"&&e<="Z"||e>="0"&&e<="9",Q=e=>e>="0"&&e<="9",tt=e=>e===`
`||e===" "||e==="	",et=e=>t=>{let o=t.idx;for(;!e(t);){if(t.isAtEnd())return t.idx=o,null;t.idx++}let r=t.idx;return t.idx=o,{start:o,end:r}},rt=()=>e=>e.isAtEnd()?{start:e.idx,end:e.idx}:null,y=e=>t=>{let o=t.idx,r=o;for(;e(t.raw[r])&&t.raw[r]!==void 0;)r++;if(r>o)return{start:o,end:r}},v=e=>t=>e(t)||{start:t.idx,end:t.idx},ot=y(J),W=y(Q),H=e=>t=>{if(e(t.raw[t.idx]))return{start:t.idx,end:t.idx+1}},yt=H(tt),m=e=>H(t=>t===e),V=H(e=>!J(e)),E=e=>{let t=[];for(let o=0;o<e.length;o++)t.push(m(e[o]));return h(...t)},h=(...e)=>t=>{let o=t.idx,r=0;for(let n=0;n<e.length;n++){let i=e[n](t);if(!i)return t.idx=o,null;t.idx+=i.end-i.start,r+=i.end-i.start}return t.idx=o,{start:t.idx,end:t.idx+r}},nt=e=>t=>{let o=t.idx,r=e(t);if(r)return t.idx+=r.end-r.start,{start:o,end:o}},S=(e,t)=>o=>{let r=e(o);if(r)return r.type=t,r.parser=e,o.tokens.push(r),o.idx=r.end,r},it=e=>t=>{for(;t.raw[t.idx]!==void 0;)e(t)},_=(...e)=>t=>{for(let o=0;o<e.length;o++){let r=e[o](t);if(r)return r}},K=e=>t=>{let o=e(t);if(o)return{...o,end:o.start}},st=(e,t=1)=>o=>{let r=o.idx;if(o.idx=o.idx-t,!e(o)){o.idx=r;return}return o.idx=r,{start:r,end:r}},at=()=>e=>({start:e.idx,end:e.idx+1}),gt=h(ot,K(m("("))),Rt=_(h(E("//"),v(y(e=>e!==`
`))),h(E("/*"),et(_(E("*/"),rt())),v(E("*/")))),ut=_(h(m('"'),v(y(e=>e!=='"')),m('"')),h(m("'"),v(y(e=>e!=="'")),m("'"))),ct=h(W,v(m(".")),v(W)),dt=e=>e.idx===0?{start:0,end:0}:null,lt=e=>e.idx===e.raw.length?{start:e.idx,end:e.idx}:null,Y=e=>h(_(dt,st(V)),E(e),K(_(lt,V))),Z=it(_(S(ut,"STRING"),S(ct,"NUMBER"),S(Y("null"),"KEYWORD"),S(Y("undefined"),"KEYWORD"),nt(at())));var g=class extends Array{},U="function";function w(e){return e instanceof g}var x=(e,t,...o)=>{let r=o.reduce((n,i)=>(Array.isArray(i)&&!w(i)?n.push(...i):n.push(i),n),[]);return new g(e,t||{},r)},I=(e,t="__r")=>{if(!w(e))return e;let[o,r,n]=e;r.key=r.key||t;let i=n.map((s,l)=>I(s,t+"c"+(s?.[1]?.key||l)));if(typeof o===U){let s=o({...r,children:i});return I(s,t+"e"+(s?.key||""))}return new g(o,r,i)},ht=(e,t)=>{let[,o]=e._hic||[];return Object.entries(t).forEach(([r,n])=>{if(o&&typeof o[r]===U&&e.removeEventListener(r,o[r]),typeof n===U)e.addEventListener(r.toLowerCase(),n);else{if(r==="value"||r==="disabled"){e[r]=n;return}let i=e;i.getAttribute(r)!==n&&i.setAttribute(r,n)}}),e},pt=(e,t)=>{for(let o=t.length-1;o>=0;o--){let r=t[o],n=t[o+1]||null,i=r.nextSibling;(n!==i||!e.contains(r))&&e?.insertBefore(r,n)}for(;e.childNodes.length>t.length;)e?.removeChild(e.childNodes[0]);return e},z=(e,t)=>{let o=t;if(!e&&e!=="")return null;if(!w(e))return t?.nodeType!==3?document.createTextNode(e):(t.textContent!==e&&(t.textContent=e),t);let[r,n]=t?._hic||[],[i,s]=e;if(r!==i||!o){let u=s.xmlns||(i==="svg"?"http://www.w3.org/2000/svg":"http://www.w3.org/1999/xhtml");o=document.createElementNS(u,i)}ht(o,s),o._hic=e;let d=(w(e)?e[2]:[]).filter(u=>u).map((u,c)=>{let a=t?.childNodes[c];return z(u,a)});return pt(o,d),t!==o&&t?.parentNode?.replaceChild(o,t),typeof s.ref===U&&s.ref!==n?.ref&&s.ref(o,s.key),o};function A(e,t,o){var r=e.createShader(t);e.shaderSource(r,o),e.compileShader(r);var n=e.getShaderParameter(r,e.COMPILE_STATUS);if(n)return r;console.log(e.getShaderInfoLog(r)),e.deleteShader(r)}function P(e,t,o){var r=e.createProgram();e.attachShader(r,t),e.attachShader(r,o),e.linkProgram(r);var n=e.getProgramParameter(r,e.LINK_STATUS);if(n)return r;console.log(e.getProgramInfoLog(r)),e.deleteProgram(r)}function j(e,t=!0){let o=e.clientWidth,r=e.clientHeight,n=t?o*2:o,i=t?r*2:r,s=e.width!==n||e.height!==i;return s&&(e.width=n,e.height=i),s}function X(e,t){return[1,0,0,0,1,0,e,t,1]}function k(e){let t=Math.cos(e),o=Math.sin(e);return[t,-o,0,o,t,0,0,0,1]}function q(e,t){return[e,0,0,0,t,0,0,0,1]}function M(e,t){var o=e[0],r=e[0*3+1],n=e[0*3+2],i=e[1*3+0],s=e[1*3+1],l=e[1*3+2],d=e[2*3+0],u=e[2*3+1],c=e[2*3+2],a=t[0*3+0],p=t[0*3+1],f=t[0*3+2],T=t[1*3+0],D=t[1*3+1],L=t[1*3+2],F=t[2*3+0],B=t[2*3+1],O=t[2*3+2];return[a*o+p*i+f*d,a*r+p*s+f*u,a*n+p*l+f*c,T*o+D*i+L*d,T*r+D*s+L*u,T*n+D*l+L*c,F*o+B*i+O*d,F*r+B*s+O*u,F*n+B*l+O*c]}function R(e,t,o){return e*(1-o)+t*o}var ft=`#version 300 es

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
`,mt=`#version 300 es
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
`,xt=[0,0,100,0,0,100,100,0,100,100,0,100],$=[50,50],C=class{gl=null;program=null;posA=null;texcoordA=null;resolutionU=null;brightnessU=null;transformU=null;spriteIdxU=null;spriteCountU=null;vao=null;texture=null;constructor(t){this.gl=t;let o=A(t,t.VERTEX_SHADER,ft),r=A(t,t.FRAGMENT_SHADER,mt);this.program=P(t,o,r),this.posA=t.getAttribLocation(this.program,"a_position"),this.texcoordA=t.getAttribLocation(this.program,"a_texcoord"),this.resolutionU=t.getUniformLocation(this.program,"u_resolution"),this.brightnessU=t.getUniformLocation(this.program,"u_brightness"),this.transformU=t.getUniformLocation(this.program,"u_transform"),this.spriteIdxU=t.getUniformLocation(this.program,"u_sprite_idx"),this.spriteCountU=t.getUniformLocation(this.program,"u_sprite_count"),this.vao=t.createVertexArray();{t.bindVertexArray(this.vao);let n=t.createBuffer();t.bindBuffer(t.ARRAY_BUFFER,n),t.bufferData(t.ARRAY_BUFFER,new Float32Array(xt),t.STATIC_DRAW),t.enableVertexAttribArray(this.posA);let i=2,s=t.FLOAT,l=!1,d=0,u=0;t.vertexAttribPointer(this.posA,i,s,l,d,u)}{let n=t.createBuffer();t.bindBuffer(t.ARRAY_BUFFER,n),t.bufferData(t.ARRAY_BUFFER,new Float32Array([0,0,.5,0,0,1,.5,0,.5,1,0,1]),t.STATIC_DRAW),t.enableVertexAttribArray(this.texcoordA);let i=2,s=t.FLOAT,l=!1,d=0,u=0;t.vertexAttribPointer(this.texcoordA,i,s,l,d,u)}{this.texture=t.createTexture(),t.bindTexture(t.TEXTURE_2D,this.texture),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MIN_FILTER,t.NEAREST),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MAG_FILTER,t.NEAREST),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_S,t.CLAMP_TO_EDGE),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_T,t.CLAMP_TO_EDGE),t.texImage2D(t.TEXTURE_2D,0,t.RGBA,1,1,0,t.RGBA,t.UNSIGNED_BYTE,new Uint8Array([0,0,255,255]));let n=new Image;n.src="resources/ship2.png",n.addEventListener("load",()=>{t.bindTexture(t.TEXTURE_2D,this.texture),t.texImage2D(t.TEXTURE_2D,0,t.RGBA,t.RGBA,t.UNSIGNED_BYTE,n),t.generateMipmap(t.TEXTURE_2D)})}}render(t,o){let r=this.gl;r.useProgram(this.program),r.bindVertexArray(this.vao),r.uniform2f(this.resolutionU,o.width,o.height);let{brightness:n,x:i,y:s,rotation:l,frame:d}=t,u=X(i,s),c=k(l),a=q(1,1),p=X(-$[0],-$[1]),f=M(u,M(c,M(a,p)));r.uniform1i(this.spriteIdxU,d),r.uniform1i(this.spriteCountU,2),r.uniform1f(this.brightnessU,n),r.uniformMatrix3fv(this.transformU,!1,f),r.drawArrays(r.TRIANGLES,0,6)}};var vt=[-1,-1,1,-1,-1,1,1,-1,1,1,-1,1],_t=`#version 300 es

in vec2 a_position;

out vec2 v_texcoord;

void main() {
    gl_Position = vec4(a_position, 0.9, 1.);
}
`,At=`#version 300 es
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
}`,N=class{gl=null;program=null;posA=null;resolutionU=null;timeU=null;vao=null;constructor(t){this.gl=t;let o=A(t,t.VERTEX_SHADER,_t),r=A(t,t.FRAGMENT_SHADER,At);this.program=P(t,o,r),this.posA=t.getAttribLocation(this.program,"a_position"),this.resolutionU=t.getUniformLocation(this.program,"u_resolution"),this.timeU=t.getUniformLocation(this.program,"u_time"),this.vao=t.createVertexArray(),t.bindVertexArray(this.vao);let n=t.createBuffer();t.bindBuffer(t.ARRAY_BUFFER,n),t.bufferData(t.ARRAY_BUFFER,new Float32Array(vt),t.STATIC_DRAW),t.enableVertexAttribArray(this.posA);let i=2,s=t.FLOAT,l=!1,d=0,u=0;t.vertexAttribPointer(this.posA,i,s,l,d,u)}render(t,o){let r=this.gl;r.useProgram(this.program),r.bindVertexArray(this.vao),r.uniform2f(this.resolutionU,o.width,o.height),r.uniform1f(this.timeU,t/2e3),r.drawArrays(r.TRIANGLES,0,6)}};var Tt=({value:e})=>x("pre",{class:"editor_draw"},x("code",null,(()=>{let o=new b(e);return parseResult=Z(o),o.tokens.length===0?[e]:o.tokens.reduce((r,n,i,s)=>{let d=s[i-1]?.end||0;n.start>d&&r.push(e.slice(d,n.start));let u=`parsed_${n.type}`,c=e.slice(n.start,n.end);return r.push(x("span",{class:u},c)),i===s.length-1&&r.push(e.slice(n.end)),r},[])})()));function Et(){let e=document.getElementById("example-timeline-ships"),t=e.getContext("webgl2");t||console.error("Failed to init webgl."),t.disable(t.DEPTH_TEST),t.blendFunc(t.SRC_ALPHA,t.ONE_MINUS_SRC_ALPHA),t.enable(t.BLEND),j(e,!0);let o=new C(t),r=new N(t),n={frameIdx:0,ship:{x:200,y:200,brightness:0,rotation:0,health:100,frame:0}},i=[{x:100,y:300,health:100,rotation:3*Math.PI/2},{x:100,y:300,health:100,rotation:3*Math.PI/2},{x:100,y:300,health:100,rotation:3*Math.PI/2},{x:200,y:300,health:100,rotation:3.5*Math.PI/2},{x:300,y:250,health:50,rotation:2*Math.PI},{x:400,y:200,health:50,rotation:2*Math.PI+Math.PI/4},{x:500,y:180,health:20,rotation:2*Math.PI+2*Math.PI/4},{x:600,y:150,health:20,rotation:2*Math.PI+3*Math.PI/4},{x:600,y:150,health:20,rotation:2*Math.PI+3*Math.PI/4},{x:600,y:150,health:20,rotation:2*Math.PI+3*Math.PI/4}];function s(){let c=i.map((p,f)=>{let T=`opacity: ${f===n.frameIdx?1:.5};`;return x("div",{class:"timeline-row",style:T},x(Tt,{value:JSON.stringify(p)}))});z(I(x("div",{id:"timeline-controls"},c)),document.getElementById("timeline-controls"))}s();function l(){let c=i[n.frameIdx],a=n.ship;a.x=R(a.x,c.x,.1),a.y=R(a.y,c.y,.1),a.health=R(a.health,c.health,.1),a.rotation=R(a.rotation,c.rotation,.1),a.health>c.health?a.brightness=1-c.health/a.health:a.brightness=0}let d=0,u=0;window.requestAnimationFrame(function c(a){a-d>200&&(n.frameIdx=(n.frameIdx+1)%i.length,d=a,s()),a-u>200&&(n.ship.frame=(n.ship.frame+1)%2,u=a),l(),t.viewport(0,0,e.width,e.height),t.clearColor(0,0,0,0),t.clear(t.COLOR_BUFFER_BIT),r.render(a,e),o.render(n.ship,e),window.requestAnimationFrame(c)})}window.onload=function(){Et()};})();
