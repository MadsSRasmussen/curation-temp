export function generateTextboxElement() {
    const container = document.createElement('div');
    container.classList.add('textBox');
    container.setAttribute('tabindex', '0');
    return container;
}
