# PEQ INVEST — Pequenos Investidores

Aplicativo de **educação financeira para jovens e crianças**, com gamificação:
o usuário aprende com **dicas**, **joga** mini-jogos para ganhar **moedas** e usa as
moedas para comprar **avatares** numa **loja** e equipá-los no **perfil**.

> Este README foi escrito para servir de **roteiro de apresentação para a banca**:
> explica as tecnologias, a arquitetura e a lógica de **cada arquivo de código**,
> além dos conceitos de React (como `useEffect`, `useState`, etc.) usados no projeto.

---

## 1. Visão geral

O projeto é dividido em duas aplicações independentes que conversam por uma **API REST**:

```
┌─────────────────────────┐        HTTP (JSON)        ┌──────────────────────────┐        SQL        ┌─────────────┐
│        FRONTEND          │  ───────────────────────► │         BACKEND          │ ────────────────► │   MySQL     │
│ React Native + Expo Web  │  ◄─────────────────────── │  Node.js + Express (API) │ ◄──────────────── │  (banco)    │
│  (telas, jogos, loja)    │                           │   (regras + validação)   │                   │  profiles   │
└─────────────────────────┘                           └──────────────────────────┘                   └─────────────┘
        │
        │ estado da gamificação (moedas, avatares, dicas)
        ▼
   localStorage do navegador (persistência local)
```

- **Cadastro/edição/exclusão de perfil** → passa pelo backend e é gravado no **MySQL** (CRUD real).
- **Gamificação (moedas, avatares, dicas diárias)** → fica salva **no próprio dispositivo** (localStorage),
  porque é um estado de progresso do usuário que não precisa de servidor.

---

## 2. Tecnologias usadas

### Backend (pasta `backend/`)
| Tecnologia | Para que serve |
|---|---|
| **Node.js** | Ambiente que executa o JavaScript no servidor. |
| **Express 5** | Framework web que cria a API REST (rotas, middlewares, respostas). |
| **MySQL** | Banco de dados relacional onde os perfis ficam salvos. |
| **mysql2** | Driver que conecta o Node ao MySQL (com suporte a `async/await` e *connection pool*). |
| **cors** | Middleware que libera o frontend (outra porta) a chamar a API. |
| **nodemon** | Reinicia o servidor automaticamente ao salvar (só em desenvolvimento). |
| **crypto** (nativo do Node) | Gera o *hash* da senha com SHA-256. |

Padrão de arquitetura do backend: **MVC** — *Model* (acesso ao banco), *Controller*
(regras/validação) e *Routes* (endereços da API).

### Frontend (pasta `frontend/`)
| Tecnologia | Para que serve |
|---|---|
| **React** | Biblioteca de interface baseada em **componentes** e **estado**. |
| **React Native** | Permite escrever a interface com componentes (`View`, `Text`, `Pressable`...). |
| **Expo** | Plataforma que facilita rodar o React Native (inclusive no navegador). |
| **react-native-web** | Faz o mesmo código React Native rodar como site (é assim que abrimos no navegador). |
| **Context API + Hooks** | Gerenciam o estado global da gamificação (sem biblioteca externa). |

> **Por que React Native + Expo Web?** O mesmo código pode virar app Android, iOS **e** site.
> Na apresentação rodamos a versão **web** (`http://localhost:8082`).

---

## 3. Como executar o projeto

### Pré-requisitos
- Node.js instalado
- MySQL instalado e em execução

### Backend
```bash
cd backend
npm install
# 1) copie .env.example para .env e preencha a senha do MySQL
# 2) crie o banco/tabela executando o schema (veja abaixo)
npm run dev                 # sobe a API em http://localhost:3001
```
> **Criar o banco:** execute o conteúdo de `backend/src/database/schema.sql` no seu MySQL
> (pelo MySQL Workbench, linha de comando `mysql -u root -p < src/database/schema.sql`,
> ou qualquer cliente). Isso cria o banco `pequenos_investidores` e a tabela `profiles`.

### Frontend
```bash
cd frontend
npm install
npm run web               # abre em http://localhost:8082
```

---

## 4. Estrutura de pastas

