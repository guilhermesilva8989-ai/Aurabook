# AuraBook

> Plataforma Full Stack para gestão de agendas, clientes, serviços e atendimentos.

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![NestJS](https://img.shields.io/badge/NestJS-12-E0234E?logo=nestjs)](https://nestjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-4169E1?logo=postgresql)](https://neon.tech/)
[![Prisma](https://img.shields.io/badge/Prisma-7-2D3748?logo=prisma)](https://www.prisma.io/)
[![Vercel](https://img.shields.io/badge/Frontend-Vercel-black?logo=vercel)](https://vercel.com/)
[![Render](https://img.shields.io/badge/API-Render-46E3B7?logo=render)](https://render.com/)

## Aplicação online

**AuraBook:** https://aurabook-web.vercel.app

**Código-fonte:** https://github.com/guilhermesilva8989-ai/Aurabook

---

## Sobre o AuraBook

O **AuraBook** é uma aplicação SaaS para profissionais e pequenos negócios que trabalham com atendimentos agendados.

A plataforma centraliza clientes, serviços, disponibilidade e agendamentos em um único sistema, permitindo organizar todo o fluxo de atendimento de forma simples.

O projeto foi desenvolvido como uma aplicação **Full Stack completa**, com autenticação, isolamento de dados por negócio, regras de disponibilidade, prevenção de conflitos de horário e deploy em produção.

---

## Funcionalidades

### Autenticação

- Cadastro de usuários
- Login com e-mail e senha
- Autenticação JWT
- Senhas protegidas com hash
- Rotas protegidas
- Logout
- Criação automática do perfil profissional no onboarding

### Dashboard

- Agendamentos do dia
- Agendamentos confirmados
- Total de clientes
- Total de serviços
- Próximos atendimentos
- Total de agendamentos
- Estado inicial orientando novos usuários

### Agenda

- Criar agendamento
- Editar agendamento
- Reagendar atendimento
- Validar disponibilidade
- Impedir conflito de horários
- Filtrar por status

Status suportados:

- Pendente
- Confirmado
- Concluído
- Cancelado
- Não compareceu

### Clientes

- Cadastro
- Listagem
- Detalhes
- Edição
- Telefone formatado

### Serviços

- Cadastro
- Listagem
- Edição
- Duração do atendimento

### Disponibilidade

O profissional configura os períodos em que atende durante cada dia da semana.

O sistema também suporta períodos que atravessam a meia-noite, por exemplo:

22:00 - 02:00

Esses horários são utilizados pela API para validar novos agendamentos e reagendamentos.

### Responsividade

A aplicação possui interface adaptada para:

- Desktop
- Tablet
- Smartphone

No mobile, o AuraBook possui uma navegação inferior dedicada às principais áreas do sistema.

---

## Tecnologias

### Frontend

- Next.js 16
- React
- TypeScript
- Tailwind CSS
- App Router

### Backend

- Node.js
- NestJS
- TypeScript
- JWT
- Passport
- bcrypt
- class-validator

### Banco de dados

- PostgreSQL
- Prisma ORM
- Neon

### Infraestrutura

- Vercel
- Render
- Neon
- Docker
- GitHub

---

## Arquitetura

O AuraBook utiliza uma arquitetura separada entre frontend, backend e banco de dados:

    Usuário
       |
       v
    Vercel
    Next.js
       |
       | HTTPS
       v
    Render
    NestJS API
       |
       | Prisma ORM
       v
    Neon
    PostgreSQL

### Monorepo

A aplicação está organizada em um monorepo:

    Aurabook/
    |
    ├── apps/
    │   ├── api/
    │   │   ├── prisma/
    │   │   └── src/
    │   │
    │   └── web/
    │       ├── app/
    │       └── public/
    │
    ├── packages/
    ├── docs/
    ├── docker-compose.yml
    ├── package.json
    └── README.md

---

## Fluxo de utilização

O fluxo principal da aplicação é:

    Criar conta
        ↓
    Criar perfil profissional
        ↓
    Cadastrar cliente
        ↓
    Cadastrar serviço
        ↓
    Configurar disponibilidade
        ↓
    Criar agendamento
        ↓
    Confirmar atendimento
        ↓
    Concluir / Cancelar / Não compareceu

---

## Regras de agendamento

Antes de criar ou reagendar um atendimento, a API valida:

1. Profissional
2. Cliente
3. Serviço
4. Data e horário
5. Disponibilidade configurada
6. Duração do serviço
7. Conflitos com outros atendimentos
8. Status dos agendamentos existentes

Isso evita que dois atendimentos ocupem o mesmo período.

---

## Multi-tenancy

O AuraBook foi desenvolvido com separação de dados por negócio.

Cada conta possui seu próprio contexto, evitando que:

- clientes sejam visualizados por outras contas;
- serviços sejam compartilhados entre negócios;
- agendamentos apareçam para usuários incorretos;
- informações de um tenant sejam acessadas por outro tenant.

---

## Segurança

A aplicação utiliza:

- JWT para autenticação
- Hash de senhas com bcrypt
- Validação de DTOs
- Rotas protegidas no backend
- Variáveis de ambiente
- Separação de dados por tenant
- CORS configurável por ambiente
- Validação de acesso aos recursos

---

## Ambiente de produção

O AuraBook está publicado utilizando:

    GitHub
       |
       ├── apps/web
       |      |
       |      v
       |   Vercel
       |
       └── apps/api
              |
              v
           Render
              |
              v
            Neon

### Frontend

Hospedado na Vercel:

https://aurabook-web.vercel.app

### Backend

API NestJS hospedada no Render.

### Banco de dados

PostgreSQL hospedado no Neon.

---

## Testes realizados em produção

O fluxo principal foi validado no ambiente publicado.

Foram testados com sucesso:

- criação de conta;
- login;
- autenticação;
- criação automática do profissional;
- cadastro de cliente;
- cadastro de serviço;
- configuração de disponibilidade;
- criação de agendamento;
- reagendamento;
- alteração de status;
- persistência no PostgreSQL;
- comunicação Vercel -> Render -> Neon.

---

## Roadmap

Funcionalidades planejadas para próximas versões:

- [ ] Integração com WhatsApp Business Cloud API
- [ ] Confirmação automática pelo WhatsApp
- [ ] Lembretes antes do atendimento
- [ ] Cancelamento pelo WhatsApp
- [ ] Reagendamento pelo WhatsApp
- [ ] Webhooks para status de mensagens
- [ ] Página pública de agendamento
- [ ] Link compartilhável de agendamento
- [ ] Recuperação de senha
- [ ] Notificações
- [ ] Relatórios financeiros
- [ ] Dashboard de faturamento
- [ ] Testes automatizados adicionais
- [ ] Pipeline CI/CD

### WhatsApp

A integração com a WhatsApp Business Cloud API está planejada para uma versão futura.

A proposta é permitir que o AuraBook envie automaticamente:

- confirmação do agendamento;
- lembrete antes do atendimento;
- aviso de alteração de horário;
- confirmação de cancelamento.

Também está planejado permitir interações de cancelamento e reagendamento através do WhatsApp.


---

## Executando localmente

### Pré-requisitos

Tenha instalado:

- Node.js
- npm
- Docker Desktop
- Git

Clone o projeto:

    git clone https://github.com/guilhermesilva8989-ai/Aurabook.git
    cd Aurabook

Instale as dependências:

    npm install

### Banco de dados local

Suba o PostgreSQL com Docker:

    docker compose up -d

### Backend

Em um terminal:

    cd apps/api
    npm run start:dev

A API ficará disponível em:

    http://localhost:3001/api

### Frontend

Em outro terminal:

    cd apps/web
    npm run dev

A aplicação ficará disponível em:

    http://localhost:3000

---

## Variáveis de ambiente

### Backend

Exemplo:

    DATABASE_URL="postgresql://..."
    JWT_SECRET="sua-chave-segura"
    FRONTEND_URL="http://localhost:3000"
    PORT="3001"

### Frontend

Em produção, o frontend utiliza:

    API_URL="https://sua-api.com"

Nunca publique tokens, senhas ou credenciais reais no repositório.

---

## Screenshots

As imagens abaixo representam as principais áreas do AuraBook.

### Landing Page

Imagem em breve.

### Cadastro

Imagem em breve.

### Dashboard

Imagem em breve.

### Agenda

Imagem em breve.

### Novo agendamento

Imagem em breve.

### Clientes

Imagem em breve.

### Serviços

Imagem em breve.

### Configuração de horários

Imagem em breve.

### Responsividade mobile

Imagem em breve.

---

## Aprendizados

Durante o desenvolvimento do AuraBook foram aplicados conceitos como:

- arquitetura frontend/backend;
- APIs REST;
- autenticação JWT;
- modelagem relacional;
- Prisma ORM;
- PostgreSQL;
- multi-tenancy;
- regras de negócio;
- validação de disponibilidade;
- prevenção de conflitos de agenda;
- deploy full stack;
- configuração de CORS;
- variáveis de ambiente;
- monorepo;
- responsividade;
- integração entre serviços em produção;
- troubleshooting de builds;
- gerenciamento de dependências;
- deploy com Vercel, Render e Neon.

---

## Status do projeto

**MVP funcional e publicado em produção.**

Fluxo validado de ponta a ponta:

    Next.js
       ↓
    NestJS
       ↓
    Prisma
       ↓
    PostgreSQL

Infraestrutura:

    Vercel
       ↓
    Render
       ↓
    Neon

O fluxo principal de cadastro, configuração e gerenciamento de agendamentos está funcionando em produção.

---

## Autor

**Guilherme Silva**

GitHub:

https://github.com/guilhermesilva8989-ai

---

Desenvolvido como projeto de portfólio Full Stack.
