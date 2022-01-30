const express = require('express');
const cors = require('cors');

const{Sequelize} = require('./models');

const models = require('./models');

const app = express();
app.use(cors());
app.use(express.json());

let cliente = models.Cliente;
let itempedido = models.ItemPedido;
let pedido = models.Pedido;
let servico = models.Servico;
let compra = models.compra;
let produto = models.Produto;
let itemcompra = models.itemcompra;

app.get('/', function(req, res){
    res.send('Olá, mundo!')
});

app.post('/cliente', async(req, res)=>{
    await cliente.create(
        req.body
    ).then(function(){
        return res.json({
            error: false,
            message: "Serviço criado com sucesso!"
        })
    }).catch(function(erro){
        return res.status(400).json({
            error: true,
            message: "Foi impossível se conectar."
        })
    });
});

app.post('/pedidos', async(req, res)=>{
    await pedido.create(
        req.body
    ).then(function(){
        return res.json({
            error: false,
            message: "Serviço criado com sucesso!"
        })
    }).catch(function(erro){
        return res.status(400).json({
            error: true,
            message: "Foi impossível se conectar."
        })
    });
});


app.post('/servicos', async(req, res)=>{
    await servico.create(
        req.body
    ).then(function(){
        return res.json({
            error: false,
            message: "Serviço criado com sucesso!"
        })
    }).catch(function(erro){
        return res.status(400).json({
            error: true,
            message: "Foi impossível se conectar."
        })
    });
});

app.post('/itempedido', async(req, res)=>{
    await itempedido.create(
        req.body
    ).then(function(){
        return res.json({
            error: false,
            message: "Serviço criado com sucesso!"
        })
    }).catch(function(erro){
        return res.status(400).json({
            error: true,
            message: "Foi impossível se conectar."
        })
    });
});


app.get('/listaservicos',  async(req, res)=>{
    await servico.findAll({
        // raw: true
        order: [['nome', 'ASC']]
    }).then(function(servicos){
        res.json({servicos})
    });
})

app.get('/listaclientes', async(req, res)=>{
    await cliente.findAll({
        raw: true
    }).then(function(clientes){
        res.json({clientes})
    });
});

app.get('/ofertaservicos', async(req, res)=>{
    await servico.count('id').then(function(servicos){
        res.json({servicos});
    });
});

app.get('/servico/:id', async(req, res)=>{
    await servico.findByPk(req.params.id)
    .then(serv =>{
        return res.json({
            error: false,
            serv
        });
    }).catch(function(erro){
        return res.status(400).json({
            error: true,
            message: "Erro: código não encontrado!"
        });
    });
});
app.put('/atualizaservico', async(req, res) =>{
    await servico.update(req.body,{
        where: {id: req.body.id}
    }).then(function(){
        return res.json({
            error: false,
            message: "Serviço foi alterado com sucesso!"
        });
    }).catch(function(erro){
        return res.status(400).json({
            error: true,
            message: "Erro na alteração do serviço."
        });
    });
});

app.get('/pedidos/:id', async(req, res)=>{
    await pedido.findByPk(req.params.id,{include:[{all: true}]})
    .then(ped=>{
        return res.json({ped});
    })
})

app.put('/pedidos/:id/editaritem', async(req, res)=>{
    const item= {
        quantidade: req.body.quantidade,
        valor: req.body.valor
    };

    if(!await pedido.findByPk(req.params.id)){
        return res.status(400).json({
        error: true,
        message:'Pedido não foi encontrado.'
    });
    };
    if (!await servico.findByPk(req.body.ServicoId)){
        return res.status(400).json({
            error: true,
            messagem: 'Serviço nao foi encontrado.'
        });
    };
    await itempedido.update(item, {
        where: Sequelize.and({ServicoId: req.body.ServicoId},
            {PedidoId: req.params.id})
    }).then(function(itens){
        return res.json({
            error: false,
            message: 'Pedido foi alterado com sucesso',
            itens
        });
    }).catch(function(erro){
        return res.status(400).json({
            error: true,
            message:"Erro: não foi possível alterar"
        });
    });
});

app.get('/excluircliente/:id', async(req, res)=>{
    await cliente.destroy({
        where: {id: req.params.id}
}).then(function(){
    return res.json({
        error: false,
        message: "Cliente foi excluído com sucesso!"
    });
}).catch(function(erro){
    return res.status(400).json({
        error: true,
        messagem: "Erro ao excluir o cliente"
    });
});
});


app.post('/compras', async(req, res)=>{
    await compra.create(
        req.body
    ).then(function(){
        return res.json({
            error: false,
            message: "Serviço criado com sucesso!"
        })
    }).catch(function(erro){
        return res.status(400).json({
            error: true,
            message: "Foi impossível se conectar."
        })
    });
});

app.get('/compras/:id', async(req, res)=>{
    await compra.findByPk(req.params.id,{include:[{all: true}]})
    .then(ped=>{
        return res.json({ped});
    })
})

app.put('/compras/:id/editaritem', async(req, res)=>{
    const item= {
        quantidade: req.body.quantidade,
        valor: req.body.valor
    };

    if(!await compra.findByPk(req.params.id)){
        return res.status(400).json({
        error: true,
        message:'Pedido não foi encontrado.'
    });
    };
    if (!await produto.findByPk(req.body.ProdutoId)){
        return res.status(400).json({
            error: true,
            messagem: 'Serviço nao foi encontrado.'
        });
    };
    await itemcompra.update(item, {
        where: Sequelize.and({ServicoId: req.body.ProdutoId},
            {CompraId: req.params.id})
    }).then(function(itens){
        return res.json({
            error: false,
            message: 'Pedido foi alterado com sucesso',
            itens
        });
    }).catch(function(erro){
        return res.status(400).json({
            error: true,
            message:"Erro: não foi possível alterar"
        });
    });
});

app.post('/produtos', async(req, res)=>{
    await produto.create(
        req.body
    ).then(function(){
        return res.json({
            error: false,
            message: "Serviço criado com sucesso!"
        })
    }).catch(function(erro){
        return res.status(400).json({
            error: true,
            message: "Foi impossível se conectar."
        })
    });
});

app.get('/listaprodutos',  async(req, res)=>{
    await produto.findAll({
        // raw: true
        order: [['nome', 'ASC']]
    }).then(function(produto){
        res.json({produto})
    });
})

app.get('/ofertaprodutos', async(req, res)=>{
    await produto.count('id').then(function(produto){
        res.json({produto});
    });
});

app.get('/produto/:id', async(req, res)=>{
    await produto.findByPk(req.params.id)
    .then(pro =>{
        return res.json({
            error: false,
            pro
        });
    }).catch(function(erro){
        return res.status(400).json({
            error: true,
            message: "Erro: código não encontrado!"
        });
    });
});

app.put('/atualizaproduto', async(req, res) =>{
    await produto.update(req.body,{
        where: {id: req.body.id}
    }).then(function(){
        return res.json({
            error: false,
            message: "Serviço foi alterado com sucesso!"
        });
    }).catch(function(erro){
        return res.status(400).json({
            error: true,
            message: "Erro na alteração do serviço."
        });
    });
});

app.post('/itemcompra', async(req, res)=>{
    await itemcompra.create(
        req.body
    ).then(function(){
        return res.json({
            error: false,
            message: "Serviço criado com sucesso!"
        })
    }).catch(function(erro){
        return res.status(400).json({
            error: true,
            message: "Foi impossível se conectar."
        })
    });
});


let port = process.env.PORT || 3001;

app.listen(port, (req, res)=>{
    console.log('servidor ativo: http://localhost:3001');
})
