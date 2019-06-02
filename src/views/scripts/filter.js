const btn = document.getElementById('filter-btn');
const view = document.getElementById('filter-view');
const close = document.getElementById('close');

view.classList.add('init');

btn.addEventListener('click', () => {
    view.classList.replace('init', 'filter');
})

close.addEventListener('click', () => {
    view.classList.replace('filter', 'init');
})