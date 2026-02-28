import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
const app = express();

const PORT = 4500;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.listen(PORT);
app.get('/', (req,res) => {
    res.sendFile(path.join(__dirname,'index.html'));
});