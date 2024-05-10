class Document {
    paragraphs;
    constructor() {
        this.paragraphs = this.init();
    }
    init() {
        const initialText = {
            type: 'text',
            content: ''
        };
        const initialParagraph = {
            type: 'paragraph',
            children: [initialText]
        };
        return [initialParagraph];
    }
    toString() {
        return JSON.stringify(this);
    }
}
export default Document;
