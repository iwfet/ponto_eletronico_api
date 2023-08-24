const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000; // Porta do servidor

const pool = new Pool({
    user: 'danilovnunes01',
    host: 'ep-misty-silence-65821622.us-east-2.aws.neon.tech',
    database: 'neondb',
    password: 'IN9dkhPJ7jsx',
    port: 5432,
     ssl: {
    rejectUnauthorized: false // Isso desativa a verificação de certificado SSL, apenas para fins de teste. Em produção, é altamente recomendável usar um certificado válido.
  }
  });

app.use(express.json());
app.use(cors());

// Rota para inserir um registro no banco de dados
app.post('/inserir-registro', async (req, res) => {
    const { acao } = req.body;
    const data_hora = new Date(); // Obtém a data e hora atuais
  
    try {
      const result = await pool.query(
        'INSERT INTO registros (acao, data_hora) VALUES ($1, $2) RETURNING *',
        [acao, data_hora]
      );
  
      res.json(result.rows[0]);
    } catch (error) {
      console.error('Erro ao inserir registro:', error);
      res.status(500).json({ erro: 'Erro ao inserir registro' });
    }
  });

// Rota para buscar registros por data
app.get('/buscar-registros', async (req, res) => {
  const { data } = req.query;
  try {
    const result = await pool.query(
      'SELECT acao, data_hora FROM registros WHERE DATE(data_hora) = $1',
      [data]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Erro ao buscar registros:', error);
    res.status(500).json({ erro: 'Erro ao buscar registros' });
  }
});

app.listen(port, () => {
  console.log(`Servidor está rodando na porta ${port}`);
});


module.exports = app;
