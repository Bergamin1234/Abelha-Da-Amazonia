# Changelog — Abelha da Amazônia (Loja Virtual)

Todas as alterações relevantes deste projeto seguem [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/) e [Versionamento Semântico (SemVer)](https://semver.org/lang/pt-BR/).

## [2.0.0] - 2026-11-18

### Adicionado
- **Página Inicial de Compra (`index.html`):** catálogo dinâmico responsivo, filtros por categoria, busca em tempo real, ordenação, modal *Quick View* e gaveta lateral de carrinho (*drawer*) com simulador de frete por CEP e cupons de desconto (`AMAZONIA10`, `PRIMEIRACOMPRA`, `FRETEGRATIS`).
- **Fluxo Completo de Checkout (`checkout.html` e `order-success.html`):** preenchimento automático de endereço via **ViaCEP**, máscaras de CPF/telefone/CEP, pagamento via **Pix (5% OFF + QR Code dinâmico)**, **Cartão de Crédito (preview 3D + até 6x)** e **Boleto Bancário**, com baixa automática no estoque e comprovante imprimível.
- **Identidade Visual Oficial & Fotos Reais:** integração do ícone oficial (`site-icon.png`, `favicon.png`), logo vetorizada (`logo.svg`, `logo-dark.svg`), fotos reais dos produtos e do apiário em Porto Velho - RO, e galeria integrada ao Instagram `@abelhadaamazonia`.
- **Login Administrativo Discreto:** acesso reservado no rodapé e atalho global `Ctrl + Shift + A` (`admin-login.html` e `admin.html`).
- **Deploy em Produção na Vercel:** `vercel.json` configurado para deploy estático contínuo na branch `main` (`https://abelha-da-amazonia.vercel.app/`), rotas limpas (`cleanUrls`) e cabeçalhos de segurança, integrado ao **Bergamin Hub**.
- **Servidor Local Nativo:** `server.js`, `package.json` e `start.bat` para execução instantânea em `http://localhost:3000`.
