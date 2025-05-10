const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use('/uploads', express.static('uploads'));

// Ligação à base de dados MySQL
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'fi26lipe',
    database: 'smartstudy'
});

db.connect((err) => {
    if (err) {
        console.error('Erro ao ligar à base de dados:', err);
    } else {
        console.log('Conexão à base de dados estabelecida.');
    }
});

// =================== MULTER CONFIG ===================
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = 'uploads/';
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir);
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '_' + file.originalname);
    }
});
const upload = multer({ storage });

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

    db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
        if (err) {
            console.error('Erro ao verificar email:', err);
            return res.status(500).json({ message: 'Erro no servidor.' });
        }

        if (results.length > 0) {
            return res.status(400).json({ message: 'Email já registado.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

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
    console.log("BODY RECEBIDO NO BACKEND:", req.body);

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


// ================= UPLOAD DE FICHEIROS CSV =================

const csvStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        const uniqueName = Date.now() + '-' + file.originalname;
        cb(null, uniqueName);
    }
});

const csvUpload = multer({ 
    storage: csvStorage,
    fileFilter: function (req, file, cb) {
        if (file.mimetype === 'text/csv' || file.originalname.endsWith('.csv')) {
            cb(null, true);
        } else {
            cb(new Error('Apenas ficheiros CSV são permitidos.'), false);
        }
    }
});

app.post('/upload-csv', csvUpload.single('ficheiro_csv'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'Nenhum ficheiro foi enviado.' });
    }

    const nomeFicheiro = req.file.originalname;
    const caminho = req.file.path;

    db.query(
        'INSERT INTO csv_uploads (nome_ficheiro, caminho) VALUES (?, ?)',
        [nomeFicheiro, caminho],
        (err, result) => {
            if (err) {
                console.error('Erro ao guardar CSV na base de dados:', err);
                return res.status(500).json({ message: 'Erro ao guardar CSV.' });
            }

            res.status(201).json({ message: 'Ficheiro CSV carregado com sucesso!' });
        }
    );
});

// ==================== NOVAS ROTAS PARA VISUALIZAR E APAGAR FICHEIROS ====================

// Buscar todos os ficheiros CSV carregados
app.get('/ficheiros', (req, res) => {
    db.query('SELECT id, nome_ficheiro FROM csv_uploads ORDER BY data_upload DESC', (err, results) => {
        if (err) {
            console.error('Erro ao buscar ficheiros:', err);
            return res.status(500).json({ message: 'Erro ao buscar ficheiros.' });
        }

        res.status(200).json({ ficheiros: results });
    });
});

// Apagar ficheiros selecionados (base de dados + servidor)
app.delete('/ficheiros', express.json(), (req, res) => {
    const ids = req.body.ids;

    if (!Array.isArray(ids) || ids.length === 0) {
        return res.status(400).json({ message: 'IDs inválidos.' });
    }

    // Primeiro buscar caminhos físicos para apagar os ficheiros
    db.query('SELECT caminho FROM csv_uploads WHERE id IN (?)', [ids], (err, rows) => {
        if (err) {
            console.error('Erro ao buscar caminhos de ficheiros:', err);
            return res.status(500).json({ message: 'Erro ao buscar caminhos.' });
        }

        // Apagar ficheiros fisicamente
        rows.forEach(row => {
            fs.unlink(row.caminho, (err) => {
                if (err) console.warn('Erro ao apagar ficheiro do servidor:', row.caminho);
            });
        });

        // Depois apagar da base de dados
        db.query('DELETE FROM csv_uploads WHERE id IN (?)', [ids], (err) => {
            if (err) {
                console.error('Erro ao apagar ficheiros na base de dados:', err);
                return res.status(500).json({ message: 'Erro ao apagar ficheiros.' });
            }

            res.status(200).json({ message: 'Ficheiros apagados com sucesso.' });
        });
    });
});



// ================= INICIAR SERVIDOR =================
app.listen(port, () => {
    console.log(`Servidor a correr em http://localhost:${port}`);
});
