class GeometryController {
    container;
    minWidth;
    minHeight;
    geometryData;
    updateCallback;
    constructor(container, initialSettings, updateCallback) {
        this.container = container;
        this.minHeight = initialSettings.minHeight;
        this.minWidth = initialSettings.minWidth;
        this.geometryData = {
            positionX: 0,
            positionY: 0,
            width: this.minWidth,
            height: this.minHeight
        };
        this.updateCallback = (data) => { updateCallback(data); };
    }
    initializeGeometry(geometry) {
        this.geometryData = geometry;
    }
    clampGeometryToValid(action) {
        // Collision with container left and right
        if (this.geometryData.positionX < 0) {
            this.geometryData.positionX = 0;
        }
        if (this.geometryData.positionX + this.geometryData.width > 1) {
            if (action === 'move') {
                this.geometryData.positionX = 1 - this.geometryData.width;
            }
            else {
                this.geometryData.width = 1 - this.geometryData.positionX;
            }
        }
        // Collision with container top and bottom
        if (this.geometryData.positionY < 0) {
            this.geometryData.positionY = 0;
        }
        if (this.geometryData.positionY + this.geometryData.height > 1) {
            if (action == 'move') {
                this.geometryData.positionY = 1 - this.geometryData.height;
            }
            else {
                this.geometryData.height = 1 - this.geometryData.positionY;
            }
        }
        // Check min-width and min-height
        if (this.geometryData.width < this.minWidth) {
            this.geometryData.width = this.minWidth;
        }
        if (this.geometryData.height < this.minHeight) {
            this.geometryData.height = this.minHeight;
        }
    }
    resizeTopLeft(e) {
        const containerRect = this.container.getBoundingClientRect();
        document.onmouseup = () => {
            document.onmousemove = null;
            document.onmouseup = null;
        };
        document.onmousemove = (e) => {
            updateDimensions(e);
            this.clampGeometryToValid('resize');
            this.updateCallback(this.geometryData);
        };
        const updateDimensions = (e) => {
            const mousePercentX = (e.clientX - containerRect.left) / containerRect.width;
            const mousePercentY = (e.clientY - containerRect.top) / containerRect.height;
            if (mousePercentX < 0 || mousePercentY < 0) {
                return;
            }
            this.geometryData.width = this.geometryData.positionX + this.geometryData.width - mousePercentX;
            this.geometryData.height = this.geometryData.positionY + this.geometryData.height - mousePercentY;
            this.geometryData.positionX = mousePercentX;
            this.geometryData.positionY = mousePercentY;
        };
    }
    resizeTopRight(e) {
        const containerRect = this.container.getBoundingClientRect();
        document.onmouseup = () => {
            document.onmousemove = null;
            document.onmouseup = null;
        };
        document.onmousemove = (e) => {
            updateDimensions(e);
            this.clampGeometryToValid('resize');
            this.updateCallback(this.geometryData);
        };
        const updateDimensions = (e) => {
            const mousePercentX = (e.clientX - containerRect.left) / containerRect.width;
            const mousePercentY = (e.clientY - containerRect.top) / containerRect.height;
            if (mousePercentX < 0 || mousePercentY < 0) {
                return;
            }
            this.geometryData.width = mousePercentX - this.geometryData.positionX;
            this.geometryData.height = this.geometryData.height + this.geometryData.positionY - mousePercentY;
            this.geometryData.positionY = mousePercentY;
        };
    }
    resizeBottomLeft(e) {
        const containerRect = this.container.getBoundingClientRect();
        document.onmouseup = () => {
            document.onmousemove = null;
            document.onmouseup = null;
        };
        document.onmousemove = (e) => {
            updateDimensions(e);
            this.clampGeometryToValid('resize');
            this.updateCallback(this.geometryData);
        };
        const updateDimensions = (e) => {
            const mousePercentX = (e.clientX - containerRect.left) / containerRect.width;
            const mousePercentY = (e.clientY - containerRect.top) / containerRect.height;
            if (mousePercentX < 0 || mousePercentY < 0) {
                return;
            }
            this.geometryData.width = this.geometryData.positionX + this.geometryData.width - mousePercentX;
            this.geometryData.height = mousePercentY - this.geometryData.positionY;
            this.geometryData.positionX = mousePercentX;
        };
    }
    resizeBottomRight(e) {
        const containerRect = this.container.getBoundingClientRect();
        document.onmouseup = () => {
            document.onmousemove = null;
            document.onmouseup = null;
        };
        document.onmousemove = (e) => {
            updateDimensions(e);
            this.clampGeometryToValid('resize');
            this.updateCallback(this.geometryData);
        };
        const updateDimensions = (e) => {
            const mousePercentX = (e.clientX - containerRect.left) / containerRect.width;
            const mousePercentY = (e.clientY - containerRect.top) / containerRect.height;
            if (mousePercentX < 0 || mousePercentY < 0) {
                return;
            }
            this.geometryData.width = mousePercentX - this.geometryData.positionX;
            this.geometryData.height = mousePercentY - this.geometryData.positionY;
        };
    }
    move(e) {
        const containerRect = this.container.getBoundingClientRect();
        const mouseOffsetPercentX = ((e.clientX - containerRect.left) / containerRect.width) - this.geometryData.positionX;
        const mouseOffsetPercentY = ((e.clientY - containerRect.top) / containerRect.height) - this.geometryData.positionY;
        document.onmouseup = () => {
            document.onmousemove = null;
            document.onmouseup = null;
        };
        document.onmousemove = (e) => {
            updatePosition(e);
            this.clampGeometryToValid('move');
            this.updateCallback(this.geometryData);
        };
        const updatePosition = (e) => {
            const mousePercentX = (e.clientX - containerRect.left) / containerRect.width;
            const mousePercentY = (e.clientY - containerRect.top) / containerRect.height;
            this.geometryData.positionX = mousePercentX - mouseOffsetPercentX;
            this.geometryData.positionY = mousePercentY - mouseOffsetPercentY;
        };
    }
}
export default GeometryController;
