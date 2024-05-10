export function generateElement(options) {
    const element = document.createElement(options.element);
    if (options.id) {
        element.setAttribute('id', options.id);
    }
    ;
    if (options.classes) {
        options.classes.forEach(className => element.classList.add(className));
    }
    ;
    if (options.attributes) {
        const attributeKeys = Object.keys(options.attributes);
        attributeKeys.forEach(attribute => {
            if (options.attributes) {
                element.setAttribute(attribute, options.attributes[attribute]);
            }
        });
    }
    if (options.innerHTML) {
        element.innerHTML = options.innerHTML;
    }
    ;
    return element;
}
