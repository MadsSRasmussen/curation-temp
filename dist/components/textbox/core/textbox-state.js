class TextboxState {
    cursor;
    selectionRange;
    normalFontSize;
    titleFontSize;
    _selectionFormats;
    formats;
    onFormatChange;
    constructor(onFormatChange) {
        this.cursor = {
            path: [0, 0],
            index: 0
        };
        this.selectionRange = null;
        this._selectionFormats = {
            strong: false,
            em: false,
            u: false,
            title: false,
        };
        this.formats = Object.keys(this._selectionFormats);
        this.onFormatChange = onFormatChange;
        this.onFormatChange(this._selectionFormats);
        this.normalFontSize = 18;
        this.titleFontSize = 27;
    }
    set selectionFormats(value) {
        for (let i = 0; i < this.formats.length; i++) {
            if (value[this.formats[i]] !== this._selectionFormats[this.formats[i]]) {
                this._selectionFormats = value;
                this.onFormatChange(this._selectionFormats);
                return;
            }
        }
    }
    get selectionFormats() {
        return this._selectionFormats;
    }
    getSelectionFormatsArray() {
        return Object.keys(this._selectionFormats).filter(format => this._selectionFormats[format] == true);
    }
}
export default TextboxState;
