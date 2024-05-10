import { selectionIsWithinElement } from "../utils/guards.js";
import { resolveNodeToPath, resolvePathToNode } from "../utils/helpers/render.js";
class TextboxOperator {
    state;
    domRenderer;
    carret;
    documentOperator;
    textboxElement;
    constructor(state, domRenderer, carret, documentOperator, textboxElement) {
        this.state = state;
        this.domRenderer = domRenderer;
        this.carret = carret;
        this.documentOperator = documentOperator;
        this.textboxElement = textboxElement;
    }
    updateCarret() {
        if (!this.state.selectionRange) {
            this.state.selectionFormats = this.documentOperator.getFormats(this.state.cursor);
            this.carret.render(this.textboxElement, this.state.cursor);
        }
        else {
            this.carret.hide();
        }
    }
    updateSelectionState(selection) {
        if (!selectionIsWithinElement(selection, this.textboxElement)) {
            return;
        }
        switch (selection.type) {
            case 'Caret':
                this.updateSelectionStateCaret(selection);
                break;
            case 'Range':
                this.updateSelectionStateRange(selection);
                break;
        }
    }
    setDomSelection(range) {
        const firstNode = resolvePathToNode(this.textboxElement, range.start.path);
        const lastNode = resolvePathToNode(this.textboxElement, range.end.path);
        const domRange = new Range();
        domRange.setStart(firstNode, range.start.index);
        domRange.setEnd(lastNode, range.end.index);
        window.getSelection()?.removeAllRanges();
        window.getSelection()?.addRange(domRange);
    }
    updateSelectionStateCaret(selection) {
        const anchorNode = selection.anchorNode;
        if (!anchorNode) {
            return;
        }
        if (anchorNode instanceof Text) {
            const resultingVector = {
                path: resolveNodeToPath(this.textboxElement, anchorNode),
                index: selection.anchorOffset
            };
            this.state.cursor = resultingVector;
        }
        else {
            const path = resolveNodeToPath(this.textboxElement, anchorNode);
            const resultingVector = this.documentOperator.getTrailingNodeVector(path);
            this.state.cursor = resultingVector;
        }
        this.state.selectionRange = null;
    }
    updateSelectionStateRange(selection) {
        const range = selection.getRangeAt(0);
        let startVector;
        let endVector;
        if (range.startContainer instanceof Text) {
            startVector = {
                path: resolveNodeToPath(this.textboxElement, range.startContainer),
                index: range.startOffset
            };
        }
        else {
            const path = resolveNodeToPath(this.textboxElement, range.startContainer);
            startVector = this.documentOperator.getTrailingNodeVector(path);
        }
        if (range.endContainer instanceof Text) {
            endVector = {
                path: resolveNodeToPath(this.textboxElement, range.endContainer),
                index: range.endOffset
            };
        }
        else {
            const path = resolveNodeToPath(this.textboxElement, range.startContainer);
            endVector = this.documentOperator.getTrailingNodeVector(path);
        }
        this.state.selectionRange = {
            start: startVector,
            end: endVector
        };
        const formatFlags = this.documentOperator.getFormatsSelection(this.state.selectionRange);
        this.state.selectionFormats = formatFlags;
    }
    // Collapses DOM - Range if any is present
    removeSelection() {
        const selection = window.getSelection();
        const range = selection?.getRangeAt(0);
        if (range) {
            range.collapse();
        }
    }
    hideCarret() {
        this.carret.hide();
    }
    moveCarretLeft() {
        this.state.selectionRange = null;
        this.removeSelection();
        this.state.cursor = this.documentOperator.getPreviousVector(this.state.cursor);
        this.updateCarret();
    }
    moveCarretRight() {
        this.state.selectionRange = null;
        this.removeSelection();
        this.state.cursor = this.documentOperator.getNextVector(this.state.cursor);
        this.updateCarret();
    }
    // Inserts a string, also single characters, function is called on regular kydown events
    insertText(text) {
        if (this.state.selectionRange) {
            this.backspace();
        }
        this.state.cursor = this.documentOperator.insertText(text, this.state.cursor);
        this.domRenderer.textNodeRender(this.state.cursor);
        this.updateCarret();
    }
    // Inserts paragraph
    insertParagraph() {
        if (this.state.selectionRange) {
            const { newVector, latestChangedPath } = this.documentOperator.removeSelection(this.state.selectionRange);
            this.state.cursor = newVector;
            this.state.selectionRange = null;
        }
        this.state.cursor = this.documentOperator.insertParagraph(this.state.cursor);
        this.domRenderer.render();
        this.updateCarret();
    }
    // Deletes character or paragraph depending on state.cursor.index
    backspace() {
        if (this.state.selectionRange) {
            const { newVector, latestChangedPath } = this.documentOperator.removeSelection(this.state.selectionRange);
            this.state.cursor = newVector;
            this.state.selectionRange = null;
            this.domRenderer.renderFromPath(latestChangedPath);
            this.updateCarret();
            return;
        }
        else {
            const { newVector, latestChangedPath } = this.documentOperator.deleteSingle(this.state.cursor);
            this.state.cursor = newVector;
            this.domRenderer.renderFromPath(latestChangedPath);
            this.updateCarret();
            return;
        }
    }
    format(format) {
        if (this.state.selectionRange) {
            if (this.state.selectionFormats[format] == true) {
                // undoFormatSelection
                const { range, cursorPosition } = this.documentOperator.undoFormatSelection(this.state.selectionRange, format);
                this.state.selectionRange = range;
                this.state.cursor = cursorPosition;
                this.domRenderer.render();
                this.setDomSelection(this.state.selectionRange);
            }
            else {
                // insertFormatSelection
                const { range, cursorPosition } = this.documentOperator.insertFormatSelection(this.state.selectionRange, format);
                this.state.selectionRange = range;
                this.state.cursor = cursorPosition;
                this.domRenderer.render();
                this.setDomSelection(this.state.selectionRange);
            }
            return;
        }
        if (this.state.selectionFormats[format] == true) {
            this.state.cursor = this.documentOperator.undoFormat(this.state.cursor, format);
        }
        else {
            this.state.cursor = this.documentOperator.insertFormat(this.state.cursor, format);
        }
        this.domRenderer.render();
        this.updateCarret();
    }
    setData(data) {
        const { firstVector } = this.documentOperator.setData(data);
        this.state.cursor = firstVector;
        this.state.selectionRange = null;
        this.domRenderer.render();
        this.updateCarret();
    }
}
export default TextboxOperator;
