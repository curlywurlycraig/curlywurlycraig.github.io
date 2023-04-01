(()=>{var E=class extends Array{},S="function";function b(e){return e instanceof E}var h=(e,t,...o)=>{let r=o.reduce((n,i)=>(Array.isArray(i)&&!b(i)?n.push(...i):n.push(i),n),[]);return new E(e,t||{},r)},U=(e,t="__r")=>{if(!b(e))return e;let[o,r,n]=e;r.key=r.key||t;let i=n.map((s,l)=>U(s,t+"c"+(s?.[1]?.key||l)));if(typeof o===S){let s=o({...r,children:i});return U(s,t+"e"+(s?.key||""))}return new E(o,r,i)},tt=(e,t)=>{let[,o]=e._hic||[];return Object.entries(t).forEach(([r,n])=>{if(o&&typeof o[r]===S&&e.removeEventListener(r,o[r]),typeof n===S)e.addEventListener(r.toLowerCase(),n);else{if(r==="value"||r==="disabled"){e[r]=n;return}let i=e;i.getAttribute(r)!==n&&i.setAttribute(r,n)}}),e},et=(e,t)=>{for(let o=t.length-1;o>=0;o--){let r=t[o],n=t[o+1]||null,i=r.nextSibling;(n!==i||!e.contains(r))&&e?.insertBefore(r,n)}for(;e.childNodes.length>t.length;)e?.removeChild(e.childNodes[0]);return e},H=(e,t)=>{let o=t;if(!e&&e!=="")return null;if(!b(e))return t?.nodeType!==3?document.createTextNode(e):(t.textContent!==e&&(t.textContent=e),t);let[r,n]=t?._hic||[],[i,s]=e;if(r!==i||!o){let u=s.xmlns||(i==="svg"?"http://www.w3.org/2000/svg":"http://www.w3.org/1999/xhtml");o=document.createElementNS(u,i)}tt(o,s),o._hic=e;let d=(b(e)?e[2]:[]).filter(u=>u).map((u,c)=>{let a=t?.childNodes[c];return H(u,a)});return et(o,d),t!==o&&t?.parentNode?.replaceChild(o,t),typeof s.ref===S&&s.ref!==n?.ref&&s.ref(o,s.key),o};function v(e,t,o){var r=e.createShader(t);e.shaderSource(r,o),e.compileShader(r);var n=e.getShaderParameter(r,e.COMPILE_STATUS);if(n)return r;console.log(e.getShaderInfoLog(r)),e.deleteShader(r)}function w(e,t,o){var r=e.createProgram();e.attachShader(r,t),e.attachShader(r,o),e.linkProgram(r);var n=e.getProgramParameter(r,e.LINK_STATUS);if(n)return r;console.log(e.getProgramInfoLog(r)),e.deleteProgram(r)}function W(e,t=!0){let o=e.clientWidth,r=e.clientHeight,n=t?o*2:o,i=t?r*2:r,s=e.width!==n||e.height!==i;return s&&(e.width=n,e.height=i),s}function z(e,t){return[1,0,0,0,1,0,e,t,1]}function V(e){let t=Math.cos(e),o=Math.sin(e);return[t,-o,0,o,t,0,0,0,1]}function Y(e,t){return[e,0,0,0,t,0,0,0,1]}function I(e,t){var o=e[0],r=e[0*3+1],n=e[0*3+2],i=e[1*3+0],s=e[1*3+1],l=e[1*3+2],d=e[2*3+0],u=e[2*3+1],c=e[2*3+2],a=t[0*3+0],f=t[0*3+1],m=t[0*3+2],T=t[1*3+0],D=t[1*3+1],L=t[1*3+2],F=t[2*3+0],B=t[2*3+1],O=t[2*3+2];return[a*o+f*i+m*d,a*r+f*s+m*u,a*n+f*l+m*c,T*o+D*i+L*d,T*r+D*s+L*u,T*n+D*l+L*c,F*o+B*i+O*d,F*r+B*s+O*u,F*n+B*l+O*c]}function y(e,t,o){return e*(1-o)+t*o}var rt=`#version 300 es

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
`,nt=[0,0,100,0,0,100,100,0,100,100,0,100],J=[50,50],P=class{gl=null;program=null;posA=null;texcoordA=null;resolutionU=null;brightnessU=null;transformU=null;spriteIdxU=null;spriteCountU=null;vao=null;texture=null;constructor(t){this.gl=t;let o=v(t,t.VERTEX_SHADER,rt),r=v(t,t.FRAGMENT_SHADER,ot);this.program=w(t,o,r),this.posA=t.getAttribLocation(this.program,"a_position"),this.texcoordA=t.getAttribLocation(this.program,"a_texcoord"),this.resolutionU=t.getUniformLocation(this.program,"u_resolution"),this.brightnessU=t.getUniformLocation(this.program,"u_brightness"),this.transformU=t.getUniformLocation(this.program,"u_transform"),this.spriteIdxU=t.getUniformLocation(this.program,"u_sprite_idx"),this.spriteCountU=t.getUniformLocation(this.program,"u_sprite_count"),this.vao=t.createVertexArray();{t.bindVertexArray(this.vao);let n=t.createBuffer();t.bindBuffer(t.ARRAY_BUFFER,n),t.bufferData(t.ARRAY_BUFFER,new Float32Array(nt),t.STATIC_DRAW),t.enableVertexAttribArray(this.posA);let i=2,s=t.FLOAT,l=!1,d=0,u=0;t.vertexAttribPointer(this.posA,i,s,l,d,u)}{let n=t.createBuffer();t.bindBuffer(t.ARRAY_BUFFER,n),t.bufferData(t.ARRAY_BUFFER,new Float32Array([0,0,.5,0,0,1,.5,0,.5,1,0,1]),t.STATIC_DRAW),t.enableVertexAttribArray(this.texcoordA);let i=2,s=t.FLOAT,l=!1,d=0,u=0;t.vertexAttribPointer(this.texcoordA,i,s,l,d,u)}{this.texture=t.createTexture(),t.bindTexture(t.TEXTURE_2D,this.texture),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MIN_FILTER,t.NEAREST),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MAG_FILTER,t.NEAREST),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_S,t.CLAMP_TO_EDGE),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_T,t.CLAMP_TO_EDGE),t.texImage2D(t.TEXTURE_2D,0,t.RGBA,1,1,0,t.RGBA,t.UNSIGNED_BYTE,new Uint8Array([0,0,255,255]));let n=new Image;n.src="resources/ship.png",n.addEventListener("load",()=>{t.bindTexture(t.TEXTURE_2D,this.texture),t.texImage2D(t.TEXTURE_2D,0,t.RGBA,t.RGBA,t.UNSIGNED_BYTE,n),t.generateMipmap(t.TEXTURE_2D)})}}render(t,o){let r=this.gl;r.useProgram(this.program),r.bindVertexArray(this.vao),r.uniform2f(this.resolutionU,o.width,o.height);let{brightness:n,x:i,y:s,rotation:l,frame:d}=t,u=z(i,s),c=V(l),a=Y(1,1),f=z(-J[0],-J[1]),m=I(u,I(c,I(a,f)));r.uniform1i(this.spriteIdxU,d),r.uniform1i(this.spriteCountU,2),r.uniform1f(this.brightnessU,n),r.uniformMatrix3fv(this.transformU,!1,m),r.drawArrays(r.TRIANGLES,0,6)}};var it=[-1,-1,1,-1,-1,1,1,-1,1,1,-1,1],st=`#version 300 es

in vec2 a_position;

out vec2 v_texcoord;

void main() {
    gl_Position = vec4(a_position, 0.9, 1.);
}
`,at=`#version 300 es
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
}`,M=class{gl=null;program=null;posA=null;resolutionU=null;timeU=null;vao=null;constructor(t){this.gl=t;let o=v(t,t.VERTEX_SHADER,st),r=v(t,t.FRAGMENT_SHADER,at);this.program=w(t,o,r),this.posA=t.getAttribLocation(this.program,"a_position"),this.resolutionU=t.getUniformLocation(this.program,"u_resolution"),this.timeU=t.getUniformLocation(this.program,"u_time"),this.vao=t.createVertexArray(),t.bindVertexArray(this.vao);let n=t.createBuffer();t.bindBuffer(t.ARRAY_BUFFER,n),t.bufferData(t.ARRAY_BUFFER,new Float32Array(it),t.STATIC_DRAW),t.enableVertexAttribArray(this.posA);let i=2,s=t.FLOAT,l=!1,d=0,u=0;t.vertexAttribPointer(this.posA,i,s,l,d,u)}render(t,o){let r=this.gl;r.useProgram(this.program),r.bindVertexArray(this.vao),r.uniform2f(this.resolutionU,o.width,o.height),r.uniform1f(this.timeU,t/2e3),r.drawArrays(r.TRIANGLES,0,6)}};var N=class{tokens=[];raw="";idx=0;constructor(t){this.raw=t}isAtEnd(){return this.idx>=this.raw.length}},k=e=>e>="a"&&e<="z"||e>="A"&&e<="Z"||e>="0"&&e<="9",ut=e=>e>="0"&&e<="9",ct=e=>e===`
`||e===" "||e==="	",dt=e=>t=>{let o=t.idx;for(;!e(t);){if(t.isAtEnd())return t.idx=o,null;t.idx++}let r=t.idx;return t.idx=o,{start:o,end:r}},lt=()=>e=>e.isAtEnd()?{start:e.idx,end:e.idx}:null,R=e=>t=>{let o=t.idx,r=o;for(;e(t.raw[r])&&t.raw[r]!==void 0;)r++;if(r>o)return{start:o,end:r}},_=e=>t=>e(t)||{start:t.idx,end:t.idx},ht=R(k),K=R(ut),G=e=>t=>{if(e(t.raw[t.idx]))return{start:t.idx,end:t.idx+1}},St=G(ct),x=e=>G(t=>t===e),Z=G(e=>!k(e)),g=e=>{let t=[];for(let o=0;o<e.length;o++)t.push(x(e[o]));return p(...t)},p=(...e)=>t=>{let o=t.idx,r=0;for(let n=0;n<e.length;n++){let i=e[n](t);if(!i)return t.idx=o,null;t.idx+=i.end-i.start,r+=i.end-i.start}return t.idx=o,{start:t.idx,end:t.idx+r}},pt=e=>t=>{let o=t.idx,r=e(t);if(r)return t.idx+=r.end-r.start,{start:o,end:o}},C=(e,t)=>o=>{let r=e(o);if(r)return r.type=t,r.parser=e,o.tokens.push(r),o.idx=r.end,r},ft=e=>t=>{for(;t.raw[t.idx]!==void 0;)e(t)},A=(...e)=>t=>{for(let o=0;o<e.length;o++){let r=e[o](t);if(r)return r}},q=e=>t=>{let o=e(t);if(o)return{...o,end:o.start}},mt=(e,t=1)=>o=>{let r=o.idx;if(o.idx=o.idx-t,!e(o)){o.idx=r;return}return o.idx=r,{start:r,end:r}},xt=()=>e=>({start:e.idx,end:e.idx+1}),bt=p(ht,q(x("("))),Ut=A(p(g("//"),_(R(e=>e!==`
`))),p(g("/*"),dt(A(g("*/"),lt())),_(g("*/")))),vt=A(p(x('"'),_(R(e=>e!=='"')),x('"')),p(x("'"),_(R(e=>e!=="'")),x("'"))),_t=p(K,_(x(".")),_(K)),At=e=>e.idx===0?{start:0,end:0}:null,Tt=e=>e.idx===e.raw.length?{start:e.idx,end:e.idx}:null,j=e=>p(A(At,mt(Z)),g(e),q(A(Tt,Z))),$=ft(A(C(vt,"STRING"),C(_t,"NUMBER"),C(j("null"),"KEYWORD"),C(j("undefined"),"KEYWORD"),pt(xt())));var Q=({value:e})=>h("pre",{class:"editor_draw"},h("code",null,(()=>{let o=new N(e);return parseResult=$(o),o.tokens.length===0?[e]:o.tokens.reduce((r,n,i,s)=>{let d=s[i-1]?.end||0;n.start>d&&r.push(e.slice(d,n.start));let u=`parsed_${n.type}`,c=e.slice(n.start,n.end);return r.push(h("span",{class:u},c)),i===s.length-1&&r.push(e.slice(n.end)),r},[])})()));function Et(){let e=document.getElementById("example-timeline-ships"),t=e.getContext("webgl2");t||console.error("Failed to init webgl."),t.disable(t.DEPTH_TEST),t.blendFunc(t.SRC_ALPHA,t.ONE_MINUS_SRC_ALPHA),t.enable(t.BLEND),W(e,!0);let o=new P(t),r=new M(t),n={frameIdx:0,ship:{x:200,y:200,brightness:0,rotation:0,health:100,frame:0}},i=[{x:100,y:300,health:100,rotation:3*Math.PI/2},{x:100,y:300,health:100,rotation:3*Math.PI/2},{x:100,y:300,health:100,rotation:3*Math.PI/2},{x:200,y:300,health:100,rotation:3.5*Math.PI/2},{x:300,y:250,health:50,rotation:2*Math.PI},{x:400,y:200,health:50,rotation:2*Math.PI+Math.PI/4},{x:500,y:180,health:20,rotation:2*Math.PI+2*Math.PI/4},{x:600,y:150,health:20,rotation:2*Math.PI+3*Math.PI/4},{x:600,y:150,health:20,rotation:2*Math.PI+3*Math.PI/4},{x:600,y:150,health:20,rotation:2*Math.PI+3*Math.PI/4}];function s(){let c=i.map((f,m)=>{let T=`opacity: ${m===n.frameIdx?1:.5};`;return h("div",{class:"timeline-row",style:T},h(Q,{value:JSON.stringify(f)}))});H(U(h("div",{id:"timeline-controls"},c)),document.getElementById("timeline-controls"))}s();function l(){let c=i[n.frameIdx],a=n.ship;a.x=y(a.x,c.x,.1),a.y=y(a.y,c.y,.1),a.health=y(a.health,c.health,.1),a.rotation=y(a.rotation,c.rotation,.1),a.health>c.health?a.brightness=1-c.health/a.health:a.brightness=0}let d=0,u=0;window.requestAnimationFrame(function c(a){a-d>200&&(n.frameIdx=(n.frameIdx+1)%i.length,d=a,s()),a-u>200&&(n.ship.frame=(n.ship.frame+1)%2,u=a),l(),t.viewport(0,0,e.width,e.height),t.clearColor(0,0,0,0),t.clear(t.COLOR_BUFFER_BIT),r.render(a,e),o.render(n.ship,e),window.requestAnimationFrame(c)})}window.onload=function(){Et()};})();
