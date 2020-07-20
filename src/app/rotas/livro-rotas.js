//Chamando o modelo com as validações
const Livro = require('../modelos/livro')
//Chamando o Controlador de Livro
const LivroControlador = require('../controladores/livro-controlador')
const livroControlador = new LivroControlador()

const BaseControlador = require('../controladores/base-controlador');
const { rotas } = require('../controladores/livro-controlador');

module.exports = (app) => {

    const rotasLivro = LivroControlador.rotas();


    app.use(rotasLivro.autenticadas, function(req, resp, next) {
        if (req.isAuthenticated()) {
            next();
        } else {
            resp.redirect(BaseControlador.rotas().login);
        }
    });
    
    app.get(rotasLivro.lista, livroControlador.lista());

    //É POSSIVEL AGREGAR ROTAS IGUAIS
    
    app.route(rotasLivro.cadastro)
        .get(livroControlador.formularioCadastro())
        .post(Livro.validacoes(), livroControlador.cadastra())
        .put(livroControlador.edita())

    //app.get(rotasLivro.cadastro, livroControlador.formularioCadastro());

    app.get(rotasLivro.edicao, livroControlador.formularioEdicao());

    //app.post(rotasLivro.cadastro, Livro.validacoes(), livroControlador.cadastra());

    //app.put(rotasLivro.cadastro, livroControlador.edita());

    app.delete(rotasLivro.delecao, livroControlador.remove());
};