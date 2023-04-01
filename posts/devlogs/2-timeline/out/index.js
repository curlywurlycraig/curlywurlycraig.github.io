(()=>{var E=class extends Array{},w="function";function U(e){return e instanceof E}var m=(e,t,...r)=>{let o=r.reduce((i,n)=>(Array.isArray(n)&&!U(n)?i.push(...n):i.push(n),i),[]);return new E(e,t||{},o)},I=(e,t="__r")=>{if(!U(e))return e;let[r,o,i]=e;o.key=o.key||t;let n=i.map((s,h)=>I(s,t+"c"+(s?.[1]?.key||h)));if(typeof r===w){let s=r({...o,children:n});return I(s,t+"e"+(s?.key||""))}return new E(r,o,n)},Q=(e,t)=>{let[,r]=e._hic||[];return Object.entries(t).forEach(([o,i])=>{if(r&&typeof r[o]===w&&e.removeEventListener(o,r[o]),typeof i===w)e.addEventListener(o.toLowerCase(),i);else{if(o==="value"||o==="disabled"){e[o]=i;return}let n=e;n.getAttribute(o)!==i&&n.setAttribute(o,i)}}),e},tt=(e,t)=>{for(let r=t.length-1;r>=0;r--){let o=t[r],i=t[r+1]||null,n=o.nextSibling;(i!==n||!e.contains(o))&&e?.insertBefore(o,i)}for(;e.childNodes.length>t.length;)e?.removeChild(e.childNodes[0]);return e},H=(e,t)=>{let r=t;if(!e&&e!=="")return null;if(!U(e))return t?.nodeType!==3?document.createTextNode(e):(t.textContent!==e&&(t.textContent=e),t);let[o,i]=t?._hic||[],[n,s]=e;if(o!==n||!r){let c=s.xmlns||(n==="svg"?"http://www.w3.org/2000/svg":"http://www.w3.org/1999/xhtml");r=document.createElementNS(c,n)}Q(r,s),r._hic=e;let u=(U(e)?e[2]:[]).filter(c=>c).map((c,l)=>{let d=t?.childNodes[l];return H(c,d)});return tt(r,u),t!==r&&t?.parentNode?.replaceChild(r,t),typeof s.ref===w&&s.ref!==i?.ref&&s.ref(r,s.key),r};function _(e,t,r){var o=e.createShader(t);e.shaderSource(o,r),e.compileShader(o);var i=e.getShaderParameter(o,e.COMPILE_STATUS);if(i)return o;console.log(e.getShaderInfoLog(o)),e.deleteShader(o)}function P(e,t,r){var o=e.createProgram();e.attachShader(o,t),e.attachShader(o,r),e.linkProgram(o);var i=e.getProgramParameter(o,e.LINK_STATUS);if(i)return o;console.log(e.getProgramInfoLog(o)),e.deleteProgram(o)}function W(e,t=!0){let r=e.clientWidth,o=e.clientHeight,i=t?r*2:r,n=t?o*2:o,s=e.width!==i||e.height!==n;return s&&(e.width=i,e.height=n),s}function z(e,t){return[1,0,0,0,1,0,e,t,1]}function V(e){let t=Math.cos(e),r=Math.sin(e);return[t,-r,0,r,t,0,0,0,1]}function Y(e,t){return[e,0,0,0,t,0,0,0,1]}function M(e,t){var r=e[0],o=e[0*3+1],i=e[0*3+2],n=e[1*3+0],s=e[1*3+1],h=e[1*3+2],u=e[2*3+0],c=e[2*3+1],l=e[2*3+2],d=t[0*3+0],a=t[0*3+1],p=t[0*3+2],f=t[1*3+0],g=t[1*3+1],L=t[1*3+2],F=t[2*3+0],B=t[2*3+1],O=t[2*3+2];return[d*r+a*n+p*u,d*o+a*s+p*c,d*i+a*h+p*l,f*r+g*n+L*u,f*o+g*s+L*c,f*i+g*h+L*l,F*r+B*n+O*u,F*o+B*s+O*c,F*i+B*h+O*l]}function y(e,t,r){return e*(1-r)+t*r}var et=`#version 300 es

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
`,rt=`#version 300 es
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
`,R=class{gl=null;program=null;posA=null;texcoordA=null;resolutionU=null;brightnessU=null;transformU=null;spriteIdxU=null;spriteCountU=null;vao=null;texture=null;geometry=null;dimensions=null;constructor(t,r,o,i){this.gl=t,this.origin=o;let[n,s]=r;this.dimensions=r,this.geometry=[0,0,n,0,0,s,n,0,n,s,0,s];let h=_(t,t.VERTEX_SHADER,et),u=_(t,t.FRAGMENT_SHADER,rt);this.program=P(t,h,u),this.posA=t.getAttribLocation(this.program,"a_position"),this.texcoordA=t.getAttribLocation(this.program,"a_texcoord"),this.resolutionU=t.getUniformLocation(this.program,"u_resolution"),this.brightnessU=t.getUniformLocation(this.program,"u_brightness"),this.transformU=t.getUniformLocation(this.program,"u_transform"),this.spriteIdxU=t.getUniformLocation(this.program,"u_sprite_idx"),this.spriteCountU=t.getUniformLocation(this.program,"u_sprite_count"),this.vao=t.createVertexArray();{t.bindVertexArray(this.vao);let c=t.createBuffer();t.bindBuffer(t.ARRAY_BUFFER,c),t.bufferData(t.ARRAY_BUFFER,new Float32Array(this.geometry),t.STATIC_DRAW),t.enableVertexAttribArray(this.posA);let l=2,d=t.FLOAT,a=!1,p=0,f=0;t.vertexAttribPointer(this.posA,l,d,a,p,f)}{let c=t.createBuffer();t.bindBuffer(t.ARRAY_BUFFER,c),t.bufferData(t.ARRAY_BUFFER,new Float32Array([0,0,.5,0,0,1,.5,0,.5,1,0,1]),t.STATIC_DRAW),t.enableVertexAttribArray(this.texcoordA);let l=2,d=t.FLOAT,a=!1,p=0,f=0;t.vertexAttribPointer(this.texcoordA,l,d,a,p,f)}{this.texture=t.createTexture(),t.bindTexture(t.TEXTURE_2D,this.texture),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MIN_FILTER,t.NEAREST),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MAG_FILTER,t.NEAREST),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_S,t.CLAMP_TO_EDGE),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_T,t.CLAMP_TO_EDGE),t.texImage2D(t.TEXTURE_2D,0,t.RGBA,1,1,0,t.RGBA,t.UNSIGNED_BYTE,new Uint8Array([0,0,255,255]));let c=new Image;c.src=i,c.addEventListener("load",()=>{t.bindTexture(t.TEXTURE_2D,this.texture),t.texImage2D(t.TEXTURE_2D,0,t.RGBA,t.RGBA,t.UNSIGNED_BYTE,c),t.generateMipmap(t.TEXTURE_2D)})}}render(t,r){let{brightness:o,x:i,y:n,rotation:s,frame:h}=r,u=this.gl;u.useProgram(this.program),u.bindVertexArray(this.vao),u.bindTexture(u.TEXTURE_2D,this.texture),u.uniform2f(this.resolutionU,t.width,t.height);let c=z(i,n),l=V(s),d=Y(1,1),a=z(-this.origin[0],-this.origin[1]),p=M(c,M(l,M(d,a)));u.uniform1i(this.spriteIdxU,h),u.uniform1i(this.spriteCountU,2),u.uniform1f(this.brightnessU,o),u.uniformMatrix3fv(this.transformU,!1,p),u.drawArrays(u.TRIANGLES,0,6)}};var ot=[-1,-1,1,-1,-1,1,1,-1,1,1,-1,1],nt=`#version 300 es

in vec2 a_position;

out vec2 v_texcoord;

void main() {
    gl_Position = vec4(a_position, 0.9, 1.);
}
`,it=`#version 300 es
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
}`,C=class{gl=null;program=null;posA=null;resolutionU=null;timeU=null;vao=null;constructor(t){this.gl=t;let r=_(t,t.VERTEX_SHADER,nt),o=_(t,t.FRAGMENT_SHADER,it);this.program=P(t,r,o),this.posA=t.getAttribLocation(this.program,"a_position"),this.resolutionU=t.getUniformLocation(this.program,"u_resolution"),this.timeU=t.getUniformLocation(this.program,"u_time"),this.vao=t.createVertexArray(),t.bindVertexArray(this.vao);let i=t.createBuffer();t.bindBuffer(t.ARRAY_BUFFER,i),t.bufferData(t.ARRAY_BUFFER,new Float32Array(ot),t.STATIC_DRAW),t.enableVertexAttribArray(this.posA);let n=2,s=t.FLOAT,h=!1,u=0,c=0;t.vertexAttribPointer(this.posA,n,s,h,u,c)}render(t,r){let o=this.gl;o.useProgram(this.program),o.bindVertexArray(this.vao),o.uniform2f(this.resolutionU,r.width,r.height),o.uniform1f(this.timeU,t/2e3),o.drawArrays(o.TRIANGLES,0,6)}};var D=class{tokens=[];raw="";idx=0;constructor(t){this.raw=t}isAtEnd(){return this.idx>=this.raw.length}},j=e=>e>="a"&&e<="z"||e>="A"&&e<="Z"||e>="0"&&e<="9",st=e=>e>="0"&&e<="9",at=e=>e===`
`||e===" "||e==="	",ut=e=>t=>{let r=t.idx;for(;!e(t);){if(t.isAtEnd())return t.idx=r,null;t.idx++}let o=t.idx;return t.idx=r,{start:r,end:o}},ct=()=>e=>e.isAtEnd()?{start:e.idx,end:e.idx}:null,b=e=>t=>{let r=t.idx,o=r;for(;e(t.raw[o])&&t.raw[o]!==void 0;)o++;if(o>r)return{start:r,end:o}},A=e=>t=>e(t)||{start:t.idx,end:t.idx},dt=b(j),J=b(st),G=e=>t=>{if(e(t.raw[t.idx]))return{start:t.idx,end:t.idx+1}},yt=G(at),v=e=>G(t=>t===e),K=G(e=>!j(e)),S=e=>{let t=[];for(let r=0;r<e.length;r++)t.push(v(e[r]));return x(...t)},x=(...e)=>t=>{let r=t.idx,o=0;for(let i=0;i<e.length;i++){let n=e[i](t);if(!n)return t.idx=r,null;t.idx+=n.end-n.start,o+=n.end-n.start}return t.idx=r,{start:t.idx,end:t.idx+o}},ht=e=>t=>{let r=t.idx,o=e(t);if(o)return t.idx+=o.end-o.start,{start:r,end:r}},N=(e,t)=>r=>{let o=e(r);if(o)return o.type=t,o.parser=e,r.tokens.push(o),r.idx=o.end,o},lt=e=>t=>{for(;t.raw[t.idx]!==void 0;)e(t)},T=(...e)=>t=>{for(let r=0;r<e.length;r++){let o=e[r](t);if(o)return o}},k=e=>t=>{let r=e(t);if(r)return{...r,end:r.start}},pt=(e,t=1)=>r=>{let o=r.idx;if(r.idx=r.idx-t,!e(r)){r.idx=o;return}return r.idx=o,{start:o,end:o}},ft=()=>e=>({start:e.idx,end:e.idx+1}),Rt=x(dt,k(v("("))),St=T(x(S("//"),A(b(e=>e!==`
`))),x(S("/*"),ut(T(S("*/"),ct())),A(S("*/")))),mt=T(x(v('"'),A(b(e=>e!=='"')),v('"')),x(v("'"),A(b(e=>e!=="'")),v("'"))),xt=x(J,A(v(".")),A(J)),vt=e=>e.idx===0?{start:0,end:0}:null,_t=e=>e.idx===e.raw.length?{start:e.idx,end:e.idx}:null,Z=e=>x(T(vt,pt(K)),S(e),k(T(_t,K))),q=lt(T(N(mt,"STRING"),N(xt,"NUMBER"),N(Z("null"),"KEYWORD"),N(Z("undefined"),"KEYWORD"),ht(ft())));var $=({value:e})=>m("pre",{class:"editor_draw"},m("code",null,(()=>{let r=new D(e);return parseResult=q(r),r.tokens.length===0?[e]:r.tokens.reduce((o,i,n,s)=>{let u=s[n-1]?.end||0;i.start>u&&o.push(e.slice(u,i.start));let c=`parsed_${i.type}`,l=e.slice(i.start,i.end);return o.push(m("span",{class:c},l)),n===s.length-1&&o.push(e.slice(i.end)),o},[])})()));function At(){let e=document.getElementById("example-timeline-ships"),t=e.getContext("webgl2");t||console.error("Failed to init webgl."),t.disable(t.DEPTH_TEST),t.blendFunc(t.SRC_ALPHA,t.ONE_MINUS_SRC_ALPHA),t.enable(t.BLEND),W(e,!0);let r=new R(t,[100,100],[50,50],"resources/ship.png"),o=new R(t,[16,32],[8,8],"resources/missile.png"),i=new C(t),n={frameIdx:0,ship:{x:200,y:200,brightness:0,rotation:0,health:100,frame:0}},s=[{x:100,y:300,health:100,rotation:3*Math.PI/2},{x:100,y:300,health:100,rotation:3*Math.PI/2},{x:100,y:300,health:100,rotation:3*Math.PI/2},{x:200,y:300,health:100,rotation:3.5*Math.PI/2},{x:300,y:250,health:50,rotation:2*Math.PI},{x:400,y:200,health:50,rotation:2*Math.PI+Math.PI/4},{x:500,y:180,health:20,rotation:2*Math.PI+2*Math.PI/4},{x:600,y:150,health:20,rotation:2*Math.PI+3*Math.PI/4},{x:600,y:150,health:20,rotation:2*Math.PI+3*Math.PI/4},{x:600,y:150,health:20,rotation:2*Math.PI+3*Math.PI/4}];function h(){let d=s.map((p,f)=>{let g=`opacity: ${f===n.frameIdx?1:.5};`;return m("div",{class:"timeline-row",style:g},m($,{value:JSON.stringify(p)}))});H(I(m("div",{id:"timeline-controls"},d)),document.getElementById("timeline-controls"))}h();function u(){let d=s[n.frameIdx],a=n.ship;a.x=y(a.x,d.x,.1),a.y=y(a.y,d.y,.1),a.health=y(a.health,d.health,.1),a.rotation=y(a.rotation,d.rotation,.1),a.health>d.health?a.brightness=1-d.health/a.health:a.brightness=0}let c=0,l=0;window.requestAnimationFrame(function d(a){a-c>200&&(n.frameIdx=(n.frameIdx+1)%s.length,c=a,h()),a-l>200&&(n.ship.frame=(n.ship.frame+1)%2,l=a),u(),t.viewport(0,0,e.width,e.height),t.clearColor(0,0,0,0),t.clear(t.COLOR_BUFFER_BIT),i.render(a,e),r.render(e,n.ship),o.render(e,n.ship),window.requestAnimationFrame(d)})}window.onload=function(){At()};})();
