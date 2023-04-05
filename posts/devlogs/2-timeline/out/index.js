(() => {
  // src/vdom.ts
  var HicType = class extends Array {
  };
  var FUNC_TOKEN = "function";
  function isHic(a) {
    return a instanceof HicType;
  }
  var hic = (name, options, ...children) => {
    const flatChildren = children.reduce((acc, child) => {
      if (Array.isArray(child) && !isHic(child)) {
        acc.push(...child);
      } else {
        acc.push(child);
      }
      return acc;
    }, []);
    return new HicType(name, options || {}, flatChildren);
  };
  var render = (hic2, key = "__r") => {
    if (!isHic(hic2)) {
      return hic2;
    }
    const [tag, attrs, children] = hic2;
    attrs.key = attrs.key || key;
    const renderedChildren = children.map((child, idx) => {
      return render(child, key + "c" + (child?.[1]?.key || idx));
    });
    if (typeof tag === FUNC_TOKEN) {
      const renderResult = tag({ ...attrs, children: renderedChildren });
      return render(renderResult, key + "e" + (renderResult?.key || ""));
    }
    return new HicType(tag, attrs, renderedChildren);
  };
  var updateAttrs = (el, attrs) => {
    const [, prevAttrs] = el._hic || [];
    Object.entries(attrs).forEach(([k, v]) => {
      if (prevAttrs && typeof prevAttrs[k] === FUNC_TOKEN) {
        el.removeEventListener(k, prevAttrs[k]);
      }
      if (typeof v === FUNC_TOKEN) {
        el.addEventListener(k.toLowerCase(), v);
      } else {
        if (k === "value" || k === "disabled") {
          el[k] = v;
          return;
        }
        const asElement = el;
        if (asElement.getAttribute(k) !== v) {
          asElement.setAttribute(k, v);
        }
      }
    });
    return el;
  };
  var updateChildren = (el, newChildren) => {
    for (let i = newChildren.length - 1; i >= 0; i--) {
      const currChild = newChildren[i];
      const desiredNextSibling = newChildren[i + 1] || null;
      const existingNextSibling = currChild.nextSibling;
      if (desiredNextSibling !== existingNextSibling || !el.contains(currChild)) {
        el?.insertBefore(currChild, desiredNextSibling);
      }
    }
    while (el.childNodes.length > newChildren.length) {
      el?.removeChild(el.childNodes[0]);
    }
    return el;
  };
  var apply = (hic2, el) => {
    let result = el;
    if (!hic2 && hic2 !== "") {
      return null;
    }
    if (!isHic(hic2)) {
      if (el?.nodeType !== 3) {
        return document.createTextNode(hic2);
      }
      if (el.textContent !== hic2) {
        el.textContent = hic2;
      }
      return el;
    }
    const [prevTag, prevAttrs] = el?._hic || [];
    const [tag, attrs] = hic2;
    if (prevTag !== tag || !result) {
      const currentNS = attrs.xmlns || (tag === "svg" ? "http://www.w3.org/2000/svg" : "http://www.w3.org/1999/xhtml");
      result = document.createElementNS(currentNS, tag);
    }
    updateAttrs(result, attrs);
    result._hic = hic2;
    const children = isHic(hic2) ? hic2[2] : [];
    const newChildren = children.filter((c) => c).map((child, idx) => {
      const existingNode = el?.childNodes[idx];
      return apply(child, existingNode);
    });
    updateChildren(result, newChildren);
    if (el !== result) {
      el?.parentNode?.replaceChild(result, el);
    }
    if (typeof attrs.ref === FUNC_TOKEN && attrs.ref !== prevAttrs?.ref) {
      attrs.ref(result, attrs.key);
    }
    return result;
  };

  // src/gfx/webgl-utils.js
  function createShader(gl, type, source) {
    var shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (success) {
      return shader;
    }
    console.log(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
  }
  function createProgram(gl, vertexShader, fragmentShader) {
    var program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    var success = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (success) {
      return program;
    }
    console.log(gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
  }
  function resizeCanvasToDisplaySize(canvas, isRetina = true) {
    const displayWidth = canvas.clientWidth;
    const displayHeight = canvas.clientHeight;
    const desiredWidth = isRetina ? displayWidth * 2 : displayWidth;
    const desiredHeight = isRetina ? displayHeight * 2 : displayHeight;
    const needResize = canvas.width !== desiredWidth || canvas.height !== desiredHeight;
    if (needResize) {
      canvas.width = desiredWidth;
      canvas.height = desiredHeight;
    }
    return needResize;
  }
  function translationMatrix(x, y) {
    return [
      1,
      0,
      0,
      0,
      1,
      0,
      x,
      y,
      1
    ];
  }
  function rotationMatrix(angle) {
    const c = Math.cos(angle);
    const s = Math.sin(angle);
    return [
      c,
      -s,
      0,
      s,
      c,
      0,
      0,
      0,
      1
    ];
  }
  function scaleMatrix(sx, sy) {
    return [
      sx,
      0,
      0,
      0,
      sy,
      0,
      0,
      0,
      1
    ];
  }
  function multiplyMatrix(a, b) {
    var a00 = a[0 * 3 + 0];
    var a01 = a[0 * 3 + 1];
    var a02 = a[0 * 3 + 2];
    var a10 = a[1 * 3 + 0];
    var a11 = a[1 * 3 + 1];
    var a12 = a[1 * 3 + 2];
    var a20 = a[2 * 3 + 0];
    var a21 = a[2 * 3 + 1];
    var a22 = a[2 * 3 + 2];
    var b00 = b[0 * 3 + 0];
    var b01 = b[0 * 3 + 1];
    var b02 = b[0 * 3 + 2];
    var b10 = b[1 * 3 + 0];
    var b11 = b[1 * 3 + 1];
    var b12 = b[1 * 3 + 2];
    var b20 = b[2 * 3 + 0];
    var b21 = b[2 * 3 + 1];
    var b22 = b[2 * 3 + 2];
    return [
      b00 * a00 + b01 * a10 + b02 * a20,
      b00 * a01 + b01 * a11 + b02 * a21,
      b00 * a02 + b01 * a12 + b02 * a22,
      b10 * a00 + b11 * a10 + b12 * a20,
      b10 * a01 + b11 * a11 + b12 * a21,
      b10 * a02 + b11 * a12 + b12 * a22,
      b20 * a00 + b21 * a10 + b22 * a20,
      b20 * a01 + b21 * a11 + b22 * a21,
      b20 * a02 + b21 * a12 + b22 * a22
    ];
  }
  function lerp(a, b, t) {
    return a * (1 - t) + b * t;
  }
  function modelMatrix(params) {
    const { x, y, rotation, scaleX, scaleY, originX, originY } = params;
    const translateM = translationMatrix(x, y);
    const rotationM = rotationMatrix(rotation);
    const scaleM = scaleMatrix(scaleX, scaleY);
    const moveOriginMatrix = translationMatrix(-originX, -originY);
    const transformM = multiplyMatrix(
      translateM,
      multiplyMatrix(
        rotationM,
        multiplyMatrix(moveOriginMatrix, scaleM)
      )
    );
    return transformM;
  }

  // src/gfx/sprite.js
  var vertexShaderSource = `#version 300 es

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
`;
  var fragmentShaderSource = `#version 300 es
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
`;
  var SpriteRenderer = class {
    gl = null;
    program = null;
    posA = null;
    texcoordA = null;
    resolutionU = null;
    brightnessU = null;
    transformU = null;
    spriteIdxU = null;
    spriteCountU = null;
    vao = null;
    sprites = {};
    constructor(gl) {
      this.gl = gl;
      const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
      const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
      this.program = createProgram(gl, vertexShader, fragmentShader);
      this.posA = gl.getAttribLocation(this.program, "a_position");
      this.texcoordA = gl.getAttribLocation(this.program, "a_texcoord");
      this.resolutionU = gl.getUniformLocation(this.program, "u_resolution");
      this.brightnessU = gl.getUniformLocation(this.program, "u_brightness");
      this.transformU = gl.getUniformLocation(this.program, "u_transform");
      this.spriteIdxU = gl.getUniformLocation(this.program, "u_sprite_idx");
      this.spriteCountU = gl.getUniformLocation(this.program, "u_sprite_count");
      this.vao = gl.createVertexArray();
      {
        gl.bindVertexArray(this.vao);
        const positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
          0,
          0,
          1,
          0,
          0,
          1,
          1,
          0,
          1,
          1,
          0,
          1
        ]), gl.STATIC_DRAW);
        gl.enableVertexAttribArray(this.posA);
        const size = 2;
        const type = gl.FLOAT;
        const normalize = false;
        const stride = 0;
        const offset = 0;
        gl.vertexAttribPointer(
          this.posA,
          size,
          type,
          normalize,
          stride,
          offset
        );
      }
      {
        const texBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, texBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
          0,
          0,
          0.5,
          0,
          0,
          1,
          0.5,
          0,
          0.5,
          1,
          0,
          1
        ]), gl.STATIC_DRAW);
        gl.enableVertexAttribArray(this.texcoordA);
        const size = 2;
        const type = gl.FLOAT;
        const normalize = false;
        const stride = 0;
        const offset = 0;
        gl.vertexAttribPointer(
          this.texcoordA,
          size,
          type,
          normalize,
          stride,
          offset
        );
      }
    }
    loadSprite(url, dimensions, origin, frameCount) {
      const gl = this.gl;
      const newTexture = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, newTexture);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.RGBA,
        1,
        1,
        0,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        new Uint8Array([0, 0, 255, 255])
      );
      const image = new Image();
      image.src = url;
      image.addEventListener("load", () => {
        gl.bindTexture(gl.TEXTURE_2D, newTexture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
        gl.generateMipmap(gl.TEXTURE_2D);
      });
      this.sprites[url] = {
        texture: newTexture,
        url,
        origin,
        dimensions,
        frameCount
      };
    }
    // Since scaling and origin are taken care of by SpriteRenderer,
    // just provide a convenience function which takes x, y, and rotation,
    // and returns a model matrix.
    //
    // This is a code smell, would be better to
    // take care of the model matrix outside of SpriteRenderer.
    getModelMatrix(x, y, rotation, spriteName) {
      return modelMatrix({
        x,
        y,
        rotation,
        scaleX: this.sprites[spriteName].dimensions[0],
        scaleY: this.sprites[spriteName].dimensions[1],
        originX: this.sprites[spriteName].origin[0],
        originY: this.sprites[spriteName].origin[1]
      });
    }
    render(canvas, sprite, params) {
      const { texture, frameCount } = this.sprites[sprite];
      const { brightness, frame, modelMatrix: modelMatrix2 } = params;
      const gl = this.gl;
      gl.useProgram(this.program);
      gl.bindVertexArray(this.vao);
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.uniform2f(this.resolutionU, canvas.width, canvas.height);
      gl.uniform1i(this.spriteIdxU, frame);
      gl.uniform1i(this.spriteCountU, frameCount);
      gl.uniform1f(this.brightnessU, brightness);
      gl.uniformMatrix3fv(
        this.transformU,
        false,
        modelMatrix2
      );
      gl.drawArrays(gl.TRIANGLES, 0, 6);
    }
  };

  // src/gfx/starfield.js
  var geometry = [
    -1,
    -1,
    1,
    -1,
    -1,
    1,
    1,
    -1,
    1,
    1,
    -1,
    1
  ];
  var vertexShaderSource2 = `#version 300 es

in vec2 a_position;

out vec2 v_texcoord;

void main() {
    gl_Position = vec4(a_position, 0.9, 1.);
}
`;
  var fragmentShaderSource2 = `#version 300 es
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
}`;
  var StarfieldRenderer = class {
    gl = null;
    program = null;
    posA = null;
    resolutionU = null;
    timeU = null;
    vao = null;
    constructor(gl) {
      this.gl = gl;
      const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource2);
      const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource2);
      this.program = createProgram(gl, vertexShader, fragmentShader);
      this.posA = gl.getAttribLocation(this.program, "a_position");
      this.resolutionU = gl.getUniformLocation(this.program, "u_resolution");
      this.timeU = gl.getUniformLocation(this.program, "u_time");
      this.vao = gl.createVertexArray();
      gl.bindVertexArray(this.vao);
      const positionBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(geometry), gl.STATIC_DRAW);
      gl.enableVertexAttribArray(this.posA);
      const size = 2;
      const type = gl.FLOAT;
      const normalize = false;
      const stride = 0;
      const offset = 0;
      gl.vertexAttribPointer(
        this.posA,
        size,
        type,
        normalize,
        stride,
        offset
      );
    }
    render(time, canvas) {
      const gl = this.gl;
      gl.useProgram(this.program);
      gl.bindVertexArray(this.vao);
      gl.uniform2f(this.resolutionU, canvas.width, canvas.height);
      gl.uniform1f(this.timeU, time / 2e3);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
    }
  };

  // src/parser.js
  var ParseContext = class {
    tokens = [];
    raw = "";
    idx = 0;
    constructor(inp) {
      this.raw = inp;
    }
    isAtEnd() {
      return this.idx >= this.raw.length;
    }
  };
  var isAlpha = (c) => {
    return c >= "a" && c <= "z" || c >= "A" && c <= "Z" || c >= "0" && c <= "9";
  };
  var isDigit = (c) => {
    return c >= "0" && c <= "9";
  };
  var isWhitespace = (c) => {
    return c === "\n" || c === " " || c === "	";
  };
  var parseUntil = (parser) => (ctx) => {
    const startIndex = ctx.idx;
    while (!parser(ctx)) {
      if (ctx.isAtEnd()) {
        ctx.idx = startIndex;
        return null;
      }
      ctx.idx++;
    }
    const endIndex = ctx.idx;
    ctx.idx = startIndex;
    return {
      start: startIndex,
      end: endIndex
    };
  };
  var parseEnd = () => (ctx) => {
    if (ctx.isAtEnd()) {
      return {
        start: ctx.idx,
        end: ctx.idx
      };
    }
    return null;
  };
  var parseWhileChar = (charCond) => (ctx) => {
    const startIndex = ctx.idx;
    let endIndex = startIndex;
    while (charCond(ctx.raw[endIndex]) && ctx.raw[endIndex] !== void 0) {
      endIndex++;
    }
    if (endIndex > startIndex) {
      return {
        start: startIndex,
        end: endIndex
      };
    }
  };
  var maybe = (parser) => (ctx) => {
    const result = parser(ctx);
    return result || {
      start: ctx.idx,
      end: ctx.idx
    };
  };
  var parseAlphanumeric = parseWhileChar(isAlpha);
  var parseDigits = parseWhileChar(isDigit);
  var parseCharacterCond = (cond) => (ctx) => {
    if (cond(ctx.raw[ctx.idx])) {
      return {
        start: ctx.idx,
        end: ctx.idx + 1
      };
    }
  };
  var whitespace = parseCharacterCond(isWhitespace);
  var parseCharacter = (ch) => parseCharacterCond((c) => c === ch);
  var nonAlpha = parseCharacterCond((c) => !isAlpha(c));
  var parseString = (str) => {
    const parsers = [];
    for (let i = 0; i < str.length; i++) {
      parsers.push(parseCharacter(str[i]));
    }
    return sequence(...parsers);
  };
  var sequence = (...parsers) => (ctx) => {
    const startIdx = ctx.idx;
    let totalLength = 0;
    for (let i = 0; i < parsers.length; i++) {
      const parseResult2 = parsers[i](ctx);
      if (!parseResult2) {
        ctx.idx = startIdx;
        return null;
      }
      ctx.idx += parseResult2.end - parseResult2.start;
      totalLength += parseResult2.end - parseResult2.start;
    }
    ctx.idx = startIdx;
    return {
      start: ctx.idx,
      end: ctx.idx + totalLength
    };
  };
  var drop = (parser) => (ctx) => {
    const currIdx = ctx.idx;
    const result = parser(ctx);
    if (!result) {
      return;
    }
    ctx.idx += result.end - result.start;
    return {
      start: currIdx,
      end: currIdx
    };
  };
  var consume = (parser, type) => (ctx) => {
    const result = parser(ctx);
    if (!result) {
      return;
    }
    result.type = type;
    result.parser = parser;
    ctx.tokens.push(result);
    ctx.idx = result.end;
    return result;
  };
  var untilEnd = (parser) => (ctx) => {
    while (ctx.raw[ctx.idx] !== void 0) {
      parser(ctx);
    }
  };
  var or = (...parsers) => (ctx) => {
    for (let i = 0; i < parsers.length; i++) {
      const result = parsers[i](ctx);
      if (result) {
        return result;
      }
    }
  };
  var peek = (parser) => (ctx) => {
    const result = parser(ctx);
    if (!result) {
      return;
    }
    return {
      ...result,
      end: result.start
    };
  };
  var peekBack = (parser, amount = 1) => (ctx) => {
    const origIdx = ctx.idx;
    ctx.idx = ctx.idx - amount;
    const result = parser(ctx);
    if (!result) {
      ctx.idx = origIdx;
      return;
    }
    ctx.idx = origIdx;
    return {
      start: origIdx,
      end: origIdx
    };
  };
  var one = () => (ctx) => {
    return {
      start: ctx.idx,
      end: ctx.idx + 1
    };
  };
  var funcCallName = sequence(
    parseAlphanumeric,
    peek(parseCharacter("("))
  );
  var comment = or(
    sequence(
      parseString("//"),
      maybe(parseWhileChar((c) => c !== "\n"))
    ),
    sequence(
      parseString("/*"),
      parseUntil(
        or(
          parseString("*/"),
          parseEnd()
        )
      ),
      maybe(parseString("*/"))
    )
  );
  var string = or(
    sequence(
      parseCharacter('"'),
      maybe(parseWhileChar((c) => c !== '"')),
      parseCharacter('"')
    ),
    sequence(
      parseCharacter("'"),
      maybe(parseWhileChar((c) => c !== "'")),
      parseCharacter("'")
    )
  );
  var number = sequence(
    parseDigits,
    maybe(parseCharacter(".")),
    maybe(parseDigits)
  );
  var startOfInput = (ctx) => {
    if (ctx.idx === 0) {
      return {
        start: 0,
        end: 0
      };
    }
    return null;
  };
  var endOfInput = (ctx) => {
    if (ctx.idx === ctx.raw.length) {
      return {
        start: ctx.idx,
        end: ctx.idx
      };
    }
    return null;
  };
  var keyword = (str) => sequence(
    or(
      startOfInput,
      peekBack(nonAlpha)
    ),
    parseString(str),
    peek(or(
      endOfInput,
      nonAlpha
    ))
  );
  var parseJSON = untilEnd(
    or(
      consume(string, "STRING"),
      consume(number, "NUMBER"),
      consume(keyword("null"), "KEYWORD"),
      consume(keyword("undefined"), "KEYWORD"),
      drop(one())
    )
  );

  // src/gui/editor.jsx
  var HighlightedJSONText = ({ value }) => {
    const computeSpans = () => {
      const tok = new ParseContext(value);
      parseResult = parseJSON(tok);
      if (tok.tokens.length === 0) {
        return [value];
      }
      return tok.tokens.reduce((resultEls, currToken, currIdx, orig) => {
        const prevToken = orig[currIdx - 1];
        const soFar = prevToken?.end || 0;
        if (currToken.start > soFar) {
          resultEls.push(value.slice(soFar, currToken.start));
        }
        const className = `parsed_${currToken.type}`;
        const spanContents = value.slice(currToken.start, currToken.end);
        resultEls.push(/* @__PURE__ */ hic("span", { class: className }, spanContents));
        if (currIdx === orig.length - 1) {
          resultEls.push(value.slice(currToken.end));
        }
        return resultEls;
      }, []);
    };
    return /* @__PURE__ */ hic("pre", { class: "editor_draw" }, /* @__PURE__ */ hic("code", null, computeSpans()));
  };

  // src/timeline.js
  var timeline = [
    {
      missiles: {
        1: {
          x: 100,
          y: 200,
          rotation: 5 * Math.PI / 4
        },
        2: {
          x: 400,
          y: -100,
          rotation: Math.PI
        }
      },
      ships: {
        0: {
          x: 100,
          y: 300,
          health: 100,
          rotation: 3 * Math.PI / 2
        }
      }
    },
    {
      missiles: {
        1: {
          x: 200,
          y: 300,
          rotation: 5 * Math.PI / 4
        },
        2: {
          x: 400,
          y: 0,
          rotation: Math.PI
        }
      },
      ships: {
        0: {
          x: 200,
          y: 300,
          health: 100,
          rotation: 3.5 * Math.PI / 2
        }
      }
    },
    {
      missiles: {
        2: {
          x: 400,
          y: 100,
          rotation: Math.PI
        }
      },
      ships: {
        0: {
          x: 300,
          y: 250,
          health: 50,
          rotation: 2 * Math.PI
        }
      }
    },
    {
      missiles: {
        2: {
          x: 400,
          y: 200,
          rotation: Math.PI
        }
      },
      ships: {
        0: {
          x: 400,
          y: 200,
          health: 50,
          rotation: 2 * Math.PI + Math.PI / 4
        }
      }
    },
    {
      missiles: {},
      ships: {
        0: {
          x: 500,
          y: 180,
          health: 20,
          rotation: 2 * Math.PI + 2 * Math.PI / 4,
          thrusters: true
        }
      }
    },
    {
      missiles: {},
      ships: {
        0: {
          x: 600,
          y: 150,
          health: 20,
          rotation: 2 * Math.PI + 3 * Math.PI / 4,
          thrusters: true
        }
      }
    },
    {
      missiles: {},
      ships: {
        0: {
          x: 600,
          y: 150,
          health: 20,
          rotation: 2 * Math.PI + 3 * Math.PI / 4,
          thrusters: true
        }
      }
    },
    {
      missiles: {},
      ships: {
        0: {
          x: 600,
          y: 150,
          health: 20,
          rotation: 2 * Math.PI + 3 * Math.PI / 4,
          thrusters: true
        }
      }
    }
  ];

  // src/index.jsx
  function runTimelineExample() {
    const canvas = document.getElementById("example-timeline-ships");
    const gl = canvas.getContext("webgl2");
    if (!gl) {
      console.error("Failed to init webgl.");
    }
    gl.disable(gl.DEPTH_TEST);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.enable(gl.BLEND);
    resizeCanvasToDisplaySize(canvas, true);
    const starfieldRenderer = new StarfieldRenderer(gl);
    const spriteRenderer = new SpriteRenderer(gl);
    spriteRenderer.loadSprite("resources/ship.png", [100, 100], [50, 50], 2);
    spriteRenderer.loadSprite("resources/missile.png", [30, 60], [15, 15], 2);
    spriteRenderer.loadSprite("resources/jet.png", [32, 40], [16, 0], 2);
    const gameState = {
      frameIdx: 0,
      // ship is the actual on screen ship, the target values
      // we want to animate to are stored at the current index
      // in the timeline.
      missiles: {
        1: {
          x: 200,
          y: 50,
          rotation: Math.PI
        },
        2: {
          x: 400,
          y: -100,
          rotation: Math.PI
        }
      },
      ships: {
        0: {
          x: 200,
          y: 200,
          brightness: 0,
          rotation: 0,
          health: 100,
          frame: 0
        }
      }
    };
    function renderGUI() {
      const left = (gameState.ships[0].x - 50) / 2;
      const top = (gameState.ships[0].y - 50) / 2;
      const width = 50 * (gameState.ships[0].health / 100);
      const styleString = `left: ${left}px; width: ${width}px; top: ${top}px;`;
      const el = /* @__PURE__ */ hic("div", { id: "example-timeline-ships-gui" }, /* @__PURE__ */ hic("div", { class: "health-bar-background", style: styleString }), /* @__PURE__ */ hic("div", { class: "health-bar", style: styleString }));
      apply(render(el), document.getElementById("example-timeline-ships-gui"));
    }
    function renderTimeline() {
      const rows = timeline.map((frame, idx) => {
        const style = `opacity: ${idx === gameState.frameIdx ? 1 : 0.5};`;
        return /* @__PURE__ */ hic("div", { class: "timeline-row", style }, /* @__PURE__ */ hic(HighlightedJSONText, { value: JSON.stringify(frame) }));
      });
      const el = /* @__PURE__ */ hic("div", { id: "timeline-controls" }, rows);
      apply(render(el), document.getElementById("timeline-controls"));
    }
    renderTimeline();
    function update(t) {
      const timelineFrame = timeline[gameState.frameIdx];
      const shipTarget = timelineFrame.ships[0];
      const tSecs = t * 1e-3;
      const ship = gameState.ships[0];
      ship.x = lerp(ship.x, shipTarget.x, 5 * tSecs);
      ship.y = lerp(ship.y, shipTarget.y, 5 * tSecs);
      ship.rotation = lerp(ship.rotation, shipTarget.rotation, 5 * tSecs);
      ship.health = lerp(ship.health, shipTarget.health, 20 * tSecs);
      if (ship.health / shipTarget.health > 1.01) {
        ship.brightness = 1;
      } else {
        ship.brightness = 0;
      }
      ship.thrusters = shipTarget.thrusters;
      Object.entries(timelineFrame.missiles).forEach(([idx, missileTarget]) => {
        if (!gameState.missiles[idx]) {
          gameState.missiles[idx] = {
            x: missileTarget.x,
            y: missileTarget.y,
            rotation: missileTarget.rotation
          };
        }
      });
      Object.entries(gameState.missiles).forEach(([idx, missile]) => {
        const missileTarget = timelineFrame.missiles[idx];
        if (missileTarget === void 0) {
          delete gameState.missiles[idx];
          return;
        }
        missile.x = lerp(missile.x, missileTarget.x, 5 * tSecs);
        missile.y = lerp(missile.y, missileTarget.y, 5 * tSecs);
        missile.rotation = lerp(missile.rotation, missileTarget.rotation, 5 * tSecs);
      });
    }
    function draw(t) {
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      starfieldRenderer.render(t, canvas);
      const ship = gameState.ships[0];
      if (ship.thrusters) {
        const firstJetModelMatrix = modelMatrix({
          x: ship.x,
          y: ship.y,
          rotation: ship.rotation,
          scaleX: 32,
          scaleY: 40,
          originX: 16 + 22,
          originY: -38
        });
        const secondJetModelMatrix = modelMatrix({
          x: ship.x,
          y: ship.y,
          rotation: ship.rotation,
          scaleX: 32,
          scaleY: 40,
          originX: 16 - 20,
          originY: -38
        });
        spriteRenderer.render(canvas, "resources/jet.png", {
          ...ship,
          brightness: 0,
          modelMatrix: firstJetModelMatrix
        });
        spriteRenderer.render(canvas, "resources/jet.png", {
          ...ship,
          brightness: 0,
          modelMatrix: secondJetModelMatrix
        });
      }
      const shipModelMatrix = spriteRenderer.getModelMatrix(
        ship.x,
        ship.y,
        ship.rotation,
        "resources/ship.png"
      );
      spriteRenderer.render(canvas, "resources/ship.png", {
        modelMatrix: shipModelMatrix,
        brightness: ship.brightness,
        frame: ship.frame
      });
      Object.values(gameState.missiles).forEach((missile) => {
        const missileModelMatrix = spriteRenderer.getModelMatrix(
          missile.x,
          missile.y,
          missile.rotation,
          "resources/missile.png"
        );
        spriteRenderer.render(canvas, "resources/missile.png", {
          ...missile,
          modelMatrix: missileModelMatrix,
          brightness: 0,
          frame: 0
        });
      });
      renderGUI();
    }
    let lastTickTime = 0;
    let lastWobbleTime = 0;
    let lastFrameTime = 0;
    window.requestAnimationFrame(function loop(t) {
      let timeDelta = t - lastFrameTime;
      if (timeDelta > 500) {
        timeDelta = 10;
      }
      if (t - lastTickTime > 200) {
        gameState.frameIdx = (gameState.frameIdx + 1) % timeline.length;
        lastTickTime = t;
        renderTimeline();
      }
      if (t - lastWobbleTime > 200) {
        gameState.ships[0].frame = (gameState.ships[0].frame + 1) % 2;
        lastWobbleTime = t;
      }
      update(timeDelta);
      draw(t);
      window.requestAnimationFrame(loop);
      lastFrameTime = t;
    });
  }
  window.onload = function() {
    runTimelineExample();
  };
})();
