class TextboxInputHandler {
    textbox;
    textboxOperator;
    commands = ['backspace', 'enter'];
    constructor(textbox, textboxOperator) {
        this.textbox = textbox;
        this.textboxOperator = textboxOperator;
        // Allow passing by reference to event-listener - makes eventListener removeable
        this.handleSelectionChange = this.handleSelectionChange.bind(this);
        this.initializeEventListeners();
    }
    initializeEventListeners() {
        // Initialize eventlisteners
        this.textbox.addEventListener('keydown', (e) => { this.keydownHandler(e); });
        this.textbox.addEventListener('focusin', () => { this.textboxOperator.updateCarret(); });
        this.textbox.addEventListener('blur', () => { this.textboxOperator.hideCarret(); });
        // Ad selection-change handlers, only fire, when textBox is in focus:
        this.textbox.addEventListener('focus', () => { document.addEventListener('selectionchange', this.handleSelectionChange); });
        this.textbox.addEventListener('blur', () => { document.removeEventListener('selectionchange', this.handleSelectionChange); });
    }
    handleSelectionChange(e) {
        const selection = window.getSelection();
        // Validate selection;
        if (!selection) {
            return;
        }
        this.textboxOperator.updateSelectionState(selection);
        this.textboxOperator.updateCarret();
    }
    ;
    keydownHandler(e) {
        if (e.metaKey || e.ctrlKey) {
            switch (e.key) {
                case 'b':
                    this.textboxOperator.format('strong');
                    return;
                case 'i':
                    this.textboxOperator.format('em');
                    return;
                case 'u':
                    this.textboxOperator.format('u');
                    return;
                case 'j':
                    this.textboxOperator.format('title');
                    return;
            }
        }
        switch (e.key) {
            case 'ArrowLeft':
                this.textboxOperator.moveCarretLeft();
                return;
            case 'ArrowRight':
                this.textboxOperator.moveCarretRight();
                return;
            case 'Enter':
                this.textboxOperator.insertParagraph();
                return;
            case 'Backspace':
                this.textboxOperator.backspace();
                return;
        }
        if (e.key.length > 1) {
            return;
        }
        this.textboxOperator.insertText(e.key);
    }
}
export default TextboxInputHandler;
