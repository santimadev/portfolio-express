// Script for responsive toolbar

const burger = document.getElementById('burger');
const navMobile = document.getElementById('navMobile');
const cross = document.getElementById('cross');
let toggle = false;

navMobile.classList.add('hide');

window.addEventListener('resize', () => {
    if (window.innerWidth > 700) {
        navMobile.style.visibility = 'hidden'
        toggle = false;
    }
})

burger.addEventListener('click', () => {
    toggler();
})

cross.addEventListener('click', () => {
    toggler();
})

function toggler() {
    navMobile.style.visibility = 'visible'
    if (toggle) {
        navMobile.classList.replace('show', 'hide');
        toggle = false;
        return;
    }
    navMobile.classList.replace('hide', 'show');
    toggle = true;
}
