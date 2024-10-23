document.addEventListener("DOMContentLoaded", function() {
    let aciertos = localStorage.getItem("aciertos") || 200;
    let desaciertos = localStorage.getItem("desaciertos") || 50;
    let tiempo = localStorage.getItem("tiempo") || "10 horas";
    let comentarios = localStorage.getItem("comentarios") || 140;
    
    document.querySelector("p.aciertos").textContent = `Aciertos: ${aciertos}/250`;
    document.querySelector("p.desaciertos").textContent = `Desaciertos: ${desaciertos}/250`;
    document.querySelector("p.tiempo").textContent = `Tiempo dedicado al curso: ${tiempo}`;
    document.querySelector("p.comentarios").textContent = `Comentarios publicados en el foro: ${comentarios}`;
});
