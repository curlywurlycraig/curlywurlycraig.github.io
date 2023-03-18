class HicType extends Array {}

interface Tagged {
  _hic?: HicType
  _elPositionMap?: Record<string, number>,
  value?: any
}

const FUNC_TOKEN = "function";

type TaggedElement = Tagged & Element & Node

function isHic(a) {
  return a instanceof HicType;
}

/**
   Conform to the jsx factory signature to produce hiccup.
*/
export const hic = (name, options, ...children): HicType => {
  const flatChildren = children.reduce((acc, child) => {
    if (Array.isArray(child) && !isHic(child)) {
      acc.push(...child);
    } else {
      acc.push(child);
    }
    return acc;
  }, []);
  return new HicType(name, options || {}, flatChildren);
}

/**
   Given some hiccup, resolve any components to their resulting DOM only
   hiccup. That is, only hiccup elements with lower case tag names should remain.
   
   This entails running the components with their attributes.
*/
export const render = (hic: HicType, key = "__r"): HicType => {
  if (!isHic(hic)) {
    return hic;
  }

  const [tag, attrs, children] = hic;
  attrs.key = attrs.key || key;
  const renderedChildren = children
    .map((child: HicType, idx) => {
      return render(child, key + "c" + (child?.[1]?.key || idx));
    });

  if (typeof tag === FUNC_TOKEN) {
    const renderResult = tag({ ...attrs, children: renderedChildren });
    return render(renderResult, key + "e" + (renderResult?.key || ""));
  }

  return new HicType(tag, attrs, renderedChildren);
};

/**
 * Adds a dictionary representation of the HTMLElement
 * to the element
 * EX:
 * input | { click: (event) => alert('hello') }
 */
const updateAttrs = (el: TaggedElement, attrs: object) => {
  const [, prevAttrs] = el._hic || [];

  Object
    .entries(attrs)
    .forEach(([k, v]) => { 
      if (prevAttrs && typeof prevAttrs[k] === FUNC_TOKEN) {
        el.removeEventListener(k, prevAttrs[k]);
      }

      if (typeof v === FUNC_TOKEN) {
        el.addEventListener(k.toLowerCase(), v);
      } else {
        // Weird specific case. The view doesn't update if you do el.setAttribute('value', 10) on an input element.
        if (k === 'value' || k === 'disabled') {
          el[k] = v;
          return;
        }
        
        const asElement = el as TaggedElement;
        if (asElement.getAttribute(k) !== v) {
          asElement.setAttribute(k, v);
        }
      }
    })

  return el;
}

const updateChildren = (el: TaggedElement, newChildren: TaggedElement[]) => {
  for (let i = newChildren.length - 1; i >= 0; i--) {
    const currChild = newChildren[i];
    const desiredNextSibling = newChildren[i+1] || null;
    const existingNextSibling = currChild.nextSibling;
    if (desiredNextSibling !== existingNextSibling || !el.contains(currChild)) {
      el?.insertBefore(currChild, desiredNextSibling);
    }
  }

  while (el.childNodes.length > newChildren.length) {
    el?.removeChild(el.childNodes[0]);
  }

  return el;
}

/**
   Given some HTML element, update that element and its children with the hiccup.
   This preserves existing HTML elements without removing and creating new ones.
*/
export const apply = (hic: any, el: TaggedElement | undefined) => {
  let result: TaggedElement | undefined = el;

  if (!hic && hic !== "") {
    return null;
  }
  
  // Basically leaf text nodes. Early return because they cannot have children
  if (!isHic(hic)) {
    if (el?.nodeType !== 3) {
      return document.createTextNode(hic);
    }

    if (el.textContent !== hic) {
      el.textContent = hic;
    }

    return el;
  }

  const [prevTag, prevAttrs] = el?._hic || [];
  const [tag, attrs] = hic;

  // New element case
  if (prevTag !== tag || !result) {
    const currentNS = attrs.xmlns || (tag === 'svg' ? 'http://www.w3.org/2000/svg' : 'http://www.w3.org/1999/xhtml');
    result = document.createElementNS(currentNS, tag) as TaggedElement;
  }

  // Update element with attrs
  updateAttrs(result, attrs);

  // Apply each child and assign as a child to this element
  result._hic = hic;
  const children = isHic(hic) ? hic[2] : [];
  const newChildren = children
    .filter(c => c)
    .map((child, idx) => {
      const existingNode = el?.childNodes[idx];
      return apply(child, existingNode as TaggedElement);
    });

  updateChildren(result, newChildren);

  if (el !== result) {
    el?.parentNode?.replaceChild(result, el!!);
  }

  if (typeof attrs.ref === FUNC_TOKEN && attrs.ref !== prevAttrs?.ref) {
    attrs.ref(result, attrs.key);
  }

  return result;
}