```
PI--pequenos-investidores-main/
├── README.md                       ← este arquivo
├── backend/                        ← API REST (Node + Express + MySQL)
│   ├── .env                        ← variáveis de ambiente (porta, banco, CORS) — NÃO versionar
│   ├── .env.example                ← modelo do .env
│   ├── package.json                ← dependências e scripts do backend
│   └── src/
│       ├── server.js               ← ponto de entrada da API
│       ├── config/loadEnv.js       ← leitor do arquivo .env
│       ├── db.js                   ← conexão (pool) com o MySQL
│       ├── routes/profileRoutes.js ← endereços (URLs) da API de perfis
│       ├── controllers/profileController.js ← regras e validação dos perfis
│       ├── models/profileModel.js  ← comandos SQL (CRUD) dos perfis
│       └── database/
│           ├── schema.sql          ← criação do banco e da tabela profiles
│           └── add_profile_user_fields.sql ← script de atualização da tabela
│
└── frontend/                       ← Interface (React Native + Expo)
    ├── App.jsx                     ← componente raiz: navegação + integração com a API
    ├── app.json / babel.config.js  ← configurações do Expo/Babel
    └── src/
        ├── theme.js                ← paleta de cores (identidade visual)
        ├── navigation/routes.js    ← itens do menu inferior
        ├── components/
        │   ├── PhoneLayout.jsx      ← moldura "celular" (cabeçalho + menu inferior)
        │   ├── Ui.jsx              ← componentes reutilizáveis (botão, campo, painel, moedas, avatar)
        │   └── FeatureCard.jsx     ← card simples de título + descrição
        ├── screens/                ← telas do app
        │   ├── LoginScreen.jsx
        │   ├── RegisterScreen.jsx
        │   ├── HomeScreen.jsx
        │   ├── GamesScreen.jsx
        │   ├── ShopScreen.jsx
        │   ├── TipsScreen.jsx
        │   ├── ProfileScreen.jsx
        │   └── EditProfileScreen.jsx
        ├── games/                  ← jogos
        │   ├── QuizGame.jsx
        │   ├── MemoryGame.jsx
        │   └── AgoraOuDepoisGame.jsx
        ├── state/                  ← estado global da gamificação
        │   ├── GameContext.jsx     ← "memória" do app (moedas, avatares, dicas)
        │   ├── storage.js          ← salvar/ler do localStorage
        │   ├── avatars.js          ← catálogo de avatares
        │   └── tips.js             ← dicas + lógica de liberação 24h
        └── api/
            ├── profileApi.js       ← chamadas à API de perfis (fetch)
            └── investmentApi.js    ← dados simulados (carteira e plano de estudo)
```

---

## 5. Lógica de cada arquivo (back-end)

### `src/server.js` — ponto de entrada da API
Monta o servidor Express e define a ordem dos **middlewares**:
1. `cors(...)` libera o frontend a chamar a API;
2. `express.json()` lê o corpo das requisições em JSON;
3. rota `GET /health` (teste de "a API está viva");
4. `app.use('/api/profiles', profileRoutes)` conecta as rotas de perfil;
5. um middleware **404** para rotas inexistentes;
6. um middleware de **erro** (4 parâmetros: `err, req, res, next`) que captura qualquer exceção;
7. `app.listen(porta)` coloca o servidor para escutar.

### `src/config/loadEnv.js` — leitor do `.env`
Lê o arquivo `.env`, ignora linhas vazias/comentários, separa `CHAVE=valor`
e coloca em `process.env`. **Feito à mão** (sem a biblioteca `dotenv`) para
demonstrar o conceito de variáveis de ambiente.

### `src/db.js` — conexão com o MySQL
Cria um **pool de conexões** (`mysql.createPool`) — várias conexões reutilizáveis,
melhor que abrir/fechar a cada consulta. Exporta a função `query(sql, params)` que
executa comandos SQL com **parâmetros** (`?`), o que **previne SQL Injection**.

### `src/routes/profileRoutes.js` — as URLs da API
Liga cada método HTTP a uma função do controller (padrão REST):
| Método + URL | Função | O que faz |
|---|---|---|
| `GET /api/profiles` | `listarPerfis` | lista todos |
| `GET /api/profiles/:id` | `obterPerfil` | busca um |
| `POST /api/profiles` | `salvarPerfil` | cria |
| `PUT /api/profiles/:id` | `substituirPerfil` | atualiza |
| `DELETE /api/profiles/:id` | `removerPerfil` | exclui |

### `src/controllers/profileController.js` — regras e validação
É o "cérebro" da API de perfis. Principais funções:
- **`validarPerfil(dados)`** — verifica nome (mín. 3 letras), e-mail (regex),
  tipo de investidor e perfil de risco (valores permitidos), renda (≥ 0); devolve a lista de erros.
