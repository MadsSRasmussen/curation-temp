class Canvas {
    pixelFontSize;
    _percentFontSize;
    canvasElement;
    resizeObserver;
    constructor(canvasElement, percentFontSize) {
        this.canvasElement = canvasElement;
        this._percentFontSize = percentFontSize;
        console.log(this.canvasElement);
        const canvasRect = this.canvasElement.getBoundingClientRect();
        this.pixelFontSize = (this._percentFontSize / 100) * canvasRect.width;
        this.updatePixelFontSize();
        this.resizeObserver = new ResizeObserver(this.updatePixelFontSize.bind(this));
        this.resizeObserver.observe(this.canvasElement);
    }
    updatePixelFontSize() {
        console.log('Updateing pixelFontSize!');
        const canvasRect = this.canvasElement.getBoundingClientRect();
        this.pixelFontSize = (this._percentFontSize / 100) * canvasRect.width;
        this.canvasElement.style.fontSize = `${this.pixelFontSize}px`;
    }
    initializeResizeObserver() {
    }
    set percentFontSize(value) {
        this._percentFontSize = value;
        const canvasRect = this.canvasElement.getBoundingClientRect();
        this.pixelFontSize = (value / 100) * canvasRect.width;
    }
    get percentFontSize() {
        return this._percentFontSize;
    }
}
export default Canvas;
