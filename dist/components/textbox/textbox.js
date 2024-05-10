import Document from "./models/document-model.js";
import DocumentOperator from "./operators/document-operator.js";
import TextboxState from "./core/textbox-state.js";
import TextboxInputHandler from "./handlers/textbox-input-handler.js";
import TextboxOperator from "./operators/textbox-operator.js";
import Carret from "./rendering/carret-renderer.js";
import DomRenderer from "./rendering/dom-renderer.js";
class Textbox {
    textbox;
    document;
    carret;
    state;
    inputHandler;
    documentOperator;
    operator;
    renderer;
    canvas;
    constructor(textbox, canvas, onFormatChange) {
        this.canvas = canvas;
        this.document = new Document();
        this.state = new TextboxState(onFormatChange);
        this.carret = new Carret(this.state, this.canvas);
        this.textbox = textbox;
        this.documentOperator = new DocumentOperator(this.document, this.state);
        this.renderer = new DomRenderer(this.document, this.documentOperator, this.textbox);
        this.operator = new TextboxOperator(this.state, this.renderer, this.carret, this.documentOperator, this.textbox);
        this.inputHandler = new TextboxInputHandler(this.textbox, this.operator);
        this.init();
    }
    init() {
        this.renderer.render();
    }
    updateCarret() {
        this.operator.updateCarret();
    }
    format(format) {
        this.operator.format(format);
    }
    getData() {
        return this.document.paragraphs;
    }
    setData(data) {
        this.operator.setData(data);
    }
    getCursorVector() {
        return this.state.cursor;
    }
    set fontSize(value) {
        this.state.normalFontSize = value.normal;
        this.state.titleFontSize = value.title;
        this.operator.updateCarret();
    }
    get fontSize() {
        return { normal: this.state.normalFontSize, title: this.state.titleFontSize };
    }
}
export default Textbox;
