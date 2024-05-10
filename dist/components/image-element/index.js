import { generateElement } from "../../helpers/html-generators.js";
import Popup from "../popup/index.js";
const ImagePopup = new Popup(document.querySelector('body'));
class ImageElement {
    imageData;
    container;
    geometry;
    isMoveing = false;
    imageElement;
    canvasAspectRatio = 2.5;
    scaleFactor = 0.2;
    constructor(imageData, container) {
        this.imageData = imageData;
        this.container = container;
        this.geometry = {
            positionX: 0,
            positionY: 0,
            width: 0,
            height: 0
        };
        this.imageElement = generateElement({
            element: 'div',
            classes: ['image-element']
        });
    }
    async init() {
        await this.setImageSrc();
        this.initializeEventListeners();
        this.container.appendChild(this.imageElement);
    }
    initializeEventListeners() {
        this.imageElement.addEventListener('mousedown', this.moveImage.bind(this));
        this.imageElement.addEventListener('click', this.displayImageInformation.bind(this));
    }
    displayImageInformation() {
        if (this.isMoveing) {
            return;
        }
        ImagePopup.data = {
            title: this.imageData.title,
            firstColumn: this.imageData.firstColumnContent,
            secondColumn: this.imageData.secondColumnContent,
            imageAddress: `../assets/images/${this.imageData.fileName}`,
        };
        const removeImageButtonInstruction = {
            labelText: 'Slet',
            onClick: () => {
                this.removeFromCanvas();
                ImagePopup.remove();
            }
        };
        ImagePopup.buttons = [removeImageButtonInstruction];
        ImagePopup.display();
    }
    removeFromCanvas() {
        console.log('Removeing image!');
        this.imageElement.remove();
    }
    moveImage(e) {
        const containerRect = this.container.getBoundingClientRect();
        const mouseOffsetPercentX = ((e.clientX - containerRect.left) / containerRect.width) - this.geometry.positionX;
        const mouseOffsetPercentY = ((e.clientY - containerRect.top) / containerRect.height) - this.geometry.positionY;
        document.onmouseup = () => {
            document.onmousemove = null;
            document.onmouseup = null;
            setTimeout(() => {
                this.isMoveing = false;
            }, 0);
        };
        document.onmousemove = (e) => {
            this.isMoveing = true;
            updatePosition(e);
            this.update();
        };
        const updatePosition = (e) => {
            const mousePercentX = (e.clientX - containerRect.left) / containerRect.width;
            const mousePercentY = (e.clientY - containerRect.top) / containerRect.height;
            this.geometry.positionX = mousePercentX - mouseOffsetPercentX;
            this.geometry.positionY = mousePercentY - mouseOffsetPercentY;
        };
    }
    update() {
        this.imageElement.style.width = `${this.geometry.width * 100}%`;
        this.imageElement.style.height = `${this.geometry.height * 100}%`;
        this.imageElement.style.left = `${this.geometry.positionX * 100}%`;
        this.imageElement.style.top = `${this.geometry.positionY * 100}%`;
    }
    async setImageSrc() {
        this.imageElement.style.backgroundImage = `url(../assets/images/${this.imageData.fileName})`;
        const dimensions = await getImageDimensions(`../assets/images/${this.imageData.fileName}`);
        const normalizedDimensions = this.normalizeDimensions(dimensions, this.imageData.scale);
        this.geometry.width = normalizedDimensions.width;
        this.geometry.height = normalizedDimensions.height * this.canvasAspectRatio;
        this.update();
        function getImageDimensions(src) {
            return new Promise((resolve, reject) => {
                const image = new Image();
                image.onload = () => {
                    resolve({ width: image.width, height: image.height });
                };
                image.src = src;
            });
        }
    }
    normalizeDimensions(dimensions, scale) {
        const ratio = (dimensions.width * dimensions.height) / 100;
        return { width: (dimensions.width / ratio) * scale, height: (dimensions.height / ratio) * scale };
    }
}
export default ImageElement;
