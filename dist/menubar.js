import TextboxElement from "./components/textbox-element/index.js";
import Menu from "./components/menu/index.js";
const sidebarElement = document.getElementById('menu');
const sidebarButtonElement = document.getElementById('menu-toggle-button');
const sidebarContent = document.getElementById('menu-content');
const toggleSidebarButton = document.getElementById('menu-toggle-button');
toggleSidebarButton.addEventListener('click', () => {
    sidebarElement.classList.toggle('menu-sidebar-expanded');
    sidebarButtonElement.classList.toggle('rotate-180');
    sidebarContent.classList.toggle('hidden');
});
const canvasColorPicker = document.getElementById('canvas-color-picker');
canvasColorPicker.addEventListener('input', () => {
    const canvasElement = document.getElementById('canvas');
    canvasElement.style.backgroundColor = canvasColorPicker.value;
});
const createTextboxButton = document.getElementById('add-textbox-button');
createTextboxButton.addEventListener('click', () => {
    const canvasElement = document.getElementById('canvas');
    const textBox = new TextboxElement(canvasElement);
    textBox.init();
    textBox.focus();
});
const canvas = document.getElementById('canvas');
const imageCatalogue = document.getElementById('image-catalouge-content');
const menu = new Menu(imageCatalogue, canvas);