- **`gerarHashSenha(senha)`** — transforma a senha em **hash SHA-256** (não guardamos a senha pura).
- **`montarDadosPerfil(corpo)`** — limpa/normaliza os campos recebidos (`trim`, e-mail minúsculo, números).
- **`listarPerfis / obterPerfil / salvarPerfil / substituirPerfil / removerPerfil`** — tratam a
  requisição, chamam o *model* e respondem com o **status HTTP** certo
  (`201` criado, `204` excluído, `400` validação, `404` não encontrado, `409` e-mail/CPF duplicado).

### `src/models/profileModel.js` — comandos SQL (CRUD)
Camada que fala diretamente com o banco. Funções: `buscarTodosPerfis`, `buscarPerfilPorId`,
`criarPerfil`, `atualizarPerfil`, `excluirPerfil`. Os comandos usam **apelidos** (`full_name AS nomeCompleto`)
para o backend entregar os campos já com nomes em português, sem mudar as colunas reais do banco.

### `src/database/schema.sql` — o banco
Cria o banco `pequenos_investidores` e a tabela **`profiles`** (id, nome, e-mail, senha (hash),
cpf, telefone, endereço, data de nascimento, tipo de investidor, renda, perfil de risco,
objetivo, datas). Tem **chaves únicas** em e-mail e CPF (não deixa duplicar).

---

## 6. Lógica de cada arquivo (front-end)

### `App.jsx` — componente raiz
- Guarda o **estado da navegação** (`activeRoute`) e troca de tela conforme o valor — uma
  navegação simples feita com `useState` (sem biblioteca de rotas).
- Guarda o **perfil atual** e a **mensagem de status**.
- **`useEffect`** roda **uma vez** ao abrir o app e busca o perfil no banco (via API).
- Funções `handleCreateProfile / handleUpdateProfile / handleDeleteProfile` integram as
  telas com a API (`criarPerfil`, `atualizarPerfil`, `excluirPerfil`).
- **`toApiProfile / fromApiProfile`** convertem entre o formato da tela e o formato da API.
- Envolve tudo no **`<GameProvider>`**, dando a todas as telas acesso ao estado da gamificação.

### `src/theme.js`
Centraliza as **cores** (verde do PEQ INVEST). Todas as telas importam daqui → identidade visual consistente.

### `src/navigation/routes.js`
Lista dos botões do **menu inferior**: INÍCIO, JOGOS, LOJA, DICAS, PERFIL.

### `src/components/PhoneLayout.jsx`
Moldura de "celular" reutilizada em todas as telas: cabeçalho "PEQ INVEST", área de
conteúdo rolável (`ScrollView`) e o **menu inferior** que destaca a aba atual.

### `src/components/Ui.jsx` — componentes reutilizáveis
`PrimaryButton`, `Field` (campo de formulário), `Panel`, `StatusMessage` (faixa de aviso),
`MoedasPill` (mostra o saldo 🪙) e `AvatarCircle` (círculo colorido com o emoji do avatar).
Reaproveitar esses componentes evita repetir código e mantém o visual padronizado.

### `src/screens/` — as telas
- **LoginScreen / RegisterScreen** — entrada e cadastro (o cadastro chama a API e grava no banco).
- **HomeScreen** — tela inicial: avatar + saldo, **estatísticas** (moedas/avatares/dicas),
  **dica do dia**, **atalhos** (jogar, loja, dicas, perfil), "Você sabia?", "Como ganhar moedas" e desafio diário.
- **GamesScreen** — "hub" que lista os jogos e abre o Quiz, a Memória ou o Agora ou Depois?.
- **ShopScreen** — loja: compra/equipa avatares pagando com moedas.
- **TipsScreen** — dicas em formato **gaveta (accordion)** com contagem regressiva da próxima.
- **ProfileScreen** — avatar equipado, saldo e a galeria "meus avatares" (toque para trocar).
- **EditProfileScreen** — formulário de edição que envia os dados para o backend.

### `src/games/QuizGame.jsx`
Quiz de 5 perguntas. Usa `useState` para o índice da pergunta, acertos e moedas.
A cada **acerto** chama `onGanharMoedas(10)`. Mostra feedback (certo/errado) e um resumo final.

### `src/games/MemoryGame.jsx`
Jogo da memória (6 pares). Embaralha as cartas, vira duas por vez e compara.
Ao **completar o tabuleiro**, paga **+25 moedas** (uma única vez). Conceitos usados:
`useState` (cartas/seleção), `useRef` (guarda o *timer* que desvira as cartas) e
`useEffect` (paga a recompensa quando vence e limpa o *timer* ao sair).

