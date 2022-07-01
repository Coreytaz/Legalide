const burger = () => {
    let burger = document.querySelector('.menu__burger'),
        menu = document.querySelector('.menu');
    burger.addEventListener('click', (event) => {
        burger.classList.toggle('active');
        menu.classList.toggle('active');
    })
}


export default burger;