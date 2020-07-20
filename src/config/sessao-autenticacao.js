const uuid = require('uuid/v4');
const sessao = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

//chama o banco
const UsuarioDao = require('../app/infra/usuario-dao')
const db = require('./database');
const { report } = require('./custom-express');


module.exports = (app) => {

    //configuração da sessão e da autenticação.
    passport.use(new LocalStrategy(
        {
            usernameField: 'email',
            passwordField: 'senha'
        },
        (email, senha, done) => {
            const usuarioDao = new UsuarioDao(db);
            usuarioDao.buscaPorEmail(email)
                .then(usuario => {
                    if (!usuario || senha != usuario.senha) {
                        return done(null, false, {
                            mensagem: 'Login e senha incorretos'
                        })
                    }

                    return done(null, usuario)
                })
                .catch( erro => done(erro, false))
        }
    ));


    //Serialização
    passport.serializeUser((usuario, done)=>{
        const usuarioSessao = {
            nome: usuario.nome_completo,
            email: usuario.email
        }

        done(null, usuarioSessao)
    })

    //Deserialização
    passport.deserializeUser((usuarioSessao, done) => {
        done(null, usuarioSessao);
    });

    //Configuração da sessao
    app.use(sessao({
        secret: 'node alura',
        genid: function(req) {
            return uuid();
        },
        resave: false,
        saveUninitialized: false
    }));

    //inicialização do passaport
    app.use(passport.initialize());
    app.use(passport.session());

    app.use(function(req, resp, next){
        req.passport = passport;
        next()
    })
}