import { generateElement } from "../../helpers/html-generators.js";
class TextboxHTML {
    resizers;
    menu;
    textarea;
    textboxContainer;
    container;
    constructor(container) {
        this.container = container;
        this.resizers = this.generateResizers();
        this.menu = this.generateMenu();
        this.textarea = this.generateTextbox();
        this.textboxContainer = this.generateTextboxContainer();
        this.preventFocusPropergationOnMousedown();
    }
    generateResizers() {
        const topLeftResizer = generateElement({
            element: 'div',
            classes: ['textbox-resizer', 'textbox-resizer-top-left', 'hidden']
        });
        const topRightResizer = generateElement({
            element: 'div',
            classes: ['textbox-resizer', 'textbox-resizer-top-right', 'hidden']
        });
        const bottomLeftResizer = generateElement({
            element: 'div',
            classes: ['textbox-resizer', 'textbox-resizer-bottom-left', 'hidden']
        });
        const bottomRightResizer = generateElement({
            element: 'div',
            classes: ['textbox-resizer', 'textbox-resizer-bottom-right', 'hidden']
        });
        const resizers = {
            topLeft: topLeftResizer,
            topRight: topRightResizer,
            bottomLeft: bottomLeftResizer,
            bottomRight: bottomRightResizer,
        };
        return resizers;
    }
    generateMenu() {
        const formatMenuBar = generateElement({
            element: 'div',
            classes: ['textbox-menubar', 'textbox-menubar-format', 'hidden']
        });
        const boldButton = generateElement({
            element: 'button',
            classes: ['textbox-menubar-button', 'textbox-menubar-button-format'],
            innerHTML: '<b>B</b>'
        });
        const italicButton = generateElement({
            element: 'button',
            classes: ['textbox-menubar-button', 'textbox-menubar-button-format'],
            innerHTML: '<i>I</i>'
        });
        const underlineButton = generateElement({
            element: 'button',
            classes: ['textbox-menubar-button', 'textbox-menubar-button-format'],
            innerHTML: '<u>U</u>'
        });
        const titleButton = generateElement({
            element: 'button',
            classes: ['textbox-menubar-button', 'textbox-menubar-button-format', 'textbox-menubar-button-title'],
            innerHTML: 'Title'
        });
        formatMenuBar.appendChild(boldButton);
        formatMenuBar.appendChild(italicButton);
        formatMenuBar.appendChild(underlineButton);
        formatMenuBar.appendChild(titleButton);
        const moveMenuBar = generateElement({
            element: 'div',
            classes: ['textbox-menubar', 'textbox-menubar-move', 'hidden']
        });
        const moveButton = generateElement({
            element: 'button',
            classes: ['textbox-menubar-button', 'textbox-menubar-button-move']
        });
        moveButton.appendChild(generateElement({
            element: 'img',
            classes: ['textbox-menubar-button-move-icon'],
            attributes: {
                src: '../assets/icons/move-icon.svg'
            }
        }));
        moveMenuBar.appendChild(moveButton);
        const formatButtons = {
            strongButton: boldButton,
            emphasizeButton: italicButton,
            underlineButton: underlineButton,
            titleButton: titleButton
        };
        const moveButtons = {
            moveButton: moveButton
        };
        const formatMenu = { element: formatMenuBar, buttons: formatButtons };
        const moveMenu = { element: moveMenuBar, buttons: moveButtons };
        return {
            formatSection: formatMenu,
            moveSection: moveMenu
        };
    }
    generateTextbox() {
        return generateElement({
            element: 'div',
            classes: ['textbox-textarea'],
            attributes: {
                'tabindex': '0'
            }
        });
    }
    generateTextboxContainer() {
        const textboxContainer = generateElement({
            element: 'div',
            classes: ['textbox-container'],
            attributes: {
                'tabindex': '0'
            }
        });
        // Appending textarea
        textboxContainer.appendChild(this.textarea);
        // Appending menuBar
        textboxContainer.appendChild(this.menu.formatSection.element);
        textboxContainer.appendChild(this.menu.moveSection.element);
        // Appending resizers
        textboxContainer.appendChild(this.resizers.topLeft);
        textboxContainer.appendChild(this.resizers.topRight);
        textboxContainer.appendChild(this.resizers.bottomLeft);
        textboxContainer.appendChild(this.resizers.bottomRight);
        return textboxContainer;
    }
    preventFocusPropergationOnMousedown() {
        Object.entries(this.resizers).forEach(([key, value]) => {
            value.addEventListener('mousedown', (e) => {
                e.preventDefault();
            });
        });
        Object.entries(this.menu.formatSection.buttons).forEach(([key, value]) => {
            value.addEventListener('mousedown', (e) => {
                e.preventDefault();
            });
        });
        Object.entries(this.menu.moveSection.buttons).forEach(([key, value]) => {
            value.addEventListener('mousedown', (e) => {
                e.preventDefault();
            });
        });
    }
    initialize() {
        this.container.appendChild(this.textboxContainer);
    }
}
export default TextboxHTML;
