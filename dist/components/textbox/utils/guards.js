export function indexIsValid(index, min, max) {
    return !(index < min || index > max);
}
export function documentNodeHasChildren(node) {
    return 'children' in node;
}
export function documentNodeIsTextNode(node) {
    return node.type === 'text';
}
export function documentNodeIsFormatNode(node) {
    return node.type === 'format';
}
export function documentNodeIsParagraphNode(node) {
    return node.type === 'paragraph';
}
export function selectionIsWithinElement(selection, element) {
    return (selection.rangeCount > 0 && element.contains(selection.getRangeAt(0).commonAncestorContainer));
}
export function documentNodeIsFirstTextNodeOfParagraph(vector) {
    const paragraphPath = vector.path.slice(1);
    for (let i = 0; i < paragraphPath.length; i++) {
        if (paragraphPath[i] !== 0) {
            return false;
        }
    }
    return true;
}
export function documentNodeIsLastTextNodeOfParagraph(vector, paragraph) {
    const paragraphPath = vector.path.slice(1);
    let node = paragraph;
    const childrensLengths = [];
    // Create an array of lengths - 1 of children array in each child:
    while (documentNodeHasChildren(node)) {
        childrensLengths.push(node.children.length - 1);
        node = node.children[node.children.length - 1];
    }
    // Checks equality of this children length array with paragraph path
    if (paragraphPath.length !== childrensLengths.length) {
        return false;
    }
    for (let i = 0; i < paragraphPath.length; i++) {
        if (paragraphPath[i] !== childrensLengths[i]) {
            return false;
        }
    }
    return true;
}
export function arrayOfTextObjects(nodes) {
    if (nodes.length == 0) {
        return false;
    }
    for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        if (!documentNodeIsTextNode(node)) {
            return false;
        }
    }
    return true;
}
export function arrayOfChildObjects(nodes) {
    if (nodes.length == 0) {
        return false;
    }
    for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        if (documentNodeIsParagraphNode(node)) {
            return false;
        }
    }
    return true;
}
