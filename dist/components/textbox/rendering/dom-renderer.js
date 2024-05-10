import { documentNodeIsParagraphNode, documentNodeIsTextNode } from "../utils/guards.js";
import { resolvePathToNode } from "../utils/helpers/render.js";
class DomRenderer {
    document;
    documentOperator;
    rootElement;
    constructor(document, documentOperator, rootElement) {
        this.document = document;
        this.documentOperator = documentOperator;
        this.rootElement = rootElement;
    }
    // Writes the html from data to the rootElement
    render() {
        // Reset rootElement html:
        this.rootElement.innerHTML = '';
        this.document.paragraphs.forEach(paragraph => {
            const paragraphElement = this.generateParagraphElement(paragraph);
            this.rootElement.appendChild(paragraphElement);
        });
    }
    partialRender(startVector, endVector) {
        // Find array of common ancestor-node-indexes:
        const commonPath = this.commonVectorPath(startVector.path, endVector.path);
        // Resolve node from path:
        const lastCommonNode = resolvePathToNode(this.rootElement, commonPath);
        this.regenerateNode(lastCommonNode, commonPath);
    }
    textNodeRender(vector) {
        const textNodeObject = this.documentOperator.getTextNode(vector);
        const nodeElement = resolvePathToNode(this.rootElement, vector.path);
        // Update innerText of nodeElement
        if (!(nodeElement instanceof Text)) {
            throw new Error(`Element resolved from vector path ${vector.path} is not an instance of Text`);
        }
        nodeElement.nodeValue = textNodeObject.content;
    }
    // Generates paragraph element
    generateParagraphElement(paragraph) {
        // The html paragraph element
        const paragraphElement = document.createElement('div');
        paragraphElement.classList.add('textbox-paragraph-element');
        paragraph.children.forEach(child => {
            let childElement;
            if (child.type === 'text') {
                childElement = this.generateTextElement(child);
            }
            else {
                childElement = this.generateFormatElement(child);
            }
            paragraphElement.appendChild(childElement);
        });
        return paragraphElement;
    }
    // Generates format element recursively
    generateFormatElement(format) {
        let formatElement;
        switch (format.format) {
            case 'strong':
                formatElement = document.createElement('strong');
                break;
            case 'em':
                formatElement = document.createElement('em');
                break;
            case 'u':
                formatElement = document.createElement('u');
                break;
            case 'title':
                formatElement = document.createElement('span');
                formatElement.classList.add('textbox-title-element');
                break;
            default:
                throw new Error(`Unknown format: ${format.format}.`);
        }
        format.children.forEach(child => {
            let childElement;
            if (child.type === 'text') {
                childElement = this.generateTextElement(child);
            }
            else {
                childElement = this.generateFormatElement(child);
            }
            formatElement.appendChild(childElement);
        });
        return formatElement;
    }
    generateTextElement(text) {
        return document.createTextNode(text.content);
    }
    commonVectorPath(path1, path2) {
        const minLength = Math.min(path1.length, path2.length);
        const commonPath = [];
        for (let i = 0; i < minLength; i++) {
            if (path1[i] === path2[i]) {
                commonPath.push(path1[i]);
            }
            else {
                break;
            }
        }
        return commonPath;
    }
    renderFromPath(path) {
        // If the path is an empty array, rerender entire textbox:
        if (!path.length) {
            this.render();
            return;
        }
        // Assemble new node:
        const documentNode = this.documentOperator.getNodeByPath(path);
        let domNode;
        if (documentNodeIsParagraphNode(documentNode)) {
            domNode = this.generateParagraphElement(documentNode);
        }
        else if (documentNodeIsTextNode(documentNode)) {
            domNode = this.generateTextElement(documentNode);
        }
        else {
            domNode = this.generateFormatElement(documentNode);
        }
        this.replaceNode(path, domNode);
    }
    replaceNode(path, newNode) {
        if (path.length === 0) {
            throw new Error("Path cannot be empty.");
        }
        // Determine the parent node of the target node
        const parentPath = path.slice(0, -1);
        const parentNode = resolvePathToNode(this.rootElement, parentPath);
        if (!(parentNode instanceof HTMLElement)) {
            throw new TypeError("The parent node resolved is not an HTMLElement.");
        }
        const targetIndex = path[path.length - 1];
        if (parentNode.childNodes[targetIndex] === undefined) {
            throw new Error(`No child exists at the target index ${targetIndex}.`);
        }
        // Replace the old node with the new node
        parentNode.replaceChild(newNode, parentNode.childNodes[targetIndex]);
    }
    // Function needs a rewrite - poor quality...
    regenerateNode(lastCommonNode, nodePath) {
        if (!nodePath.length) {
            this.render();
            return;
        }
        const paragraphIndex = nodePath[0];
        let endNode = this.document.paragraphs[paragraphIndex];
        for (let i = 1; i < nodePath.length; i++) {
            endNode = endNode.children[nodePath[i]];
            if (endNode.type !== 'format') {
                return;
            }
        }
        let htmlElement;
        switch (endNode.type) {
            case 'paragraph':
                htmlElement = this.generateParagraphElement(endNode);
                break;
            case 'format':
                htmlElement = this.generateFormatElement(endNode);
                break;
            default:
                htmlElement = this.generateTextElement(endNode);
        }
        // TODO :: Change the lastCommonNode - element to htmlElement
        if (lastCommonNode.parentNode) {
            lastCommonNode.parentNode.replaceChild(htmlElement, lastCommonNode);
        }
        else {
            throw new Error(`Node must have a parent node to be replaceable`);
        }
    }
}
export default DomRenderer;
