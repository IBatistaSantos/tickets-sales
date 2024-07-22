# 🎟️ TicketSales API

TicketSales API é uma API moderna e de alta performance para vendas de ingressos, construída utilizando Bun e Elysia. Este projeto adota a Clean Architecture para garantir uma estrutura escalável e de fácil manutenção. Utilizamos Prisma para ORM e Kafka para mensagens assíncronas.

## 📦 Tech Stack

- **Bun**: Um runtime JavaScript rápido e moderno.
- **Elysia**: Um framework web leve e altamente performante para a construção de aplicações web escaláveis.
- **Clean Architecture**: Para uma estruturação modular e de fácil manutenção.
- **Prisma**: Um ORM para Node.js e TypeScript.
- **Kafka**: Para mensagens assíncronas e comunicação entre microserviços.

## 🌟 Features

- **Alta Performance**: Construída com Bun e Elysia para garantir tempos de resposta rápidos e uma experiência de usuário fluida.
- **Segurança**: Integração com gateways de pagamento seguros para garantir transações seguras.
- **Gestão de Eventos**: Endpoints para organizadores de eventos gerenciarem e monitorarem seus eventos.
- **Atualizações em Tempo Real**: Notificações e atualizações em tempo real sobre alterações em eventos e disponibilidade de ingressos.
- **Arquitetura Limpa**: Design modular e escalável para facilitar a manutenção e expansão do projeto.
- **Mensagens Assíncronas**: Uso de Kafka para comunicação eficiente entre microserviços.

## 🚀 Getting Started

### Pré-requisitos

- [Bun](https://bun.sh/)
- Node.js (para ferramentas de desenvolvimento)
- [Elysia](https://elysia.dev/)
- [Prisma](https://www.prisma.io/)
- [Kafka](https://kafka.apache.org/)

### Instalação

1. Clone o repositório:

   ```bash
   git clone https://github.com/seuusuario/ticketsales-api.git
   cd ticketsales-api
   ```
2. Instale as dependências:


  ```bash
  bun install
  ```

3. Configure o Prisma:

      Crie um arquivo .env na raiz do projeto e adicione a URL do seu banco de dados:

      ```bash
       DATABASE_URL="seu_database_url"
      ```

4. Execute a migração do Prisma:

  ```bash
    npx prisma migrate dev --name init
  ```

5. Inicie o servidor de desenvolvimento:

  ```bash
    bun run dev
  ```

6. A API estará disponível em http://localhost:3000.





