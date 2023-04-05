import { hic } from "../vdom.js";
import { ParseContext, parseJSON } from "../parser.js";

export const HighlightedJSONText = ({ value }) => {
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
            resultEls.push(<span class={className}>{ spanContents }</span>);
    
            if (currIdx === orig.length - 1) {
                resultEls.push(value.slice(currToken.end));
            }
            return resultEls;
        }, []);
    }
    
    return (
        <pre class="editor_draw">
            <code>
                { computeSpans() }
            </code>
        </pre>
    );
}

export const TimelineControls = ({ currentIndex, timeline, isExpanded, onExpandClick }) => {
    if (!isExpanded) {
        return (
            <div id="timeline-controls">
                <p>Click <button class="inline" click={onExpandClick}>here</button> to show the JSON timeline.</p>
            </div>
        );
    }

    const rows = timeline.map((frame, idx) => {
        const style = `opacity: ${idx === currentIndex ? 1 : 0.5};`;
        return (
            <div class="timeline-row" style={style}>
                <HighlightedJSONText value={JSON.stringify(frame)} />
            </div>
        );
    });

    return (
        <div id="timeline-controls">
            <p>Click <button class="inline" click={onExpandClick}>here</button> to hide the JSON timeline.</p>
            <div id="timeline-rows-container">
                { rows }
            </div>
        </div>
    );
}