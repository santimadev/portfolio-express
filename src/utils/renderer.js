const marked = require('marked');
const renderer = new marked.Renderer();

renderer.link = (href, title, text) => {
    return `
    <a style="color: #F4743B;" href=${href}>${text}</a>
    `
}

renderer.custom_img = (imagePath) => {
    renderer.image = href => {
    const escapedText = href.replace(/^[.]/, '');
    return `
    <div style="display: flex; justify-content: center;">
        <img data-src=${imagePath + escapedText} class="lazy" style="height: auto">
    </div>`;
    }
}

module.exports = renderer;