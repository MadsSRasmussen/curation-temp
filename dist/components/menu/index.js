import ImageCatalogue from "../image-catalogue/index.js";
import { generateElement } from "../../helpers/html-generators.js";
import ImageElement from "../image-element/index.js";
class Menu {
    imageCatalogue;
    imageCatalogueElement;
    canvasElement;
    constructor(imageCatalogueElement, canvasElement) {
        this.imageCatalogue = new ImageCatalogue('https://docs.google.com/spreadsheets/d/1y4vJ9V8bKanX6Pzf9ebcJ0yV9zCHAn6yZifQcV__JQg', (data) => {
            this.onImageDataLoad(data);
        });
        this.imageCatalogueElement = imageCatalogueElement;
        this.canvasElement = canvasElement;
    }
    onImageDataLoad(imageData) {
        console.log('Image data loaded!');
        imageData.forEach(data => {
            const imageCardElement = this.generateImageGridElement(data);
            imageCardElement.addEventListener('click', () => {
                // Instantiate image element to canvas
                const imageElement = new ImageElement(data, this.canvasElement);
                imageElement.init();
            });
            this.imageCatalogueElement.appendChild(imageCardElement);
        });
    }
    generateImageGridElement(data) {
        const container = generateElement({
            element: 'div',
            classes: ['image-grid-element-container']
        });
        const image = generateElement({
            element: 'img',
            classes: ['image-grid-element-image'],
            attributes: {
                'src': `../assets/images/${data.fileName}`
            }
        });
        const title = generateElement({
            element: 'div',
            classes: ['image-grid-element-title'],
            innerHTML: data.title
        });
        container.appendChild(image);
        container.appendChild(title);
        return container;
    }
}
export default Menu;
