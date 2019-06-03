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
    return `<img data-src=${imagePath + escapedText} class="lazy" style="display: block; margin-left: auto; margin-right: auto;">`;
    }
}

module.exports = renderer;