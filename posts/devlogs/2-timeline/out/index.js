(()=>{var O=class{tokens=[];raw="";idx=0;constructor(r){this.raw=r}isAtEnd(){return this.idx>=this.raw.length}},nt=e=>e>="a"&&e<="z"||e>="A"&&e<="Z"||e>="0"&&e<="9",_t=e=>e>="0"&&e<="9",Tt=e=>e===`
`||e===" "||e==="	",Et=e=>r=>{let n=r.idx;for(;!e(r);){if(r.isAtEnd())return r.idx=n,null;r.idx++}let t=r.idx;return r.idx=n,{start:n,end:t}},yt=()=>e=>e.isAtEnd()?{start:e.idx,end:e.idx}:null,C=e=>r=>{let n=r.idx,t=n;for(;e(r.raw[t])&&r.raw[t]!==void 0;)t++;if(t>n)return{start:n,end:t}},S=e=>r=>e(r)||{start:r.idx,end:r.idx},At=C(nt),tt=C(_t),W=e=>r=>{if(e(r.raw[r.idx]))return{start:r.idx,end:r.idx+1}},Gt=W(Tt),T=e=>W(r=>r===e),et=W(e=>!nt(e)),U=e=>{let r=[];for(let n=0;n<e.length;n++)r.push(T(e[n]));return x(...r)},x=(...e)=>r=>{let n=r.idx,t=0;for(let o=0;o<e.length;o++){let i=e[o](r);if(!i)return r.idx=n,null;r.idx+=i.end-i.start,t+=i.end-i.start}return r.idx=n,{start:r.idx,end:r.idx+t}},St=e=>r=>{let n=r.idx,t=e(r);if(t)return r.idx+=t.end-t.start,{start:n,end:n}},B=(e,r)=>n=>{let t=e(n);if(t)return t.type=r,t.parser=e,n.tokens.push(t),n.idx=t.end,t},Rt=e=>r=>{for(;r.raw[r.idx]!==void 0;)e(r)},R=(...e)=>r=>{for(let n=0;n<e.length;n++){let t=e[n](r);if(t)return t}},ot=e=>r=>{let n=e(r);if(n)return{...n,end:n.start}},bt=(e,r=1)=>n=>{let t=n.idx;if(n.idx=n.idx-r,!e(n)){n.idx=t;return}return n.idx=t,{start:t,end:t}},Pt=()=>e=>({start:e.idx,end:e.idx+1}),Vt=x(At,ot(T("("))),Xt=R(x(U("//"),S(C(e=>e!==`
`))),x(U("/*"),Et(R(U("*/"),yt())),S(U("*/")))),wt=R(x(T('"'),S(C(e=>e!=='"')),T('"')),x(T("'"),S(C(e=>e!=="'")),T("'"))),It=x(tt,S(T(".")),S(tt)),Mt=e=>e.idx===0?{start:0,end:0}:null,Lt=e=>e.idx===e.raw.length?{start:e.idx,end:e.idx}:null,rt=e=>x(R(Mt,bt(et)),U(e),ot(R(Lt,et))),it=Rt(R(B(wt,"STRING"),B(It,"NUMBER"),B(rt("null"),"KEYWORD"),B(rt("undefined"),"KEYWORD"),St(Pt())));var N=class extends Array{},H="function";function z(e){return e instanceof N}var E=(e,r,...n)=>{let t=n.reduce((o,i)=>(Array.isArray(i)&&!z(i)?o.push(...i):o.push(i),o),[]);return new N(e,r||{},t)},G=(e,r="__r")=>{if(!z(e))return e;let[n,t,o]=e;t.key=t.key||r;let i=o.map((s,m)=>G(s,r+"c"+(s?.[1]?.key||m)));if(typeof n===H){let s=n({...t,children:i});return G(s,r+"e"+(s?.key||""))}return new N(n,t,i)},Ut=(e,r)=>{let[,n]=e._hic||[];return Object.entries(r).forEach(([t,o])=>{if(n&&typeof n[t]===H&&e.removeEventListener(t,n[t]),typeof o===H)e.addEventListener(t.toLowerCase(),o);else{if(t==="value"||t==="disabled"){e[t]=o;return}let i=e;i.getAttribute(t)!==o&&i.setAttribute(t,o)}}),e},Ct=(e,r)=>{for(let n=r.length-1;n>=0;n--){let t=r[n],o=r[n+1]||null,i=t.nextSibling;(o!==i||!e.contains(t))&&e?.insertBefore(t,o)}for(;e.childNodes.length>r.length;)e?.removeChild(e.childNodes[0]);return e},Y=(e,r)=>{let n=r;if(!e&&e!=="")return null;if(!z(e))return r?.nodeType!==3?document.createTextNode(e):(r.textContent!==e&&(r.textContent=e),r);let[t,o]=r?._hic||[],[i,s]=e;if(t!==i||!n){let l=s.xmlns||(i==="svg"?"http://www.w3.org/2000/svg":"http://www.w3.org/1999/xhtml");n=document.createElementNS(l,i)}Ut(n,s),n._hic=e;let d=(z(e)?e[2]:[]).filter(l=>l).map((l,f)=>{let v=r?.childNodes[f];return Y(l,v)});return Ct(n,d),r!==n&&r?.parentNode?.replaceChild(n,r),typeof s.ref===H&&s.ref!==o?.ref&&s.ref(n,s.key),n};function D(e,r,n){var t=e.createShader(r);e.shaderSource(t,n),e.compileShader(t);var o=e.getShaderParameter(t,e.COMPILE_STATUS);if(o)return t;console.log(e.getShaderInfoLog(t)),e.deleteShader(t)}function J(e,r,n){var t=e.createProgram();e.attachShader(t,r),e.attachShader(t,n),e.linkProgram(t);var o=e.getProgramParameter(t,e.LINK_STATUS);if(o)return t;console.log(e.getProgramInfoLog(t)),e.deleteProgram(t)}function st(e,r=!0){let n=e.clientWidth,t=e.clientHeight,o=r?n*2:n,i=r?t*2:t,s=e.width!==o||e.height!==i;return s&&(e.width=o,e.height=i),s}function K(e,r){return[1,0,0,0,1,0,e,r,1]}function at(e){let r=Math.cos(e),n=Math.sin(e);return[r,-n,0,n,r,0,0,0,1]}function ct(e,r){return[e,0,0,0,r,0,0,0,1]}function V(e,r){var n=e[0],t=e[0*3+1],o=e[0*3+2],i=e[1*3+0],s=e[1*3+1],m=e[1*3+2],d=e[2*3+0],l=e[2*3+1],f=e[2*3+2],v=r[0*3+0],b=r[0*3+1],y=r[0*3+2],A=r[1*3+0],P=r[1*3+1],w=r[1*3+2],I=r[2*3+0],M=r[2*3+1],L=r[2*3+2];return[v*n+b*i+y*d,v*t+b*s+y*l,v*o+b*m+y*f,A*n+P*i+w*d,A*t+P*s+w*l,A*o+P*m+w*f,I*n+M*i+L*d,I*t+M*s+L*l,I*o+M*m+L*f]}function F(e,r,n){return e*(1-n)+r*n}var Dt=`#version 300 es

in vec2 a_position;

out vec2 v_texcoord;

void main() {
    gl_Position = vec4(a_position, 0.9, 1.);
}
`,Ft=`#version 300 es
precision mediump float;

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
}`,Bt=[-1,-1,1,-1,-1,1,1,-1,1,1,-1,1],Ot=[0,0,100,0,0,100,100,0,100,100,0,100],lt=[50,50],Ht=({value:e})=>E("pre",{class:"editor_draw"},E("code",null,(()=>{let n=new O(e);return parseResult=it(n),n.tokens.length===0?[e]:n.tokens.reduce((t,o,i,s)=>{let d=s[i-1]?.end||0;o.start>d&&t.push(e.slice(d,o.start));let l=`parsed_${o.type}`,f=e.slice(o.start,o.end);return t.push(E("span",{class:l},f)),i===s.length-1&&t.push(e.slice(o.end)),t},[])})()));function zt(){let e=`#version 300 es

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
    `,n=document.getElementById("example-timeline-ships"),t=n.getContext("webgl2");t||console.error("Failed to init webgl."),t.disable(t.DEPTH_TEST),t.blendFunc(t.SRC_ALPHA,t.ONE_MINUS_SRC_ALPHA),t.enable(t.BLEND);let o=D(t,t.VERTEX_SHADER,e),i=D(t,t.FRAGMENT_SHADER,r),s=J(t,o,i),m=D(t,t.VERTEX_SHADER,Dt),d=D(t,t.FRAGMENT_SHADER,Ft),l=J(t,m,d),f=t.getAttribLocation(l,"a_position"),v=t.getUniformLocation(l,"u_resolution"),b=t.getUniformLocation(l,"u_time"),y=t.getAttribLocation(s,"a_position"),A=t.getAttribLocation(s,"a_texcoord"),P=t.getUniformLocation(s,"u_resolution"),w=t.getUniformLocation(s,"u_brightness"),I=t.getUniformLocation(s,"u_transform"),M=t.getUniformLocation(s,"u_sprite_idx"),L=t.getUniformLocation(s,"u_sprite_count"),Z=t.createVertexArray(),j=t.createVertexArray(),ut={};{t.bindVertexArray(j);let c=t.createBuffer();t.bindBuffer(t.ARRAY_BUFFER,c),t.bufferData(t.ARRAY_BUFFER,new Float32Array(Bt),t.STATIC_DRAW),t.enableVertexAttribArray(f);let a=2,u=t.FLOAT,h=!1,p=0,_=0;t.vertexAttribPointer(f,a,u,h,p,_)}{t.bindVertexArray(Z);let c=t.createBuffer();t.bindBuffer(t.ARRAY_BUFFER,c),t.bufferData(t.ARRAY_BUFFER,new Float32Array(Ot),t.STATIC_DRAW),t.enableVertexAttribArray(y);let a=2,u=t.FLOAT,h=!1,p=0,_=0;t.vertexAttribPointer(y,a,u,h,p,_)}{let c=t.createBuffer();t.bindBuffer(t.ARRAY_BUFFER,c),t.bufferData(t.ARRAY_BUFFER,new Float32Array([0,0,.5,0,0,1,.5,0,.5,1,0,1]),t.STATIC_DRAW),t.enableVertexAttribArray(A);let a=2,u=t.FLOAT,h=!1,p=0,_=0;t.vertexAttribPointer(A,a,u,h,p,_)}function k(c){let a=t.createTexture();t.bindTexture(t.TEXTURE_2D,a),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MIN_FILTER,t.NEAREST),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MAG_FILTER,t.NEAREST),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_S,t.CLAMP_TO_EDGE),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_T,t.CLAMP_TO_EDGE),t.texImage2D(t.TEXTURE_2D,0,t.RGBA,1,1,0,t.RGBA,t.UNSIGNED_BYTE,new Uint8Array([0,0,255,255]));let u=new Image;u.src="resources/ship2.png",u.addEventListener("load",()=>{t.bindTexture(t.TEXTURE_2D,a),t.texImage2D(t.TEXTURE_2D,0,t.RGBA,t.RGBA,t.UNSIGNED_BYTE,u),t.generateMipmap(t.TEXTURE_2D)}),ut[c]=a}k("resources/ship2.png"),k("resources/missile.png"),st(n,!0);let g={frameIdx:0,ship:{x:200,y:200,brightness:0,rotation:0,health:100,frame:0}},X=[{x:100,y:300,health:100,rotation:3*Math.PI/2},{x:100,y:300,health:100,rotation:3*Math.PI/2},{x:100,y:300,health:100,rotation:3*Math.PI/2},{x:200,y:300,health:100,rotation:3.5*Math.PI/2},{x:300,y:250,health:50,rotation:2*Math.PI},{x:400,y:200,health:50,rotation:2*Math.PI+Math.PI/4},{x:500,y:180,health:20,rotation:2*Math.PI+2*Math.PI/4},{x:600,y:150,health:20,rotation:2*Math.PI+3*Math.PI/4},{x:600,y:150,health:20,rotation:2*Math.PI+3*Math.PI/4},{x:600,y:150,health:20,rotation:2*Math.PI+3*Math.PI/4}];function q(){let c=X.map((u,h)=>{let p=`opacity: ${h===g.frameIdx?1:.5};`;return E("div",{class:"timeline-row",style:p},E(Ht,{value:JSON.stringify(u)}))});Y(G(E("div",{id:"timeline-controls"},c)),document.getElementById("timeline-controls"))}q();function dt(c){t.useProgram(s),t.bindVertexArray(Z),t.uniform2f(P,n.width,n.height);let{brightness:a,x:u,y:h,rotation:p,frame:_}=c,ht=K(u,h),pt=at(p),gt=ct(1,1),xt=K(-lt[0],-lt[1]),vt=V(ht,V(pt,V(gt,xt)));t.uniform1i(M,_),t.uniform1i(L,2),t.uniform1f(w,a),t.uniformMatrix3fv(I,!1,vt),t.drawArrays(t.TRIANGLES,0,6)}function ft(c){t.useProgram(l),t.bindVertexArray(j),t.uniform2f(v,n.width,n.height),t.uniform1f(b,c/2e3),t.drawArrays(t.TRIANGLES,0,6)}function mt(){let c=X[g.frameIdx],a=g.ship;a.x=F(a.x,c.x,.1),a.y=F(a.y,c.y,.1),a.health=F(a.health,c.health,.1),a.rotation=F(a.rotation,c.rotation,.1),a.health>c.health?a.brightness=1-c.health/a.health:a.brightness=0}let $=0,Q=0;window.requestAnimationFrame(function c(a){a-$>200&&(g.frameIdx=(g.frameIdx+1)%X.length,$=a,q()),a-Q>200&&(g.ship.frame=(g.ship.frame+1)%2,Q=a),mt(),t.viewport(0,0,n.width,n.height),t.clearColor(0,0,0,0),t.clear(t.COLOR_BUFFER_BIT),ft(a),dt(g.ship),window.requestAnimationFrame(c)})}window.onload=function(){zt()};})();
