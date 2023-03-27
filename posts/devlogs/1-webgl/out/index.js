(()=>{var G=class{tokens=[];raw="";idx=0;constructor(r){this.raw=r}isAtEnd(){return this.idx>=this.raw.length}},$=e=>e>="a"&&e<="z"||e>="A"&&e<="Z"||e>="0"&&e<="9",ct=e=>e>="0"&&e<="9",dt=e=>e===`
`||e===" "||e==="	",ut=e=>r=>{let n=r.idx;for(;!e(r);){if(r.isAtEnd())return r.idx=n,null;r.idx++}let t=r.idx;return r.idx=n,{start:n,end:t}},lt=()=>e=>e.isAtEnd()?{start:e.idx,end:e.idx}:null,P=e=>r=>{let n=r.idx,t=n;for(;e(r.raw[t])&&r.raw[t]!==void 0;)t++;if(t>n)return{start:n,end:t}},C=e=>r=>e(r)||{start:r.idx,end:r.idx},ft=P($),j=P(ct),J=e=>r=>{if(e(r.raw[r.idx]))return{start:r.idx,end:r.idx+1}},yt=J(dt),D=e=>J(r=>r===e),k=J(e=>!$(e)),M=e=>{let r=[];for(let n=0;n<e.length;n++)r.push(D(e[n]));return w(...r)},w=(...e)=>r=>{let n=r.idx,t=0;for(let o=0;o<e.length;o++){let i=e[o](r);if(!i)return r.idx=n,null;r.idx+=i.end-i.start,t+=i.end-i.start}return r.idx=n,{start:r.idx,end:r.idx+t}},ht=e=>r=>{let n=r.idx,t=e(r);if(t)return r.idx+=t.end-t.start,{start:n,end:n}},X=(e,r)=>n=>{let t=e(n);if(t)return t.type=r,t.parser=e,n.tokens.push(t),n.idx=t.end,t},pt=e=>r=>{for(;r.raw[r.idx]!==void 0;)e(r)},N=(...e)=>r=>{for(let n=0;n<e.length;n++){let t=e[n](r);if(t)return t}},Q=e=>r=>{let n=e(r);if(n)return{...n,end:n.start}},mt=(e,r=1)=>n=>{let t=n.idx;if(n.idx=n.idx-r,!e(n)){n.idx=t;return}return n.idx=t,{start:t,end:t}},gt=()=>e=>({start:e.idx,end:e.idx+1}),wt=w(ft,Q(D("("))),Ut=N(w(M("//"),C(P(e=>e!==`
`))),w(M("/*"),ut(N(M("*/"),lt())),C(M("*/")))),Et=N(w(D('"'),C(P(e=>e!=='"')),D('"')),w(D("'"),C(P(e=>e!=="'")),D("'"))),Tt=w(j,C(D(".")),C(j)),_t=e=>e.idx===0?{start:0,end:0}:null,xt=e=>e.idx===e.raw.length?{start:e.idx,end:e.idx}:null,Z=e=>w(N(_t,mt(k)),M(e),Q(N(xt,k))),tt=pt(N(X(Et,"STRING"),X(Tt,"NUMBER"),X(Z("null"),"KEYWORD"),X(Z("undefined"),"KEYWORD"),ht(gt())));var O=class extends Array{},z="function";function H(e){return e instanceof O}var A=(e,r,...n)=>{let t=n.reduce((o,i)=>(Array.isArray(i)&&!H(i)?o.push(...i):o.push(i),o),[]);return new O(e,r||{},t)},W=(e,r="__r")=>{if(!H(e))return e;let[n,t,o]=e;t.key=t.key||r;let i=o.map((a,m)=>W(a,r+"c"+(a?.[1]?.key||m)));if(typeof n===z){let a=n({...t,children:i});return W(a,r+"e"+(a?.key||""))}return new O(n,t,i)},At=(e,r)=>{let[,n]=e._hic||[];return Object.entries(r).forEach(([t,o])=>{if(n&&typeof n[t]===z&&e.removeEventListener(t,n[t]),typeof o===z)e.addEventListener(t.toLowerCase(),o);else{if(t==="value"||t==="disabled"){e[t]=o;return}let i=e;i.getAttribute(t)!==o&&i.setAttribute(t,o)}}),e},vt=(e,r)=>{for(let n=r.length-1;n>=0;n--){let t=r[n],o=r[n+1]||null,i=t.nextSibling;(o!==i||!e.contains(t))&&e?.insertBefore(t,o)}for(;e.childNodes.length>r.length;)e?.removeChild(e.childNodes[0]);return e},K=(e,r)=>{let n=r;if(!e&&e!=="")return null;if(!H(e))return r?.nodeType!==3?document.createTextNode(e):(r.textContent!==e&&(r.textContent=e),r);let[t,o]=r?._hic||[],[i,a]=e;if(t!==i||!n){let f=a.xmlns||(i==="svg"?"http://www.w3.org/2000/svg":"http://www.w3.org/1999/xhtml");n=document.createElementNS(f,i)}At(n,a),n._hic=e;let u=(H(e)?e[2]:[]).filter(f=>f).map((f,E)=>{let T=r?.childNodes[E];return K(f,T)});return vt(n,u),r!==n&&r?.parentNode?.replaceChild(n,r),typeof a.ref===z&&a.ref!==o?.ref&&a.ref(n,a.key),n};function Y(e,r,n){var t=e.createShader(r);e.shaderSource(t,n),e.compileShader(t);var o=e.getShaderParameter(t,e.COMPILE_STATUS);if(o)return t;console.log(e.getShaderInfoLog(t)),e.deleteShader(t)}function et(e,r,n){var t=e.createProgram();e.attachShader(t,r),e.attachShader(t,n),e.linkProgram(t);var o=e.getProgramParameter(t,e.LINK_STATUS);if(o)return t;console.log(e.getProgramInfoLog(t)),e.deleteProgram(t)}function rt(e,r=!0){let n=e.clientWidth,t=e.clientHeight,o=r?n*2:n,i=r?t*2:t,a=e.width!==o||e.height!==i;return a&&(e.width=o,e.height=i),a}function V(e,r){return[1,0,0,0,1,0,e,r,1]}function nt(e){let r=Math.cos(e),n=Math.sin(e);return[r,-n,0,n,r,0,0,0,1]}function ot(e,r){return[e,0,0,0,r,0,0,0,1]}function I(e,r){var n=e[0],t=e[0*3+1],o=e[0*3+2],i=e[1*3+0],a=e[1*3+1],m=e[1*3+2],u=e[2*3+0],f=e[2*3+1],E=e[2*3+2],T=r[0*3+0],v=r[0*3+1],R=r[0*3+2],b=r[1*3+0],c=r[1*3+1],h=r[1*3+2],L=r[2*3+0],s=r[2*3+1],l=r[2*3+2];return[T*n+v*i+R*u,T*t+v*a+R*f,T*o+v*m+R*E,b*n+c*i+h*u,b*t+c*a+h*f,b*o+c*m+h*E,L*n+s*i+l*u,L*t+s*a+l*f,L*o+s*m+l*E]}function Rt(){let e=`#version 300 es

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
    `,r=`#version 300 es
        precision highp float;
        
        in vec2 v_texcoord;
        out vec4 outColor;
        uniform float u_brightness;
        uniform sampler2D u_texture;

        void main() {
            vec4 textureColor = texture(u_texture, v_texcoord);
            vec4 brightenedColor = textureColor + u_brightness * vec4(1.0, 1.0, 1.0, 0.0);
            outColor = vec4(brightenedColor.rgb, textureColor.a);
        }
    `,n=document.getElementById("canvas-textured-squares"),t=n.getContext("webgl2");t||console.error("Failed to init webgl."),t.disable(t.DEPTH_TEST),t.blendFunc(t.SRC_ALPHA,t.ONE_MINUS_SRC_ALPHA),t.enable(t.BLEND);let o=[0,0,100,0,0,100,100,0,100,100,0,100],i=[50,50],a=Y(t,t.VERTEX_SHADER,e),m=Y(t,t.FRAGMENT_SHADER,r),u=et(t,a,m),f=t.getAttribLocation(u,"a_position"),E=t.getUniformLocation(u,"u_resolution"),T=t.getUniformLocation(u,"u_brightness"),v=t.getUniformLocation(u,"u_transform"),R=t.getAttribLocation(u,"a_texcoord"),b=t.createVertexArray();t.bindVertexArray(b);{let s=t.createBuffer();t.bindBuffer(t.ARRAY_BUFFER,s),t.bufferData(t.ARRAY_BUFFER,new Float32Array(o),t.STATIC_DRAW),t.enableVertexAttribArray(f);let l=2,S=t.FLOAT,_=!1,y=0,g=0;t.vertexAttribPointer(f,l,S,_,y,g)}{let s=t.createBuffer();t.bindBuffer(t.ARRAY_BUFFER,s),t.bufferData(t.ARRAY_BUFFER,new Float32Array([0,0,.5,0,0,1,.5,0,.5,1,0,1]),t.STATIC_DRAW),t.enableVertexAttribArray(R);let l=2,S=t.FLOAT,_=!1,y=0,g=0;t.vertexAttribPointer(R,l,S,_,y,g)}{let s=t.createTexture();t.bindTexture(t.TEXTURE_2D,s),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MIN_FILTER,t.NEAREST),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MAG_FILTER,t.NEAREST),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_S,t.CLAMP_TO_EDGE),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_T,t.CLAMP_TO_EDGE),t.texImage2D(t.TEXTURE_2D,0,t.RGBA,1,1,0,t.RGBA,t.UNSIGNED_BYTE,new Uint8Array([0,0,255,255]));let l=new Image;l.src="resources/ship2.png",l.addEventListener("load",()=>{t.bindTexture(t.TEXTURE_2D,s),t.texImage2D(t.TEXTURE_2D,0,t.RGBA,t.RGBA,t.UNSIGNED_BYTE,l),t.generateMipmap(t.TEXTURE_2D)})}rt(n,!0);let c=[];for(let s=0;s<10;s++){let l=Math.random()*400,S=Math.random()*400,_=Math.random(),y=Math.random(),g=Math.random()*Math.PI*2;c.push({brightness:y,rotation:g,x:l,y:S,scale:_})}function h(){t.viewport(0,0,n.width,n.height),t.clearColor(0,0,0,0),t.clear(t.COLOR_BUFFER_BIT),t.useProgram(u),t.bindVertexArray(b),t.uniform2f(E,n.width,n.height);for(let s=0;s<c.length;s++){let{brightness:l,x:S,y:_,rotation:y,scale:g}=c[s],q=V(S,_),p=nt(y),d=ot(g,g),x=V(-i[0],-i[1]),U=I(q,I(p,I(d,x)));t.uniform1f(T,l),t.uniformMatrix3fv(v,!1,U),t.drawArrays(t.TRIANGLES,0,6)}}function L(){for(let s=0;s<c.length;s++)c[s].rotation-=.01,c[s].scale=.5+Math.sin(c[s].rotation*2)*.2,c[s].brightness=c[s].rotation<.05?1:0,c[s].rotation<0&&(c[s].rotation+=Math.PI*2)}window.requestAnimationFrame(function s(){L(),h(),window.requestAnimationFrame(s)})}var bt=({value:e,onChange:r})=>{let n=()=>{let o=new G(e);return parseResult=tt(o),o.tokens.length===0?[e]:o.tokens.reduce((i,a,m,u)=>{let E=u[m-1]?.end||0;a.start>E&&i.push(e.slice(E,a.start));let T=`parsed_${a.type}`,v=e.slice(a.start,a.end);return i.push(A("span",{class:T},v)),m===u.length-1&&i.push(e.slice(a.end)),i},[])},t=o=>{r(o)};return A("div",{id:"editor",class:"editor_container"},A("textarea",{class:"editor_textarea",value:e,input:o=>t(o.target.value)}),A("pre",{class:"editor_draw"},A("code",null,n())))};function St(){let e=`#version 300 es

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
    `,r=`#version 300 es
        precision highp float;
        
        in vec2 v_texcoord;
        out vec4 outColor;
        uniform float u_brightness;
        uniform sampler2D u_texture;

        void main() {
            vec4 textureColor = texture(u_texture, v_texcoord);
            vec4 brightenedColor = textureColor + u_brightness * vec4(1.0, 1.0, 1.0, 0.0);
            outColor = vec4(brightenedColor.rgb, textureColor.a);
        }
    `,n=document.getElementById("canvas-json-driven-ship"),t=n.getContext("webgl2");t||console.error("Failed to init webgl."),t.disable(t.DEPTH_TEST),t.blendFunc(t.SRC_ALPHA,t.ONE_MINUS_SRC_ALPHA),t.enable(t.BLEND);let o=[0,0,100,0,0,100,100,0,100,100,0,100],i=[50,50],a=Y(t,t.VERTEX_SHADER,e),m=Y(t,t.FRAGMENT_SHADER,r),u=et(t,a,m),f=t.getAttribLocation(u,"a_position"),E=t.getUniformLocation(u,"u_resolution"),T=t.getUniformLocation(u,"u_brightness"),v=t.getUniformLocation(u,"u_transform"),R=t.getAttribLocation(u,"a_texcoord"),b=t.createVertexArray();t.bindVertexArray(b);{let p=t.createBuffer();t.bindBuffer(t.ARRAY_BUFFER,p),t.bufferData(t.ARRAY_BUFFER,new Float32Array(o),t.STATIC_DRAW),t.enableVertexAttribArray(f);let d=2,x=t.FLOAT,U=!1,B=0,F=0;t.vertexAttribPointer(f,d,x,U,B,F)}{let p=t.createBuffer();t.bindBuffer(t.ARRAY_BUFFER,p),t.bufferData(t.ARRAY_BUFFER,new Float32Array([0,0,.5,0,0,1,.5,0,.5,1,0,1]),t.STATIC_DRAW),t.enableVertexAttribArray(R);let d=2,x=t.FLOAT,U=!1,B=0,F=0;t.vertexAttribPointer(R,d,x,U,B,F)}{let p=t.createTexture();t.bindTexture(t.TEXTURE_2D,p),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MIN_FILTER,t.NEAREST),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MAG_FILTER,t.NEAREST),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_S,t.CLAMP_TO_EDGE),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_T,t.CLAMP_TO_EDGE),t.texImage2D(t.TEXTURE_2D,0,t.RGBA,1,1,0,t.RGBA,t.UNSIGNED_BYTE,new Uint8Array([0,0,255,255]));let d=new Image;d.src="resources/ship2.png",d.addEventListener("load",()=>{t.bindTexture(t.TEXTURE_2D,p),t.texImage2D(t.TEXTURE_2D,0,t.RGBA,t.RGBA,t.UNSIGNED_BYTE,d),t.generateMipmap(t.TEXTURE_2D)})}rt(n,!0);let c={x:200,y:200,brightness:0,rotation:0,health:100},h={x:200,y:200,brightness:0,rotation:0,health:100},s=JSON.stringify({x:200,y:200,health:100,rotation:0},null,2),l=null;function S(p){s=p;try{let d=JSON.parse(s);d.x&&(h.x=d.x),d.y&&(h.y=d.y),d.rotation&&(h.rotation=d.rotation),d.health&&(h.health=d.health),l=null}catch(d){l=d}_()}function _(){K(W(A("div",{id:"editor"},A(bt,{value:s,onChange:S}),A("div",{class:"error-container"},l&&A("p",null,l.toString())))),document.getElementById("editor"))}_();function y(){t.viewport(0,0,n.width,n.height),t.clearColor(0,0,0,0),t.clear(t.COLOR_BUFFER_BIT),t.useProgram(u),t.bindVertexArray(b),t.uniform2f(E,n.width,n.height);let{brightness:p,x:d,y:x,rotation:U}=c,B=V(d,x),F=nt(U),it=ot(1,1),st=V(-i[0],-i[1]),at=I(B,I(F,I(it,st)));t.uniform1f(T,p),t.uniformMatrix3fv(v,!1,at),t.drawArrays(t.TRIANGLES,0,6)}function g(p,d,x){return p*(1-x)+d*x}function q(){c.x=g(c.x,h.x,.1),c.y=g(c.y,h.y,.1),c.health=g(c.health,h.health,.5),c.rotation=g(c.rotation,h.rotation,.1),c.health>h.health?(c.brightness=1-h.health/c.health,console.log(c.brightness)):c.brightness=0}window.requestAnimationFrame(function p(){q(),y(),window.requestAnimationFrame(p)})}window.onload=function(){Rt(),St()};})();
