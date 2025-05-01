const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');

const app = express();
const port = 3000;

app.use(cors());


app.use(bodyParser.json());

// Ligação à base de dados MySQL
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'fi26lipe', // <-- tua password
    database: 'smartstudy' // <-- tua base de dados
});

db.connect((err) => {
    if (err) {
        console.error('Erro ao ligar à base de dados:', err);
    } else {
        console.log('Conexão à base de dados estabelecida.');
    }
});

// ================= ROTA DE TESTE =================
app.get('/', (req, res) => {
    res.send('Servidor backend SmartStudy está a funcionar!');
});

// ================= REGISTO =================
app.post('/register', (req, res) => {
    const { name, email, password } = req.body;



    if (!name || !email || !password) {
        return res.status(400).json({ message: 'Por favor, preencha todos os campos.' });
    }

    // Verificar se o email já existe
    db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
        if (err) {
            console.error('Erro ao verificar email:', err);
            return res.status(500).json({ message: 'Erro no servidor.' });
        }

        if (results.length > 0) {
            return res.status(400).json({ message: 'Email já registado.' });
        }

        // Hash da password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Inserir novo utilizador
        db.query('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [name, email, hashedPassword], (err, result) => {
            if (err) {
                console.error('Erro ao registar utilizador:', err);
                return res.status(500).json({ message: 'Erro ao registar.' });
            }

            res.status(201).json({ message: 'Utilizador registado com sucesso!' });
        });
    });
});

// ================= LOGIN =================
app.post('/login', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Por favor, preencha todos os campos.' });
    }

    db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
        if (err) {
            console.error('Erro ao buscar utilizador:', err);
            return res.status(500).json({ message: 'Erro no servidor.' });
        }

        if (results.length === 0) {
            return res.status(401).json({ message: 'Email ou senha incorretos.' });
        }

        const user = results[0];
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ message: 'Email ou senha incorretos.' });
        }

        res.status(200).json({ message: 'Login bem-sucedido!' });
    });
});

// ================= INICIAR SERVIDOR =================
app.listen(port, () => {
    console.log(`Servidor a correr em http://localhost:${port}`);
});

// ================= MUDAR NOME =================
app.put('/update-name', (req, res) => {
    const { email, newName } = req.body;

    if (!email || !newName) {
        return res.status(400).json({ message: 'Email e novo nome são obrigatórios.' });
    }

    db.query('UPDATE users SET name = ? WHERE email = ?', [newName, email], (err, result) => {
        if (err) {
            console.error('Erro ao atualizar nome:', err);
            return res.status(500).json({ message: 'Erro ao atualizar o nome.' });
        }

        res.status(200).json({ message: 'Nome atualizado com sucesso!' });
    });
});

// ================= MUDAR PASSWORD =================
app.put('/update-password', async (req, res) => {
    const { email, currentPassword, newPassword } = req.body;

    if (!email || !currentPassword || !newPassword) {
        return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
    }

    db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
        if (err) {
            console.error('Erro ao buscar utilizador:', err);
            return res.status(500).json({ message: 'Erro ao verificar utilizador.' });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: 'Utilizador não encontrado.' });
        }

        const user = results[0];
        const isMatch = await bcrypt.compare(currentPassword, user.password);

        if (!isMatch) {
            return res.status(401).json({ message: 'Senha atual incorreta.' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        db.query('UPDATE users SET password = ? WHERE email = ?', [hashedPassword, email], (err) => {
            if (err) {
                console.error('Erro ao atualizar senha:', err);
                return res.status(500).json({ message: 'Erro ao atualizar senha.' });
            }

            res.status(200).json({ message: 'Senha atualizada com sucesso!' });
        });
    });
});


// ================= SUPORTE =================
app.post('/suporte', (req, res) => {
    console.log("BODY RECEBIDO NO BACKEND:", req.body);  // <--- linha nova

    const { mensagem } = req.body;

    if (!mensagem || mensagem.trim() === "") {
        return res.status(400).json({ message: 'Mensagem de suporte vazia.' });
    }

    db.query('INSERT INTO support_requests (mensagem) VALUES (?)', [mensagem], (err, result) => {
        if (err) {
            console.error('Erro ao guardar mensagem de suporte:', err);
            return res.status(500).json({ message: 'Erro ao guardar suporte.' });
        }

        res.status(201).json({ message: 'Mensagem de suporte enviada com sucesso!' });
    });
});
