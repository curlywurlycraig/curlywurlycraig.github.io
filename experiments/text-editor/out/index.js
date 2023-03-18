(()=>{var C=class extends Array{},O="function";function T(t){return t instanceof C}var l=(t,e,...n)=>{let r=n.reduce((s,o)=>(Array.isArray(o)&&!T(o)?s.push(...o):s.push(o),s),[]);return new C(t,e||{},r)},h=(t,e="__r")=>{if(!T(t))return t;let[n,r,s]=t;r.key=r.key||e;let o=s.map((d,i)=>h(d,e+"c"+(d?.[1]?.key||i)));if(typeof n===O){let d=n({...r,children:o});return h(d,e+"e"+(d?.key||""))}return new C(n,r,o)},q=(t,e)=>{let[,n]=t._hic||[];return Object.entries(e).forEach(([r,s])=>{if(n&&typeof n[r]===O&&t.removeEventListener(r,n[r]),typeof s===O)t.addEventListener(r.toLowerCase(),s);else{if(r==="value"||r==="disabled"){t[r]=s;return}let o=t;o.getAttribute(r)!==s&&o.setAttribute(r,s)}}),t},$=(t,e)=>{for(let n=e.length-1;n>=0;n--){let r=e[n],s=e[n+1]||null,o=r.nextSibling;(s!==o||!t.contains(r))&&t?.insertBefore(r,s)}for(;t.childNodes.length>e.length;)t?.removeChild(t.childNodes[0]);return t},w=(t,e)=>{let n=e;if(!t&&t!=="")return null;if(!T(t))return e?.nodeType!==3?document.createTextNode(t):(e.textContent!==t&&(e.textContent=t),e);let[r,s]=e?._hic||[],[o,d]=t;if(r!==o||!n){let c=d.xmlns||(o==="svg"?"http://www.w3.org/2000/svg":"http://www.w3.org/1999/xhtml");n=document.createElementNS(c,o)}q(n,d),n._hic=t;let g=(T(t)?t[2]:[]).filter(c=>c).map((c,u)=>{let E=e?.childNodes[u];return w(c,E)});return $(n,g),e!==n&&e?.parentNode?.replaceChild(n,e),typeof d.ref===O&&d.ref!==s?.ref&&d.ref(n,d.key),n};var K=t=>e=>{let n={},r={},s={},o={},d=(i,g)=>{let c={key:i,...g};return Object.keys(t).forEach(u=>{c[u]=n[i][u],c["set"+u[0].toUpperCase()+u.slice(1)]=s[i][u]}),c};return({key:i,_setPostRender:g,...c})=>{let u=f=>{r[i]=f,f&&w(o[i],f)};n[i]||(n[i]={},s[i]={},Object.entries(t).map(([f,G])=>{n[i][f]=G,s[i][f]=J=>{n[i][f]=J;let Z=d(i,c),_=h(l(e,{ref:u,...Z}),i+"e"),S=r[i];o[i]=_,S&&w(_,S)}}));let E=d(i,c);return l(e,{ref:u,...E})}};var A=(...t)=>{let e=t[t.length-1];for(let n=t.length-2;n>=0;n--)e=t[n](e);return e};var I=class{tokens=[];raw="";idx=0;constructor(e){this.raw=e}},v=t=>t>="a"&&t<="z"||t>="A"&&t<="Z"||t>="0"&&t<="9",Q=t=>t>="0"&&t<="9",V=t=>t===`
`||t===" "||t==="	",N=t=>e=>{let n=e.idx,r=n;for(;t(e.raw[r])&&e.raw[r]!==void 0;)r++;if(r>n)return{start:n,end:r}},R=t=>e=>t(e)||{start:e.idx,end:e.idx},X=N(v),b=N(Q),W=t=>e=>{if(t(e.raw[e.idx]))return{start:e.idx,end:e.idx+1}},ut=W(V),m=t=>W(e=>e===t),D=W(t=>!v(t)),Y=t=>{let e=[];for(let n=0;n<t.length;n++)e.push(m(t[n]));return x(...e)},x=(...t)=>e=>{let n=e.idx,r=0;for(let s=0;s<t.length;s++){let o=t[s](e);if(!o)return e.idx=n,null;e.idx+=o.end-o.start,r+=o.end-o.start}return e.idx=n,{start:e.idx,end:e.idx+r}},P=t=>e=>{let n=e.idx,r=t(e);if(r)return e.idx+=r.end-r.start,{start:n,end:n}},a=(t,e)=>n=>{let r=t(n);if(r)return r.type=e,r.parser=t,n.tokens.push(r),n.idx=r.end,r},B=t=>e=>{for(;e.raw[e.idx]!==void 0;)t(e)},y=(...t)=>e=>{for(let n=0;n<t.length;n++){let r=t[n](e);if(r)return r}},L=t=>e=>{let n=t(e);if(n)return{...n,end:n.start}},k=(t,e=1)=>n=>{let r=n.idx;if(n.idx=n.idx-e,!t(n)){n.idx=r;return}return n.idx=r,{start:r,end:r}},M=()=>t=>({start:t.idx,end:t.idx+1}),H=x(X,L(m("("))),U=x(Y("//"),R(N(t=>t!==`
`))),j=y(x(m('"'),R(N(t=>t!=='"')),m('"')),x(m("'"),R(N(t=>t!=="'")),m("'"))),tt=x(b,R(m(".")),R(b)),et=t=>t.idx===0?{start:0,end:0}:null,nt=t=>t.idx===t.raw.length?{start:t.idx,end:t.idx}:null,p=t=>x(y(et,k(D)),Y(t),L(y(nt,D))),lt=B(y(a(H,"FUNC_CALL"),a(U,"COMMENT"),a(j,"STRING"),a(p("void"),"KEYWORD"),a(p("return"),"KEYWORD"),a(p("int"),"KEYWORD"),a(p("double"),"KEYWORD"),a(p("struct"),"KEYWORD"),a(p("typedef"),"KEYWORD"),P(M()))),F=B(y(a(H,"FUNC_CALL"),a(U,"COMMENT"),a(j,"STRING"),a(tt,"NUMBER"),a(p("function"),"KEYWORD"),a(p("const"),"KEYWORD_CONST"),a(p("export"),"KEYWORD"),a(p("return"),"KEYWORD"),a(p("null"),"KEYWORD"),a(p("undefined"),"KEYWORD"),P(M())));var z=`export class ParseContext {
    tokens = [];
    raw = "";
    idx = 0;

    constructor(inp) {
        this.raw = inp;
    }
}

const isAlpha = (c) => {
    return (
        (c >= 'a' && c <= 'z') ||
        (c >= 'A' && c <= 'Z') ||
        (c >= '0' && c <= '9'));
}

const isWhitespace = (c) => {
    return (c === '\\n' || c === ' ' || c === '\\t');
}

const parseWhileChar = (charCond) => (ctx) => {
    const startIndex = ctx.idx;
    let endIndex = startIndex;
    while (charCond(ctx.raw[endIndex]) && ctx.raw[endIndex] !== undefined) {
        endIndex++;
    }

    if (endIndex > startIndex) {
        return {
            start: startIndex,
            end: endIndex
        };
    }
}
`;var st=A(K({width:0}),({value:t,onChange:e,ref:n})=>l("div",{ref:n,class:"editor_container"},l("textarea",{class:"editor_textarea",value:t,input:s=>e(s.target.value)}),l("pre",{class:"editor_draw"},l("code",null,(()=>{let s=new I(t);return parseResult=F(s),s.tokens.length===0?[t]:s.tokens.reduce((o,d,i,g)=>{let u=g[i-1]?.end||0;d.start>u&&o.push(t.slice(u,d.start));let E=`parsed_${d.type}`,f=t.slice(d.start,d.end);return o.push(l("span",{class:E},f)),i===g.length-1&&o.push(t.slice(d.end)),o},[])})())))),ot=A(K({editorContent:z}),({editorContent:t,setEditorContent:e,ref:n})=>l("div",{ref:n},l(st,{onChange:e,value:t}))),it=document.getElementById("demo");w(h(l(ot,null)),it);})();
