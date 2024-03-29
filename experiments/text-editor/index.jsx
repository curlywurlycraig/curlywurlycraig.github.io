import { hic, apply, render } from "./vdom.js";
import { withState, compose } from "./hoc.js";
import { ParseContext, parseJS } from "./parse/parser.js";
import initialEditorState from "./initial_editor_state.txt"

const Editor = compose(
  withState({
    width: 0,
    textareaRef: { value: null },
    preRef: { value: null }
  }),

  ({ value, onChange, textareaRef, preRef, ref }) => {
    const computeSpans = () => {
      const tok = new ParseContext(value);
      parseResult = parseJS(tok);
      
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
        resultEls.push(<span class={className}>{ spanContents }</span>);

        if (currIdx === orig.length - 1) {
          resultEls.push(value.slice(currToken.end));
        }
        return resultEls;
      }, []);
    }

    const resizeTextarea = () => {
      const textareaEl = textareaRef.value;
      if (textareaEl) {
        textareaEl.style.height = preRef.value.scrollHeight + 20;
      }
    }

    const onInputChange = (v) => {
      onChange(v);
      resizeTextarea();
    }

    const onTextareaRef = ref => {
      textareaRef.value = ref;
    }

    const onPreRef = ref => {
      preRef.value = ref;
    }

    return (
      <div ref={ref} class="editor_container">
        <textarea ref={onTextareaRef} class="editor_textarea" value={value} input={e => onInputChange(e.target.value)} />
        <pre ref={onPreRef} class="editor_draw">
          <code>
            { computeSpans() }
          </code>
        </pre>
      </div>
    );
  }
)

const Main = compose(
  withState({
    editorContent: initialEditorState
  }),

  ({ editorContent, setEditorContent, ref }) => {
    return (
      <div ref={ref}>
        <Editor onChange={setEditorContent} value={editorContent} />
      </div>
    );
  }
)

const mainEl = document.getElementById("demo");
apply(render(<Main />), mainEl);
