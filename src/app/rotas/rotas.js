const LivroDao = require('../infra/livro-dao');
const db = require('../../config/database');

module.exports = (app) => {
    app.get('/', (req, resp) =>{
        resp.send(`
            <html>
                <head>
                    <meta charset="utf-8">
                </head>
                <body>
                    <h1> Casa do Cóodigo </h1>
                </body> 
            </html>
        `)
    })
    
    app.get('/livros', (req, resp) =>{

        const livroDao = new LivroDao(db)

        //USANDO PROMISSES 
        livroDao.lista()
            .then(livros => resp.marko(
                require('../views/livros/lista/lista.marko'),
                {
                    livros: livros
                }

            ))
            .catch(erro => console.log(erro));


        // //SEM PROMISSES E COM PARAMETROS NO METODO LISTA
        // livroDao.lista(function(erro, resultados) {

        //     resp.marko(
        //         require('../views/livros/lista/lista.marko'),
        //         {
        //             livros: resultados
        //         }
    
        //     );
    
        // });

        // db.all('select * from livros', function(erro, resultados){

        //     resp.marko(
        //         require('../views/livros/lista/lista.marko'),
        //         {
        //             livros: resultados
        //         }
        //     )

        // })
    })

    app.get('/livros/form', function(req, resp){
        resp.marko(require('../views/livros/form/form.marko'), {livro: {}})
    })

    //CRIAR UM NOVO LIVRO
    app.post('/livros', function(req, resp){
        console.log(req.body);

        const livroDao = new LivroDao(db)

        //USANDO PROMISSES 
        livroDao.adiciona(req.body)
        .then(resp.redirect('/livros'))
        .catch(erro => console.log(erro));
    })

    //EDITA
    app.put('/livros', function(req, resp){
        console.log(req.body);

        const livroDao = new LivroDao(db)

        //USANDO PROMISSES 
        livroDao.atualiza(req.body)
        .then(resp.redirect('/livros'))
        .catch(erro => console.log(erro));
    })

    //TESTE
    app.get('/livro/:id', function(req, resp){
        const livroDao = new LivroDao(db)
        livroDao.buscaPorId(req.params.id)
        .then(livroo => {
            console.log(`O livro buscado foi ${JSON.stringify(livroo)}`)
        })

        console.log('Request Id:', req.params.id);
    })

    //DELETA UM LIVRO
    app.delete('/livros/:id', (req, resp)=>{
        const id = req.params.id;

        const livroDao = new LivroDao(db)
        livroDao.remove(id)
                .then(()=>{
                    resp.status(200).end()
                })
                .catch(erro => console.log(erro));
    })

    //PEGA UM LIVRO ESPECIFICO
    app.get('/livros/form/:id', function(req, resp) {
        const id = req.params.id;
        const livroDao = new LivroDao(db);
    
        livroDao.buscaPorId(id)
            .then(livro => 
                resp.marko(
                    require('../views/livros/form/form.marko'),
                    { livro: livro }
                )
            )
            .catch(erro => console.log(erro));
    
    });
}