### `src/games/AgoraOuDepoisGame.jsx`
Jogo sobre **poupar x gastar por impulso**. O jogador começa com **R$ 50 fictícios** e tem
5 semanas para juntar **R$ 90** e comprar um skate. Toda semana aparece uma tentação
(a 1ª é um brinquedo simples de R$ 30) e ele escolhe **COMPRAR AGORA** (satisfação sobe na hora,
saldo cai) ou **GUARDAR PARA DEPOIS** (satisfação média, saldo preservado). No fim de cada semana
chega **R$ 10 de mesada** e a alegria da compra vai caindo. Guardando tudo ele termina com R$ 100;
o brinquedo de R$ 30 ou dois gastos pequenos já impedem o objetivo (ensina que gastos somam).
A tela final mostra o resultado, um **gráfico do cofrinho semana a semana** e a lição.
- O dinheiro do jogo (R$) é só um `useState` dentro do componente: **não mexe nas moedas 🪙 do app**.
- Ao terminar, chama `onGanharMoedas(...)`: **+20 moedas** por concluir e **+10** se alcançar o objetivo.
  Um `useRef` garante que a recompensa é paga **uma única vez por partida**.
- Conceitos: `useState` (fase, semana, saldo, satisfação, escolhas), `useRef` (trava da recompensa),
  **renderização condicional** (tela inicial → semanas → resultado) e **componentes pequenos**
  (`Cofrinho`, `Satisfacao`, `LinhaDoTempo`, `GraficoEvolucao`) no mesmo arquivo.

### `src/state/GameContext.jsx` — o "cérebro" da gamificação
Cria um **Context** (memória global) com: `moedas`, `avataresComprados`, `avatarSelecionado`,
`inicioDicas` e as ações `ganharMoedas`, `comprarAvatar`, `selecionarAvatar`.
Qualquer tela acessa isso com o **hook `useGame()`**, sem precisar passar dados de tela em tela.
Vários `useEffect` **salvam automaticamente** cada mudança no localStorage.

### `src/state/storage.js`
Funções `lerDados` e `salvarDados`: usam o **localStorage** do navegador (e caem para a
memória se ele não existir). É o que faz o progresso **persistir** ao recarregar a página.

### `src/state/avatars.js`
Catálogo de 8 avatares (emoji, nome, preço, cor). Usar **emoji** em vez de imagem evita
depender de arquivos e bugs visuais de carregamento.

### `src/state/tips.js`
As 14 dicas e a **matemática da liberação 24h**:
- `calcularDicasLiberadas(inicio, agora)` → quantas já liberaram (1 no começo, +1 a cada 24h).
- `msParaProximaDica(...)` → quanto falta para a próxima.
- `formatarTempo(ms)` → transforma milissegundos em `23h 59m 12s`.

### `src/api/profileApi.js`
Funções `listarPerfis`, `criarPerfil`, `atualizarPerfil`, `excluirPerfil`. Cada uma usa
**`fetch`** para chamar a API, trata o status da resposta e devolve os dados (ou lança erro).

### `src/api/investmentApi.js`
Dados **simulados** (etapas de aprendizado e resumo de carteira) com `setTimeout` para imitar
o tempo de uma requisição real. Útil para telas de demonstração sem depender do banco.

---

## 7. Conceitos de React usados (para explicar à banca)

| Conceito | O que é (em 1 frase) | Onde aparece no projeto |
|---|---|---|
| **Componente** | Uma função que devolve a interface (JSX). | Todas as telas e componentes. |
| **Props** | Valores que um componente recebe de quem o usa. | Ex.: `<MoedasPill moedas={moedas} />`. |
| **`useState`** | Cria uma "variável de estado": quando muda, a tela **re-renderiza**. | Saldo, cartas do jogo, campos de formulário. |
| **`useEffect`** | Executa um efeito (buscar dados, timer) **depois** de renderizar. | Carregar perfil no `App.jsx`; contagem das dicas; recompensa da memória. |
| **Vetor de dependências** | O `[]` do `useEffect` controla **quando** ele roda. | `[]` = só uma vez (ao montar); `[moedas]` = quando `moedas` muda. |
| **Função de limpeza** | O `return` do `useEffect` desfaz timers ao sair da tela. | `clearInterval` (dicas) e `clearTimeout` (memória). |
| **`useRef`** | Guarda um valor entre renders **sem** re-renderizar. | `timeoutRef` no jogo da memória. |
| **Context API / `useContext`** | "Memória global" acessível por várias telas. | `GameContext` + hook `useGame()`. |
| **`async/await` + `fetch`** | Chamar a API e esperar a resposta sem travar a tela. | `profileApi.js`. |

