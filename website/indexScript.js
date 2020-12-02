// Muestra o guarda las opciones del menú tras clickear
function menuFunction() {
    document.getElementById("menu-content").classList.toggle("show");
}

window.onclick = function(event) {
    if (!event.target.matches('.drop-btn')) {
        var dropdowns = document.getElementsByClassName("menu-content")[0];
        if(dropdowns.classList.contains('show')){
            dropdowns.classList.remove('show');
        }
    }
}

window.onscroll = function() {stickyBar()};

var header = document.getElementById("header-section");

var sticky = header.offsetTop;

function stickyBar(){
    if (window.pageYOffset >= sticky){
        header.classList.add('sticky');
    }else{
        navbar.classList.remove('sticky');
    }
}