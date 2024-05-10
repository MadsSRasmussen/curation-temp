export function generateCarretElement() {
    const carret = document.createElement('span');
    carret.classList.add('carret');
    return carret;
}
export function generateTextboxElement() {
    const container = document.createElement('div');
    container.classList.add('textBox');
    container.setAttribute('tabindex', '0');
    return container;
}
