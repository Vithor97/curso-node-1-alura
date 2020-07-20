let erro = document.getElementById("errorr")



if(erro){
    setTimeout(function(){
        console.log('entrei no erro eheh')
        erro.style.display = 'none';
    }, 3000);
}
else{
    console.log('tchauuuuuuu')
}
// console.log("errooooo aparecendo: " + erro.tagName)
