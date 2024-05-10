class ImageCatalogue {
    images = [];
    url;
    onDataLoadCallback;
    constructor(src, onDataLoadCallback) {
        this.url = `${src}/gviz/tq?`;
        this.generateImageDataArray(this.url);
        this.onDataLoadCallback = (value) => { onDataLoadCallback(value); };
    }
    async generateImageDataArray(url) {
        const response = await fetch(this.url);
        const responseText = await response.text();
        const jsonString = responseText.substring(47).slice(0, -2);
        const dataObject = JSON.parse(jsonString);
        dataObject.table.rows.forEach((row) => {
            this.images.push(this.generateSingleImageData(row));
        });
        this.onDataLoadCallback(this.images);
    }
    generateSingleImageData(row) {
        const data = {
            title: row.c[0] ? row.c[0].v : '',
            fileName: row.c[1] ? row.c[1].v : '',
            firstColumnContent: row.c[2] ? row.c[2].v : '',
            secondColumnContent: row.c[3] ? row.c[3].v : '',
            scale: row.c[4] ? parseFloat(row.c[4].v) : 1,
            informationText: row.c[5] ? row.c[5].v : '',
        };
        return data;
    }
}
export default ImageCatalogue;
