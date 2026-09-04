# AuraBook — Database Design

## 1. Arquitetura

O AuraBook utilizará uma arquitetura **multi-tenant**.

Cada negócio terá seu próprio ambiente isolado dentro da plataforma.

Exemplo:

```
AuraBook

Tenant 1
 └── Maria Beauty Studio
      ├── Profissionais
      ├── Clientes
      ├── Serviços
      └── Agendamentos


Tenant 2
 └── João Barber
      ├── Profissionais
      ├── Clientes
      ├── Serviços
      └── Agendamentos
```

Essa estrutura permite que futuramente o sistema seja vendido como SaaS para diversos segmentos.

---

# 2. Entidades principais

---

# Tenant

Representa a conta do negócio dentro do AuraBook.

Exemplo:

Maria Beauty Studio

Campos:

- id
- nome
- slug
- plano
- status
- criado_em
- atualizado_em


Possui:

- Users
- Business Profile
- Professionals
- Clients
- Services
- Appointments

---

# Business Profile

Informações públicas do negócio.

Usado na página pública de agendamento.

Exemplo:

Maria Beauty Studio

Campos:

- id
- tenant_id
- nome_publico
- descrição
- logo
- foto_capa
- telefone
- whatsapp
- instagram
- endereço
- cidade
- estado
- horário_exibição

Exemplo de página:

```
aurabook.com/maria-beauty

Maria Beauty Studio

Serviços:
- Corte
- Escova
- Coloração

Agende seu horário:
[Escolher horário]
```

---

# User

Usuários que acessam o sistema.

Tipos:

- OWNER
- PROFESSIONAL
- ADMIN


Campos:

- id
- tenant_id
- nome
- email
- senha
- telefone
- role
- ativo
- criado_em
- atualizado_em


Exemplo:

```
Maria

email:
maria@email.com

role:
OWNER
```

---

# Professional

Representa o profissional que realiza serviços.

Exemplo:

Maria — Cabeleireira

Campos:

- id
- tenant_id
- user_id
- nome
- especialidade
- descrição
- foto
- ativo
- criado_em


Possui:

- Services
- Availability
- Appointments

---

# Client

Cliente final do negócio.

Exemplo:

João

Campos:

- id
- tenant_id
- nome
- telefone
- email
- aniversário
- data_primeiro_atendimento
- observações
- criado_em
- atualizado_em


Informações utilizadas para:

- histórico;
- lembretes;
- aniversário;
- relacionamento.

---

# Service

Serviços oferecidos.

Exemplo:

Corte masculino

Campos:

- id
- tenant_id
- professional_id
- nome
- descrição
- duração_minutos
- preço
- ativo
- criado_em


Exemplos:

```
Corte masculino
30 minutos
R$50


Coloração
120 minutos
R$200
```

---

# Availability

Configuração dos horários de trabalho.

Define quando o profissional está disponível.

Campos:

- id
- professional_id
- dia_semana
- hora_inicio
- hora_fim
- ativo


Exemplo:

```
Terça-feira

09:00
até
18:00
```


Permite:

- trabalhar domingo;
- folgar segunda;
- horários personalizados;
- jornadas diferentes.

---

# Blocked Schedule

Bloqueios de agenda.

Exemplos:

- férias;
- folga;
- compromisso;
- feriado.


Campos:

- id
- professional_id
- data_inicio
- data_fim
- motivo

---

# Appointment

Agendamento realizado.

Campos:

- id
- tenant_id
- client_id
- professional_id
- service_id
- data
- horario_inicio
- horario_fim
- status
- observação_cliente
- motivo_cancelamento
- criado_em
- atualizado_em


Status:

```
PENDING

aguardando aprovação


ACCEPTED

confirmado


REJECTED

recusado pelo profissional


CANCELLED

cancelado


COMPLETED

finalizado
```


Fluxo:

```
Cliente solicita

↓

Profissional recebe

↓

Aceita ou recusa

↓

Cliente recebe confirmação
```

---

# Recurring Appointment

Agendamento recorrente.

Exemplo:

Cliente corta cabelo todo dia 10 às 15h.


Campos:

- id
- tenant_id
- client_id
- professional_id
- service_id
- frequência
- dia_preferencial
- horário
- próxima_execução
- ativo


Exemplos:

```
Todo mês

Dia 10

15:00
```

---

# Waiting List

Lista de espera.

Caso não existam horários disponíveis.


Campos:

- id
- tenant_id
- client_id
- service_id
- professional_id
- data_desejada
- prioridade
- status
- criado_em


Fluxo:

```
Horário fica livre

↓

Primeiro cliente recebe aviso

↓

Aguarda confirmação

↓

Sem resposta:

Próximo cliente
```

---

# Notification

Sistema de notificações.

Tipos:

- confirmação_agendamento
- lembrete
- aniversário
- aniversário_cliente_profissional
- vaga_disponível


Campos:

- id
- tenant_id
- user_id
- tipo
- mensagem
- enviado_em
- status


Canais:

- WhatsApp
- Email
- Sistema

---

# Customer History

Histórico de relacionamento.

Guarda informações importantes do cliente.


Campos:

- id
- tenant_id
- client_id
- appointment_id
- observação
- criado_em


Exemplo:

```
Cliente João

Primeiro corte:
10/09/2026

Último serviço:
Corte + barba

Frequência:
Mensal
```

---

# Subscription

Controle de planos SaaS.


Campos:

- id
- tenant_id
- plano
- status
- inicio
- fim


Planos futuros:

```
Free

Professional

Business
```

---

# Relacionamentos

## Tenant

Possui:

- Users
- Business Profile
- Professionals
- Clients
- Services
- Appointments
- Notifications


## Professional

Possui:

- Services
- Availability
- Blocked Schedule
- Appointments


## Client

Possui:

- Appointments
- Waiting List
- Customer History


## Appointment

Relaciona:

- Client
- Professional
- Service

---

# Resumo da arquitetura

```
Tenant
 |
 +-- Users
 |
 +-- Business Profile
 |
 +-- Professionals
 |       |
 |       +-- Availability
 |       |
 |       +-- Services
 |
 +-- Clients
 |
 +-- Appointments
 |
 +-- Waiting List
 |
 +-- Notifications
 |
 +-- Subscription
```

---

# Objetivo

Criar uma base de dados preparada para transformar o AuraBook em uma plataforma SaaS escalável, permitindo atender diferentes tipos de profissionais e negócios.