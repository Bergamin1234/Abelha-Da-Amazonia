/**
 * Servidor Local HTTP para Abelha da Amazônia
 * Sem dependências externas (utiliza módulos nativos do Node.js)
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = __dirname;

const MIME_TYPES = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.webp': 'image/webp',
    '.woff2': 'font/woff2',
    '.woff': 'font/woff',
    '.ttf': 'font/ttf'
};

const server = http.createServer((req, res) => {
    // Sanitização da URL
    let cleanUrl = decodeURIComponent(req.url.split('?')[0]);
    
    // Rotas amigáveis
    if (cleanUrl === '/' || cleanUrl === '') cleanUrl = '/index.html';
    else if (cleanUrl === '/admin') cleanUrl = '/admin.html';
    else if (cleanUrl === '/login' || cleanUrl === '/admin-login') cleanUrl = '/admin-login.html';
    else if (cleanUrl === '/checkout') cleanUrl = '/checkout.html';
    else if (cleanUrl === '/sucesso' || cleanUrl === '/order-success') cleanUrl = '/order-success.html';

    const safePath = path.normalize(cleanUrl).replace(/^(\.\.[\/\\])+/, '');
    let filePath = path.join(PUBLIC_DIR, safePath);

    fs.stat(filePath, (err, stats) => {
        if (err || !stats.isFile()) {
            // Tenta adicionar extensão .html se for rota sem extensão
            if (!path.extname(filePath)) {
                const tryHtml = filePath + '.html';
                if (fs.existsSync(tryHtml)) {
                    filePath = tryHtml;
                } else {
                    res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
                    res.end(`
                        <!DOCTYPE html>
                        <html lang="pt-BR">
                        <head><meta charset="UTF-8"><title>404 - Não Encontrado</title><script src="https://cdn.tailwindcss.com"></script></head>
                        <body class="bg-stone-50 flex items-center justify-center min-h-screen text-center p-4">
                            <div class="bg-white p-8 rounded-3xl shadow-lg border border-stone-200 max-w-sm">
                                <span class="text-4xl block mb-3">🐝</span>
                                <h1 class="text-xl font-bold text-gray-900 mb-2">Página Não Encontrada</h1>
                                <p class="text-xs text-gray-500 mb-6">O endereço solicitado não foi localizado no servidor.</p>
                                <a href="/" class="px-5 py-2.5 bg-amber-500 text-white font-bold text-xs rounded-full shadow hover:bg-amber-600 transition">Voltar à Loja</a>
                            </div>
                        </body>
                        </html>
                    `);
                    return;
                }
            } else {
                res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
                res.end('404 Arquivo não encontrado');
                return;
            }
        }

        const ext = path.extname(filePath).toLowerCase();
        const contentType = MIME_TYPES[ext] || 'application/octet-stream';

        res.writeHead(200, {
            'Content-Type': contentType,
            'Access-Control-Allow-Origin': '*',
            'Cache-Control': 'no-cache'
        });

        const stream = fs.createReadStream(filePath);
        stream.pipe(res);
    });
});

server.listen(PORT, () => {
    console.log(`\n======================================================`);
    console.log(`🐝 Abelha da Amazônia - Servidor Local Iniciado!`);
    console.log(`======================================================`);
    console.log(`  🛒 Loja Virtual:   http://localhost:${PORT}`);
    console.log(`  💳 Checkout:       http://localhost:${PORT}/checkout.html`);
    console.log(`  🔒 Login Admin:    http://localhost:${PORT}/admin-login.html`);
    console.log(`  📊 Painel Admin:   http://localhost:${PORT}/admin.html`);
    console.log(`======================================================\n`);
});
