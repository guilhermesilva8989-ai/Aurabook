# AuraBook — Software Architecture

## 1. Visão geral

O AuraBook será desenvolvido utilizando uma arquitetura moderna Full Stack preparada para crescimento como plataforma SaaS.

A aplicação será dividida em:

- Front-end Web
- Back-end API
- Banco de dados
- Serviços externos


---

# 2. Arquitetura geral

```
                    Usuário

                       |
                       |

                Next.js Web

                       |
                       |

                 REST API

                       |
                       |

                NestJS Backend

                       |
              ----------------

              Prisma ORM

                       |

               PostgreSQL
```


---

# 3. Front-end

## Tecnologia

- Next.js
- React
- TypeScript
- Tailwind CSS


Responsável por:

- Landing page
- Cadastro
- Login
- Dashboard
- Agenda
- Página pública de agendamento
- Gestão de clientes


Estrutura:

```
apps/web

app/
components/
hooks/
services/
lib/
types/
```


---

# 4. Back-end

## Tecnologia

- NestJS
- TypeScript
- Prisma


Responsável por:

- Autenticação
- Regras de negócio
- Controle de agenda
- Agendamentos
- Clientes
- Profissionais
- Notificações


Estrutura:

```
apps/api

src/

├── auth
├── users
├── tenants
├── professionals
├── clients
├── services
├── appointments
├── notifications
└── database
```


---

# 5. Banco de dados

## Tecnologia

PostgreSQL


ORM:

Prisma


Responsável por:

- Modelagem dos dados
- Relacionamentos
- Migrações
- Segurança


Modelo:

```
Tenant

 |

 + Users

 + Professionals

 + Clients

 + Services

 + Appointments
```


---

# 6. Autenticação

Sistema baseado em:

- JWT
- Controle de permissões
- Multi-tenant


Fluxo:

```
Usuário

↓

Login

↓

API valida credenciais

↓

Gera Token JWT

↓

Acesso ao sistema
```


---

# 7. Multi-tenant

O sistema será preparado para múltiplos negócios.

Cada registro possuirá referência ao tenant.

Exemplo:

```
Tenant A

Maria Beauty


Tenant B

João Barber
```


Os dados nunca serão misturados.


---

# 8. Integrações externas


## WhatsApp

Uso:

- confirmação de agenda
- lembretes
- aviso de vaga
- aniversário


## Email

Uso:

- cadastro
- recuperação de senha
- notificações


## Storage

Uso:

- fotos
- logos
- imagens do negócio


---

# 9. Regras importantes


## Agenda

O sistema deve considerar:

- horário de trabalho
- duração do serviço
- conflitos
- bloqueios
- férias


---

## Agendamento

Fluxo:

```
Cliente solicita

↓

Status PENDING

↓

Profissional aceita

↓

Status ACCEPTED

↓

Cliente recebe confirmação
```


---

# 10. Escalabilidade futura


Preparado para:

- aplicativo mobile
- pagamentos online
- IA para agenda
- múltiplos profissionais
- relatórios
- planos SaaS


---

# 11. Ambiente de desenvolvimento


Ferramentas:

- Docker
- Git
- VS Code


Serviços:

```
Frontend

localhost:3000


Backend

localhost:3001


Database

PostgreSQL
```


---

# Objetivo

Construir uma plataforma profissional, escalável e preparada para atender milhares de negócios utilizando uma arquitetura moderna de software.