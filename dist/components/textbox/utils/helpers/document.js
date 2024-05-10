import { documentNodeIsFormatNode, documentNodeIsTextNode } from "../guards.js";
export function generateTextObject(content = '') {
    return {
        type: 'text',
        content: content
    };
}
export function generateFormatObject(format, content = '') {
    return {
        type: 'format',
        format: format,
        children: [generateTextObject(content)]
    };
}
export function generateFormatFlagsObject() {
    return {
        strong: false,
        em: false,
        u: false,
        title: false,
    };
}
export function getIndexOfChildInParentChildrenArray(parent, child) {
    for (let i = 0; i < parent.children.length; i++) {
        if (parent.children[i] === child) {
            return i;
        }
        ;
    }
    throw new Error('Child was not found in parent child array.');
}
// Checks document vector deep equality
export function documentVectorsAreDeeplyEqual(firstVector, secondVector) {
    if (firstVector.index !== secondVector.index) {
        return false;
    }
    ;
    if (firstVector.path.length !== secondVector.path.length) {
        return false;
    }
    ;
    for (let i = 0; i < firstVector.path.length; i++) {
        if (firstVector.path[i] !== secondVector.path[i]) {
            return false;
        }
        ;
    }
    return true;
}
export function arraysAreDeeplyEqual(firstArray, secondArray) {
    if (firstArray.length !== secondArray.length) {
        return false;
    }
    ;
    for (let i = 0; i < firstArray.length; i++) {
        if (firstArray[i] !== secondArray[i]) {
            return false;
        }
        ;
    }
    return true;
}
export function generateNestedTextObject(formats, content = '') {
    const path = [];
    let node = generateTextObject(content);
    formats.forEach(format => {
        path.push(0);
        node = generateFormatObjectWithChild(node, format);
    });
    return { node: node, textNodePath: path };
}
function generateFormatObjectWithChild(child, format) {
    return {
        type: 'format',
        format: format,
        children: [child]
    };
}
export function getSubNodeInNode(node, path) {
    let currentNode = node;
    for (let i = 0; i < path.length; i++) {
        if (documentNodeIsTextNode(currentNode)) {
            if (i !== path.length - 1) {
                throw new Error('TextObject encountered before the end of path');
            }
            console.log('breaking');
            break;
        }
        if (currentNode.children.length - 1 < path[i]) {
            throw new Error('Invalid child index');
        }
        currentNode = currentNode.children[path[i]];
    }
    if (currentNode == undefined) {
        throw new Error('Resulting node was undefined...');
    }
    return currentNode;
}
export function getFomrtasArrayOfNodeInSubNode(rootNode, pathToSubNode) {
    const formats = [];
    for (let i = 0; i < pathToSubNode.length; i++) {
        const node = getSubNodeInNode(rootNode, pathToSubNode.slice(0, -i));
        if (documentNodeIsFormatNode(node)) {
            formats.push(node.format);
        }
    }
    return formats;
}
