import { generateElement } from "../../helpers/html-generators.js";
class Popup {
    container;
    backdropElement;
    popupElement;
    data;
    buttons = [];
    constructor(container) {
        this.container = container;
        this.data = { firstColumn: '' };
        this.backdropElement = this.generateBackdropElement();
        this.popupElement = this.generatePopupElement();
        this.backdropElement.appendChild(this.popupElement);
    }
    display() {
        this.backdropElement = this.generateBackdropElement();
        this.popupElement = this.generatePopupElement();
        this.backdropElement.appendChild(this.popupElement);
        this.container.appendChild(this.backdropElement);
    }
    remove() {
        this.backdropElement.remove();
    }
    generateBackdropElement() {
        const backdropElement = generateElement({
            element: 'div',
            classes: ['popup-backdrop-element']
        });
        return backdropElement;
    }
    generatePopupElement() {
        const popupContainer = generateElement({
            element: 'div',
            classes: ['popup-container']
        });
        const buttonsElement = this.generatePopupButtonsElement();
        popupContainer.appendChild(buttonsElement);
        if (this.data.title) {
            const titleElement = generateElement({
                element: 'h2',
                classes: ['popup-title-element'],
                innerHTML: this.data.title
            });
            popupContainer.appendChild(titleElement);
        }
        const popupContent = generateElement({
            element: 'div',
            classes: ['popup-content']
        });
        const popupContentColumnClass = this.data.secondColumn ? 'popup-content-two-columns' : 'popup-content-single-column';
        popupContent.classList.add(popupContentColumnClass);
        popupContainer.appendChild(popupContent);
        const firstColumnContent = generateElement({
            element: 'div',
            classes: ['popup-content-column', 'popup-content-first-column']
        });
        if (this.data.imageAddress) {
            const imageElement = generateElement({
                element: 'img',
                classes: ['popup-content-image'],
                attributes: {
                    'src': this.data.imageAddress
                }
            });
            firstColumnContent.appendChild(imageElement);
        }
        const firstColumnTextContent = generateElement({
            element: 'div',
            classes: ['popup-content-text-content'],
            innerHTML: this.data.firstColumn
        });
        firstColumnContent.appendChild(firstColumnTextContent);
        popupContent.appendChild(firstColumnContent);
        if (this.data.secondColumn) {
            const secondColumnContent = generateElement({
                element: 'div',
                classes: ['popup-content-column', 'popup-content-first-column']
            });
            const secondColumnTextContent = generateElement({
                element: 'div',
                classes: ['popup-content-text-content', 'popup-content-second-column-text-content'],
                innerHTML: this.data.secondColumn
            });
            secondColumnContent.appendChild(secondColumnTextContent);
            popupContent.appendChild(secondColumnContent);
        }
        return popupContainer;
    }
    generatePopupButtonsElement() {
        const buttonsContainer = generateElement({
            element: 'div',
            classes: ['popup-buttons-container']
        });
        const closePopupButton = generateElement({
            element: 'button',
            classes: ['popup-button', 'popup-close-popup-button'],
            innerHTML: 'Close'
        });
        closePopupButton.addEventListener('click', () => {
            this.remove();
        });
        buttonsContainer.appendChild(closePopupButton);
        this.buttons.forEach(button => {
            const buttonElement = generateElement({
                element: 'button',
                classes: ['popup-button'],
                innerHTML: button.labelText
            });
            buttonElement.addEventListener('click', () => {
                button.onClick();
            });
            buttonsContainer.appendChild(buttonElement);
        });
        return buttonsContainer;
    }
}
export default Popup;
