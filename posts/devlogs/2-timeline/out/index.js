(()=>{var T=class extends Array{},I="function";function P(e){return e instanceof T}var v=(e,t,...r)=>{let o=r.reduce((n,i)=>(Array.isArray(i)&&!P(i)?n.push(...i):n.push(i),n),[]);return new T(e,t||{},o)},w=(e,t="__r")=>{if(!P(e))return e;let[r,o,n]=e;o.key=o.key||t;let i=n.map((s,m)=>w(s,t+"c"+(s?.[1]?.key||m)));if(typeof r===I){let s=r({...o,children:i});return w(s,t+"e"+(s?.key||""))}return new T(r,o,i)},tt=(e,t)=>{let[,r]=e._hic||[];return Object.entries(t).forEach(([o,n])=>{if(r&&typeof r[o]===I&&e.removeEventListener(o,r[o]),typeof n===I)e.addEventListener(o.toLowerCase(),n);else{if(o==="value"||o==="disabled"){e[o]=n;return}let i=e;i.getAttribute(o)!==n&&i.setAttribute(o,n)}}),e},et=(e,t)=>{for(let r=t.length-1;r>=0;r--){let o=t[r],n=t[r+1]||null,i=o.nextSibling;(n!==i||!e.contains(o))&&e?.insertBefore(o,n)}for(;e.childNodes.length>t.length;)e?.removeChild(e.childNodes[0]);return e},z=(e,t)=>{let r=t;if(!e&&e!=="")return null;if(!P(e))return t?.nodeType!==3?document.createTextNode(e):(t.textContent!==e&&(t.textContent=e),t);let[o,n]=t?._hic||[],[i,s]=e;if(o!==i||!r){let u=s.xmlns||(i==="svg"?"http://www.w3.org/2000/svg":"http://www.w3.org/1999/xhtml");r=document.createElementNS(u,i)}tt(r,s),r._hic=e;let a=(P(e)?e[2]:[]).filter(u=>u).map((u,h)=>{let d=t?.childNodes[h];return z(u,d)});return et(r,a),t!==r&&t?.parentNode?.replaceChild(r,t),typeof s.ref===I&&s.ref!==n?.ref&&s.ref(r,s.key),r};function A(e,t,r){var o=e.createShader(t);e.shaderSource(o,r),e.compileShader(o);var n=e.getShaderParameter(o,e.COMPILE_STATUS);if(n)return o;console.log(e.getShaderInfoLog(o)),e.deleteShader(o)}function U(e,t,r){var o=e.createProgram();e.attachShader(o,t),e.attachShader(o,r),e.linkProgram(o);var n=e.getProgramParameter(o,e.LINK_STATUS);if(n)return o;console.log(e.getProgramInfoLog(o)),e.deleteProgram(o)}function V(e,t=!0){let r=e.clientWidth,o=e.clientHeight,n=t?r*2:r,i=t?o*2:o,s=e.width!==n||e.height!==i;return s&&(e.width=n,e.height=i),s}function X(e,t){return[1,0,0,0,1,0,e,t,1]}function Y(e){let t=Math.cos(e),r=Math.sin(e);return[t,-r,0,r,t,0,0,0,1]}function J(e,t){return[e,0,0,0,t,0,0,0,1]}function M(e,t){var r=e[0],o=e[0*3+1],n=e[0*3+2],i=e[1*3+0],s=e[1*3+1],m=e[1*3+2],a=e[2*3+0],u=e[2*3+1],h=e[2*3+2],d=t[0*3+0],c=t[0*3+1],p=t[0*3+2],l=t[1*3+0],f=t[1*3+1],F=t[1*3+2],O=t[2*3+0],B=t[2*3+1],H=t[2*3+2];return[d*r+c*i+p*a,d*o+c*s+p*u,d*n+c*m+p*h,l*r+f*i+F*a,l*o+f*s+F*u,l*n+f*m+F*h,O*r+B*i+H*a,O*o+B*s+H*u,O*n+B*m+H*h]}function x(e,t,r){return e*(1-r)+t*r}var rt=`#version 300 es

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
`,R=class{gl=null;program=null;posA=null;texcoordA=null;resolutionU=null;brightnessU=null;transformU=null;spriteIdxU=null;spriteCountU=null;vao=null;texture=null;geometry=null;dimensions=null;constructor(t,r,o,n){this.gl=t,this.origin=o;let[i,s]=r;this.dimensions=r,this.geometry=[0,0,i,0,0,s,i,0,i,s,0,s];let m=A(t,t.VERTEX_SHADER,rt),a=A(t,t.FRAGMENT_SHADER,ot);this.program=U(t,m,a),this.posA=t.getAttribLocation(this.program,"a_position"),this.texcoordA=t.getAttribLocation(this.program,"a_texcoord"),this.resolutionU=t.getUniformLocation(this.program,"u_resolution"),this.brightnessU=t.getUniformLocation(this.program,"u_brightness"),this.transformU=t.getUniformLocation(this.program,"u_transform"),this.spriteIdxU=t.getUniformLocation(this.program,"u_sprite_idx"),this.spriteCountU=t.getUniformLocation(this.program,"u_sprite_count"),this.vao=t.createVertexArray();{t.bindVertexArray(this.vao);let u=t.createBuffer();t.bindBuffer(t.ARRAY_BUFFER,u),t.bufferData(t.ARRAY_BUFFER,new Float32Array(this.geometry),t.STATIC_DRAW),t.enableVertexAttribArray(this.posA);let h=2,d=t.FLOAT,c=!1,p=0,l=0;t.vertexAttribPointer(this.posA,h,d,c,p,l)}{let u=t.createBuffer();t.bindBuffer(t.ARRAY_BUFFER,u),t.bufferData(t.ARRAY_BUFFER,new Float32Array([0,0,.5,0,0,1,.5,0,.5,1,0,1]),t.STATIC_DRAW),t.enableVertexAttribArray(this.texcoordA);let h=2,d=t.FLOAT,c=!1,p=0,l=0;t.vertexAttribPointer(this.texcoordA,h,d,c,p,l)}{this.texture=t.createTexture(),t.bindTexture(t.TEXTURE_2D,this.texture),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MIN_FILTER,t.NEAREST),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MAG_FILTER,t.NEAREST),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_S,t.CLAMP_TO_EDGE),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_T,t.CLAMP_TO_EDGE),t.texImage2D(t.TEXTURE_2D,0,t.RGBA,1,1,0,t.RGBA,t.UNSIGNED_BYTE,new Uint8Array([0,0,255,255]));let u=new Image;u.src=n,u.addEventListener("load",()=>{t.bindTexture(t.TEXTURE_2D,this.texture),t.texImage2D(t.TEXTURE_2D,0,t.RGBA,t.RGBA,t.UNSIGNED_BYTE,u),t.generateMipmap(t.TEXTURE_2D)})}}render(t,r){let{brightness:o,x:n,y:i,rotation:s,frame:m}=r,a=this.gl;a.useProgram(this.program),a.bindVertexArray(this.vao),a.bindTexture(a.TEXTURE_2D,this.texture),a.uniform2f(this.resolutionU,t.width,t.height);let u=X(n,i),h=Y(s),d=J(1,1),c=X(-this.origin[0],-this.origin[1]),p=M(u,M(h,M(d,c)));a.uniform1i(this.spriteIdxU,m),a.uniform1i(this.spriteCountU,2),a.uniform1f(this.brightnessU,o),a.uniformMatrix3fv(this.transformU,!1,p),a.drawArrays(a.TRIANGLES,0,6)}};var it=[-1,-1,1,-1,-1,1,1,-1,1,1,-1,1],nt=`#version 300 es

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
}`,C=class{gl=null;program=null;posA=null;resolutionU=null;timeU=null;vao=null;constructor(t){this.gl=t;let r=A(t,t.VERTEX_SHADER,nt),o=A(t,t.FRAGMENT_SHADER,st);this.program=U(t,r,o),this.posA=t.getAttribLocation(this.program,"a_position"),this.resolutionU=t.getUniformLocation(this.program,"u_resolution"),this.timeU=t.getUniformLocation(this.program,"u_time"),this.vao=t.createVertexArray(),t.bindVertexArray(this.vao);let n=t.createBuffer();t.bindBuffer(t.ARRAY_BUFFER,n),t.bufferData(t.ARRAY_BUFFER,new Float32Array(it),t.STATIC_DRAW),t.enableVertexAttribArray(this.posA);let i=2,s=t.FLOAT,m=!1,a=0,u=0;t.vertexAttribPointer(this.posA,i,s,m,a,u)}render(t,r){let o=this.gl;o.useProgram(this.program),o.bindVertexArray(this.vao),o.uniform2f(this.resolutionU,r.width,r.height),o.uniform1f(this.timeU,t/2e3),o.drawArrays(o.TRIANGLES,0,6)}};var D=class{tokens=[];raw="";idx=0;constructor(t){this.raw=t}isAtEnd(){return this.idx>=this.raw.length}},k=e=>e>="a"&&e<="z"||e>="A"&&e<="Z"||e>="0"&&e<="9",at=e=>e>="0"&&e<="9",ut=e=>e===`
`||e===" "||e==="	",ct=e=>t=>{let r=t.idx;for(;!e(t);){if(t.isAtEnd())return t.idx=r,null;t.idx++}let o=t.idx;return t.idx=r,{start:r,end:o}},dt=()=>e=>e.isAtEnd()?{start:e.idx,end:e.idx}:null,b=e=>t=>{let r=t.idx,o=r;for(;e(t.raw[o])&&t.raw[o]!==void 0;)o++;if(o>r)return{start:r,end:o}},g=e=>t=>e(t)||{start:t.idx,end:t.idx},lt=b(k),j=b(at),W=e=>t=>{if(e(t.raw[t.idx]))return{start:t.idx,end:t.idx+1}},Rt=W(ut),y=e=>W(t=>t===e),K=W(e=>!k(e)),S=e=>{let t=[];for(let r=0;r<e.length;r++)t.push(y(e[r]));return _(...t)},_=(...e)=>t=>{let r=t.idx,o=0;for(let n=0;n<e.length;n++){let i=e[n](t);if(!i)return t.idx=r,null;t.idx+=i.end-i.start,o+=i.end-i.start}return t.idx=r,{start:t.idx,end:t.idx+o}},ht=e=>t=>{let r=t.idx,o=e(t);if(o)return t.idx+=o.end-o.start,{start:r,end:r}},N=(e,t)=>r=>{let o=e(r);if(o)return o.type=t,o.parser=e,r.tokens.push(o),r.idx=o.end,o},pt=e=>t=>{for(;t.raw[t.idx]!==void 0;)e(t)},E=(...e)=>t=>{for(let r=0;r<e.length;r++){let o=e[r](t);if(o)return o}},q=e=>t=>{let r=e(t);if(r)return{...r,end:r.start}},mt=(e,t=1)=>r=>{let o=r.idx;if(r.idx=r.idx-t,!e(r)){r.idx=o;return}return r.idx=o,{start:o,end:o}},ft=()=>e=>({start:e.idx,end:e.idx+1}),St=_(lt,q(y("("))),bt=E(_(S("//"),g(b(e=>e!==`
`))),_(S("/*"),ct(E(S("*/"),dt())),g(S("*/")))),xt=E(_(y('"'),g(b(e=>e!=='"')),y('"')),_(y("'"),g(b(e=>e!=="'")),y("'"))),vt=_(j,g(y(".")),g(j)),_t=e=>e.idx===0?{start:0,end:0}:null,yt=e=>e.idx===e.raw.length?{start:e.idx,end:e.idx}:null,Z=e=>_(E(_t,mt(K)),S(e),q(E(yt,K))),$=pt(E(N(xt,"STRING"),N(vt,"NUMBER"),N(Z("null"),"KEYWORD"),N(Z("undefined"),"KEYWORD"),ht(ft())));var Q=({value:e})=>v("pre",{class:"editor_draw"},v("code",null,(()=>{let r=new D(e);return parseResult=$(r),r.tokens.length===0?[e]:r.tokens.reduce((o,n,i,s)=>{let a=s[i-1]?.end||0;n.start>a&&o.push(e.slice(a,n.start));let u=`parsed_${n.type}`,h=e.slice(n.start,n.end);return o.push(v("span",{class:u},h)),i===s.length-1&&o.push(e.slice(n.end)),o},[])})()));var L=[{missiles:{1:{x:100,y:200,rotation:5*Math.PI/4},2:{x:400,y:50,rotation:Math.PI}},ships:{0:{x:100,y:300,health:100,rotation:3*Math.PI/2}}},{missiles:{1:{x:200,y:300,rotation:5*Math.PI/4},2:{x:400,y:100,rotation:Math.PI}},ships:{0:{x:200,y:300,health:100,rotation:3.5*Math.PI/2}}},{missiles:{2:{x:400,y:150,rotation:Math.PI}},ships:{0:{x:300,y:250,health:50,rotation:2*Math.PI}}},{missiles:{2:{x:400,y:200,rotation:Math.PI}},ships:{0:{x:400,y:200,health:50,rotation:2*Math.PI+Math.PI/4}}},{missiles:{},ships:{0:{x:500,y:180,health:20,rotation:2*Math.PI+2*Math.PI/4}}},{missiles:{},ships:{0:{x:600,y:150,health:20,rotation:2*Math.PI+3*Math.PI/4}}},{missiles:{},ships:{0:{x:600,y:150,health:20,rotation:2*Math.PI+3*Math.PI/4}}},{missiles:{},ships:{0:{x:600,y:150,health:20,rotation:2*Math.PI+3*Math.PI/4}}}];function At(){let e=document.getElementById("example-timeline-ships"),t=e.getContext("webgl2");t||console.error("Failed to init webgl."),t.disable(t.DEPTH_TEST),t.blendFunc(t.SRC_ALPHA,t.ONE_MINUS_SRC_ALPHA),t.enable(t.BLEND),V(e,!0);let r=new R(t,[100,100],[50,50],"resources/ship.png"),o=new R(t,[16,32],[8,8],"resources/missile.png"),n=new C(t),i={frameIdx:0,missiles:{1:{x:200,y:50,rotation:Math.PI},2:{x:400,y:-100,rotation:Math.PI}},ships:{0:{x:200,y:200,brightness:0,rotation:0,health:100,frame:0}}};function s(){let h=L.map((c,p)=>{let l=`opacity: ${p===i.frameIdx?1:.5};`;return v("div",{class:"timeline-row",style:l},v(Q,{value:JSON.stringify(c)}))});z(w(v("div",{id:"timeline-controls"},h)),document.getElementById("timeline-controls"))}s();function m(){let h=L[i.frameIdx],d=h.ships[0],c=i.ships[0];c.x=x(c.x,d.x,.1),c.y=x(c.y,d.y,.1),c.health=x(c.health,d.health,.1),c.rotation=x(c.rotation,d.rotation,.1),c.health>d.health?c.brightness=1-d.health/c.health:c.brightness=0,Object.entries(h.missiles).forEach(([p,l])=>{i.missiles[p]||(i.missiles[p]={x:l.x,y:l.y,rotation:l.rotation})}),Object.entries(i.missiles).forEach(([p,l])=>{let f=h.missiles[p];if(f===void 0){delete i.missiles[p];return}l.x=x(l.x,f.x,.1),l.y=x(l.y,f.y,.1),l.health=x(l.health,f.health,.1),l.rotation=x(l.rotation,f.rotation,.1)})}let a=0,u=0;window.requestAnimationFrame(function h(d){d-a>200&&(i.frameIdx=(i.frameIdx+1)%L.length,a=d,s()),d-u>200&&(i.ships[0].frame=(i.ships[0].frame+1)%2,u=d),m(),t.viewport(0,0,e.width,e.height),t.clearColor(0,0,0,0),t.clear(t.COLOR_BUFFER_BIT),n.render(d,e),r.render(e,i.ships[0]),Object.values(i.missiles).forEach(c=>{o.render(e,{...c,brightness:0,frame:0})}),window.requestAnimationFrame(h)})}window.onload=function(){At()};})();
