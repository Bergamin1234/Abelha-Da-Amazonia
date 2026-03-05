# Arquitetura do Projeto - Abelha da Amazonia

Este documento descreve a estrutura de diretorios do projeto e orienta os desenvolvedores sobre onde salvar novos arquivos.

## Estrutura de Diretorios

```
Abelha-Da-Amazonia/
|-- src/
|   |-- backend/         # APIs, logica de servidor e conexao com banco de dados
|   |-- frontend/        # Interface do usuario (HTML, CSS, JS)
|       |-- index.html           # Pagina principal (versao desktop)
|       |-- mobileconverter.html # Pagina principal (versao mobile)
|
|-- data/
|   |-- raw/             # Dados brutos das abelhas (sem processamento)
|   |-- processed/       # Dados limpos e processados
|
|-- scripts/             # Scripts de automacao, web scraping, processamento de sinais/IA
|
|-- docs/                # Documentacao do projeto, imagens e planos de pesquisa (PDF, etc.)
|
|-- tests/               # Testes unitarios e de integracao
|
|-- .gitignore           # Arquivos e pastas ignorados pelo Git
|-- ARCHITECTURE.md      # Este arquivo - documentacao da estrutura do projeto
|-- README.md            # Descricao geral do projeto
```

## Onde Salvar Novos Arquivos

| Tipo de Arquivo | Diretorio |
|---|---|
| API / Servidor / Banco de Dados | `src/backend/` |
| Paginas HTML / CSS / JavaScript | `src/frontend/` |
| Dados brutos (coleta, sensores) | `data/raw/` |
| Dados processados / limpos | `data/processed/` |
| Scripts de automacao / IA / scraping | `scripts/` |
| Documentacao / PDFs / Imagens do projeto | `docs/` |
| Testes unitarios e de integracao | `tests/` |

## Convencoes de Nomenclatura

- Nomes de arquivos devem seguir o padrao **snake_case** (ex: `meu_arquivo.html`, `dados_abelhas.csv`).
- Nomes de diretorios devem ser em **lowercase** (ex: `src/`, `data/`).
- Evitar acentos e caracteres especiais em nomes de arquivos e pastas.

## Observacoes Importantes

- **Nao commitar** arquivos temporarios, logs, ou configuracoes locais de IDE (ver `.gitignore`).
- **Imagens de produto** devem ser hospedadas externamente (ex: Pexels, Cloudinary) e referenciadas via URL no codigo.
- O arquivo `cart.html` (carrinho de compras) ainda precisa ser criado em `src/frontend/`.
