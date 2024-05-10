import { resolvePathToNode } from "../utils/helpers/render.js";
import { generateCarretElement } from "../utils/html-generators.js";
class Carret {
    carretElement;
    rootElement;
    state;
    canvas;
    constructor(state, canvas) {
        this.canvas = canvas;
        this.state = state;
        const bodyElement = document.querySelector('body');
        if (!bodyElement) {
            throw new Error('No body element found, cannot instantiate carret.');
        }
        this.carretElement = generateCarretElement();
        this.rootElement = bodyElement;
        this.rootElement.appendChild(this.carretElement);
        this.hide();
    }
    render(rootElement, vector) {
        const textNode = resolvePathToNode(rootElement, vector.path);
        const position = this.getCarretPosition(textNode, vector);
        this.carretElement.style.left = `${position.x}px`;
        this.carretElement.style.top = `${position.y}px`;
        if (this.state.selectionFormats.title) {
            this.carretElement.style.height = `${(this.canvas.pixelFontSize * 1.5) + 2}px`;
        }
        else {
            this.carretElement.style.height = `${this.canvas.pixelFontSize + 2}px`;
        }
        this.carretElement.style.display = 'block';
    }
    hide() {
        this.carretElement.style.display = 'none';
    }
    getCarretPosition(textNode, vector) {
        // If you click on an emptynparagraph...
        if (!textNode.textContent && textNode.parentElement) {
            const parentRect = textNode.parentElement?.getBoundingClientRect();
            return { x: parentRect.right, y: parentRect.top };
        }
        const range = document.createRange();
        range.setStart(textNode, vector.index);
        range.setEnd(textNode, vector.index);
        const rect = range.getBoundingClientRect();
        return { x: rect.left, y: rect.top };
    }
}
export default Carret;