### Exemplo comentado: `useEffect` que carrega o perfil (em `App.jsx`)
```jsx
useEffect(() => {
  listarPerfis()                       // 1) chama a API
    .then((profiles) => {              // 2) deu certo: usa o primeiro perfil
      if (profiles.length > 0) {
        setProfile(fromApiProfile(profiles[0]));
      }
    })
    .catch(() => {                     // 3) deu erro: avisa que o backend caiu
      setMessage('Backend nao conectado...');
    });
}, []);                                // 4) o [] faz isso rodar SÓ ao abrir o app
```

### Exemplo comentado: `useEffect` com **timer** e limpeza (em `TipsScreen.jsx`)
```jsx
useEffect(() => {
  const intervalo = setInterval(() => setAgora(Date.now()), 1000); // atualiza a cada 1s
  return () => clearInterval(intervalo);   // limpa o timer ao sair (evita vazamento)
}, []);
```

---

## 8. Fluxos importantes (passo a passo)

### Cadastro de usuário (CRUD real no banco)
1. `RegisterScreen` coleta os dados e chama `onCreateProfile`.
2. `App.jsx` converte com `toApiProfile` e chama `criarPerfil` (`profileApi.js`).
3. `profileApi.js` faz `POST /api/profiles` (fetch).
4. Backend: `routes → controller (valida + gera hash) → model (INSERT) → MySQL`.
5. A resposta volta e a tela mostra "Usuário criado com sucesso".

### Ganhar e gastar moedas
1. No jogo, ao acertar/vencer, chama `ganharMoedas(...)` do `GameContext`.
2. O saldo sobe e é salvo no localStorage.
3. Na **loja**, `comprarAvatar(id)` desconta as moedas, marca o avatar como comprado e equipa.
4. O avatar equipado aparece no **perfil** e na **home**.

### Dicas liberadas de 24 em 24h
1. No 1º acesso, o app grava o **horário inicial** (`inicioDicas`).
2. A cada render, `calcularDicasLiberadas` calcula quantas já liberaram com base no tempo.
3. A `TipsScreen` mostra as liberadas (gaveta) e as bloqueadas (🔒) com uma **contagem regressiva**.

---

## 9. Banco de dados (resumo)

Tabela **`profiles`** (banco `pequenos_investidores`):

| Coluna | Tipo | Observação |
|---|---|---|
| `id` | INT (PK, auto) | identificador |
| `full_name` | VARCHAR | nome completo |
| `email` | VARCHAR (único) | login |
| `password_hash` | VARCHAR | senha em SHA-256 |
| `cpf` | VARCHAR (único) | documento |
| `phone`, `address`, `birth_date` | — | dados de contato |
| `investor_type` | ENUM | iniciante/intermediário/avançado |
| `monthly_income` | DECIMAL | renda |
| `risk_profile` | ENUM | conservador/moderado/arrojado |
| `investment_goal` | VARCHAR | objetivo |
| `created_at`, `updated_at` | TIMESTAMP | datas automáticas |

---

## 10. Roteiro de apresentação para a banca

**Sugestão de ordem de fala (5–8 min):**
1. **Problema e proposta** — falta de educação financeira; app que ensina de forma lúdica para jovens.
2. **Tecnologias** — React Native/Expo (frontend), Node/Express (backend), MySQL (banco).
3. **Arquitetura** — mostrar o diagrama da seção 1 (frontend ↔ API REST ↔ banco).
4. **Demonstração ao vivo** — cadastrar usuário (mostra o CRUD no banco), jogar (ganhar moedas),
   comprar avatar na loja, ver as dicas (gaveta + 24h).
5. **Decisões técnicas** — por que MVC no backend, por que Context API no frontend,
   por que persistir a gamificação no localStorage, por que hash de senha.

**Perguntas prováveis da banca e respostas curtas:**
- *Onde os dados ficam salvos?* → Perfil no **MySQL** (via API); progresso do jogo no **localStorage**.
- *Como protege a senha?* → Guardamos apenas o **hash SHA-256** (`gerarHashSenha`), nunca a senha pura.
- *Como evita SQL Injection?* → Consultas **parametrizadas** com `?` (`db.js`/model).
- *O que é `useEffect`?* → Executa um efeito após a renderização; usamos para carregar dados e timers,
  com `[]` para rodar uma vez e `return` para limpar timers.
- *O que é Context API?* → Uma "memória global"; o `GameContext` evita passar moedas/avatares de tela em tela.
- *Por que React Native?* → Um código só vira **web, Android e iOS**.
- *Como funcionam as dicas de 24h?* → Guardamos o horário inicial e calculamos por tempo
  quantas dicas liberar (1 + uma a cada 24h).

---

*Projeto acadêmico — Projeto Integrador (PI).*
