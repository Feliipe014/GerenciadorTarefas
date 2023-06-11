const express = require('express')
const app = express()
const roteador = express.Router()
const db = require('./db')

app.use(express.json())
app.use(roteador)

app.get('/ola', (req, res) => {
    res.json({
        mensagem: "!!!Hello world!!!"
    })
})

app.get('/tarefas', (req, res) => {
    const query = 'SELECT * FROM tarefas'
    db.all(query, (erro, tarefas) => {
        if (erro == null) {
            res.json(tarefas)
        } else {
            console.error(erro)
            res.status(500).json({ mensagem: "Ocorreu um erro no servidor !" })
        }
    })
})

app.get('/tarefas/:id', (req, res) => {
    const id = req.params.id
    const query = 'SELECT * FROM tarefas WHERE id = ?'

    db.get(query, [id], (erro, tarefa) => {
        if (erro == null) {
            if (tarefa != null) {
                res.json(tarefa)
            } else {
                res.status(404).json({ mensagem: "Tarefa não encontrada" })
            }
        } else {
            console.error(erro)
            res.status(500).json({mensagem: "Ocorreu um erro no servidor !"})
        }
    })

})

app.post('/tarefas', (req, res) => {
    const nome = req.body.nome
    const query = 'INSERT INTO tarefas (nome, feito) VALUES (?, ?)'
    db.run(query, [nome, 0], (erro) => {
        if (erro == null) {
            res.status(201).json({
                id: this.lastID
            })
        } else {
            console.error(erro)
            res.status(500).json({ mensagem: "Ocorreu um erro no servidor"})
        }
    })
})

app.put('/tarefas/:id', (req,res) => {
    const id = req.params.id
    const nome = req.body.nome
    const feito = req.body.feito
    const query = 'UPDATE tarefas SET nome = ?, feito = ? WHERE id = ?'

    db.run(query, [nome,feito,id], (erro) => {
        if (erro == null) {
            res.sendStatus(204)
        } else {
            console.error(erro)
            res.status(500).json({mensagem: "Ocorreu um erro no servidor"})
        }
    })
})

app.delete('/tarefas/:id', (req,res) => {
    const id = req.params.id
    const query = 'DELETE FROM tarefas WHERE id = ?'
    db.run(query, [id], (erro) => {
        if(erro == null){
            res.sendStatus(204)
        } else {
            console.error(erro)
            res.status(500).json({ mensagem: "Ocorreu um erro no servidor"})
        }
    })
})

app.listen(3000, () => {
    console.log("Servidor rodando em localhost:3000")
});