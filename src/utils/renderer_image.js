 // Fix the path for the images with the maked renderer
exports.img = (imagePath) => {
    renderer.image = href => {
    const escapedText = href.replace(/^[.]/, '');
    return `
    <div style="text-align: center">
        <img data-src=${imagePath + escapedText} class="lazy">
    </div>`;
    }
}