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