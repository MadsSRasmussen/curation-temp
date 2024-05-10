import GeometryController from "../geometry-controller/index.js";
import Textbox from "../textbox/textbox.js";
import TextboxHTML from "./textbox-html.js";
import Canvas from "../canvas/index.js";
class TextboxElement {
    geometrySettings = {
        minHeight: 0.05,
        minWidth: 0.05
    };
    canvas;
    textboxService;
    textboxHTML;
    geometryController;
    _focused = false;
    constructor(container) {
        this.canvas = new Canvas(container, 1.3);
        this.textboxHTML = new TextboxHTML(this.canvas.canvasElement);
        this.textboxService = new Textbox(this.textboxHTML.textarea, this.canvas, (formats) => { this.updateFormat(formats); });
        this.geometryController = new GeometryController(this.canvas.canvasElement, this.geometrySettings, (geometry) => { this.update(geometry); });
        this.geometryController.geometryData = {
            positionX: 0.1,
            positionY: 0.1,
            height: 0.1,
            width: 0.1,
        };
        this.update(this.geometryController.geometryData);
        this.initializeEventListeners();
    }
    init() {
        this.textboxHTML.initialize();
    }
    focus() {
        this.focused = true;
        this.textboxHTML.textarea.focus();
    }
    set focused(value) {
        this._focused = value;
        if (value === true) {
            // Show buttons and geometry
            this.showFocusHTML();
        }
        else {
            // Hide buttons and geometry
            this.hideFocusHTML();
        }
    }
    get focused() {
        return this._focused;
    }
    showFocusHTML() {
        // Show resizers
        this.textboxHTML.resizers.topLeft.classList.remove('hidden');
        this.textboxHTML.resizers.topRight.classList.remove('hidden');
        this.textboxHTML.resizers.bottomLeft.classList.remove('hidden');
        this.textboxHTML.resizers.bottomRight.classList.remove('hidden');
        // Show menubars
        this.textboxHTML.menu.formatSection.element.classList.remove('hidden');
        this.textboxHTML.menu.moveSection.element.classList.remove('hidden');
        // Show textbox border
        this.textboxHTML.textboxContainer.classList.add('focused');
    }
    hideFocusHTML() {
        // Hide resizers
        this.textboxHTML.resizers.topLeft.classList.add('hidden');
        this.textboxHTML.resizers.topRight.classList.add('hidden');
        this.textboxHTML.resizers.bottomLeft.classList.add('hidden');
        this.textboxHTML.resizers.bottomRight.classList.add('hidden');
        // Hide menubars
        this.textboxHTML.menu.formatSection.element.classList.add('hidden');
        this.textboxHTML.menu.moveSection.element.classList.add('hidden');
        // Hide textbox border
        this.textboxHTML.textboxContainer.classList.remove('focused');
    }
    updateFormat(formatFlags) {
        if (formatFlags.strong) {
            this.textboxHTML.menu.formatSection.buttons.strongButton.classList.add('textbox-menubar-button-activated');
        }
        else {
            this.textboxHTML.menu.formatSection.buttons.strongButton.classList.remove('textbox-menubar-button-activated');
        }
        if (formatFlags.em) {
            this.textboxHTML.menu.formatSection.buttons.emphasizeButton.classList.add('textbox-menubar-button-activated');
        }
        else {
            this.textboxHTML.menu.formatSection.buttons.emphasizeButton.classList.remove('textbox-menubar-button-activated');
        }
        if (formatFlags.u) {
            this.textboxHTML.menu.formatSection.buttons.underlineButton.classList.add('textbox-menubar-button-activated');
        }
        else {
            this.textboxHTML.menu.formatSection.buttons.underlineButton.classList.remove('textbox-menubar-button-activated');
        }
        if (formatFlags.title) {
            this.textboxHTML.menu.formatSection.buttons.titleButton.classList.add('textbox-menubar-button-activated');
        }
        else {
            this.textboxHTML.menu.formatSection.buttons.titleButton.classList.remove('textbox-menubar-button-activated');
        }
    }
    initializeEventListeners() {
        this.initializeEventListenersMenuButtons();
        this.initializeEventListenersResizers();
        this.initializeEventListenersContainer();
    }
    initializeEventListenersMenuButtons() {
        const formatButtons = this.textboxHTML.menu.formatSection.buttons;
        formatButtons.strongButton.addEventListener('click', (e) => {
            e.preventDefault();
            this.textboxService.format('strong');
            this.textboxHTML.textarea.focus();
        });
        formatButtons.emphasizeButton.addEventListener('click', (e) => {
            e.preventDefault();
            this.textboxService.format('em');
            this.textboxHTML.textarea.focus();
        });
        formatButtons.underlineButton.addEventListener('click', (e) => {
            e.preventDefault();
            this.textboxService.format('u');
            this.textboxHTML.textarea.focus();
        });
        formatButtons.titleButton.addEventListener('click', (e) => {
            e.preventDefault();
            this.textboxService.format('title');
            this.textboxHTML.textarea.focus();
        });
        const moveButtons = this.textboxHTML.menu.moveSection.buttons;
        moveButtons.moveButton.addEventListener('mousedown', (e) => {
            this.geometryController.move(e);
        });
    }
    initializeEventListenersResizers() {
        const resizers = this.textboxHTML.resizers;
        resizers.topLeft.addEventListener('mousedown', (e) => {
            this.geometryController.resizeTopLeft(e);
        });
        resizers.topRight.addEventListener('mousedown', (e) => {
            this.geometryController.resizeTopRight(e);
        });
        resizers.bottomLeft.addEventListener('mousedown', (e) => {
            this.geometryController.resizeBottomLeft(e);
        });
        resizers.bottomRight.addEventListener('mousedown', (e) => {
            this.geometryController.resizeBottomRight(e);
        });
    }
    initializeEventListenersContainer() {
        this.textboxHTML.textboxContainer.addEventListener('focusin', (e) => {
            console.log('focusin on container!');
            this.focused = true;
        });
        this.textboxHTML.textboxContainer.addEventListener('focusout', (e) => {
            console.log('focusout of container!');
            this.focused = false;
        });
    }
    set data(value) {
        this.textboxService.setData(value);
    }
    update(geometry) {
        // Update position:
        this.textboxHTML.textboxContainer.style.left = `${geometry.positionX * 100}%`;
        this.textboxHTML.textboxContainer.style.top = `${geometry.positionY * 100}%`;
        // Update dimensions:
        this.textboxHTML.textboxContainer.style.width = `${geometry.width * 100}%`;
        this.textboxHTML.textboxContainer.style.height = `${geometry.height * 100}%`;
        // Update carret
        this.textboxService.updateCarret();
    }
}
export default TextboxElement;
