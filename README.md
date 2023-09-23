<h1>MyWallet Backend</h1>

<h3>Descrição</h3>
<hr></hr>

O MyWallet é uma aplicação de carteira que oferece cadastro e login de usuários. Os usuários podem adicionar suas movimentações financeiras de entrada e saída para acompanhar seus gastos e verificar o saldo total. Além disso, a aplicação permite a edição e exclusão de movimentações para manter os dados atualizados.

<h3>Recursos Principais</h3>
<hr></hr>

- Cadastro e login de usuários.
- Cadastro de movimentações com valor e descrição.
- Edição de movimentações.
- Exclusão de movimentações.
- Cálculo do saldo total.

Este backend foi desenvolvido para servir um frontend que já está disponível no repositório <a href="https://github.com/csjhonathan/mywallet-front">MyWallet Frontend</a>.

<h3>Tecnologias e Ferramentas</h3>
<hr></hr>

- NodeJs: Plataforma de desenvolvimento em JavaScript que permite a criação de aplicações do lado do servidor.
- Cors: Middleware utilizado para habilitar o compartilhamento de recursos entre diferentes origens em uma aplicação web.
- Dayjs: Biblioteca para manipulação de datas e horas em JavaScript.
- Express: Framework web minimalista para Node.js, utilizado para criar rotas e controlar requisições HTTP.
- Joi: Biblioteca para validação de dados em JavaScript.
- MongoDB: Banco de dados NoSQL que armazena os dados em formato de documento.

<h3>Configuração</h3>
<hr></hr>

**Para configurar o projeto, siga estas etapas**:

 - ***Clone o repositório***:

   - `git clone https://github.com/csjhonathan/mywallet-back.git`

- ***Navegue até o diretório do projeto***:

  - `cd mywallet-back`
  
- ***Instale as dependências***:
  - `npm install`
  - Leia o arquivo `.env.example`, crie um arquivo `.env` e configure as variáveis de ambiente necessárias.

- ***Inicie a aplicação***:

 - `npm start` ou `npm run dev` caso deseje contar com o hot-reload ao editar arquivos

Nota: Para executar este projeto, é necessário ter o <a href="https://nodejs.org/pt-br">NodeJs</a> e o <a href="https://www.mongodb.com/pt-br">MongoDB</a> instalados na máquina local.

<h3>Documentação</h3>
<hr></hr>

<a href="https://mywallet-api-uz3h.onrender.com/api-docs">Clique aqui</a> para ter acesso a documentação completa da aplicação.


