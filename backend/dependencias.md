## Instalações básicas de um projeto do zero

yarn init -y

yarn add express

yarn add dotenv

yarn add cors

yarn add sucrase nodemon -D

yarn add eslint

yarn eslint --init

yarn // Rodar esse comando removendo o package-lock.json criado após instalação do eslint com npm

yarn add prettier eslint-config-prettier eslint-plugin-prettier -D

**Adicionar no package.json**

```json
"scripts": {
    "dev": "nodemon --inspect src/server.js"
  }
```

**Arquivo nodemon.json**

```json
{
  "execMap": {
    "js": "node -r sucrase/register"
  }
}
```

**Arquivo .eslintrc**

```json
{
  "env": {
    "es6": true,
    "node": true
  },
  "extends": ["airbnb-base", "prettier"],
  "plugins": ["prettier"],
  "globals": {
    "Atomics": "readonly",
    "SharedArrayBuffer": "readonly"
  },
  "parserOptions": {
    "ecmaVersion": 2018,
    "sourceType": "module"
  },
  "rules": {
    "prettier/prettier": "error",
    "class-methods-use-this": "off",
    "no-param-reassign": "off",
    "camelCase": "off",
    "no-unused-vars": ["error", { "argsIgnorePattern": "next" }],
    "no-console": "off"
  }
}
```

**Arquivo .prettierrc**

```json
{
  "singleQuote": true,
  "trailingComma": "es5"
}
```

### Postgres

yarn add sequelize sequelize-cli

yarn add pg pg-hstore

**Arquivo .sequelizerc**

```javascript
const { resolve } = require('path');

module.exports = {
  config: resolve(__dirname, 'src', 'config', 'database.js'),
  'models-path': resolve(__dirname, 'src', 'app', 'models'),
  'migrations-path': resolve(__dirname, 'src', 'database', 'migrations'),
  'seeders-path': resolve(__dirname, 'src', 'database', 'seeds'),
};
```

### JWT (protocolo de autenticação)

yarn add jsonwebtoken

### Yup (validação de entrada)

yarn add yup

### Comando para dar fix em todos os arquivos .js dentro da pasta src

yarn eslint --fix src --ext .js

### Comandos para migration, seeds

```properties
yarn sequelize migration:create --name=create-users
yarn sequelize seed:generate --name admin-user

yarn sequelize db:migrate
yarn sequelize db:migrate:undo
yarn sequelize db:migrate:undo:all

yarn sequelize db:seed:all
```

## Multi form data (upload de arquivos)

yarn add multer

**Arquivo de configuração multer.js**

```js
import crypto from 'crypto';
import multer from 'multer';
import { extname, resolve } from 'path';

export default {
  storage: multer.diskStorage({
    destination: resolve(__dirname, '..', '..', 'tmp', 'uploads'),
    filename: (req, file, callback) => {
      crypto.randomBytes(16, (err, res) => {
        if (err) return callback(err);

        // O primeiro parâmetro é o erro. Como nesse caso não é de erro, coloca-se null
        return callback(null, res.toString('hex') + extname(file.originalname));
      });
    },
  }),
};
```

## Envio de email

yarn add nodemailer

Provedores: Amazon SES, Mailgun, Sparkpost

Usaremos Mailtrap (só funciona para ambiente de desenvolvimento)

Para estilizar o email, instalamos (template engine -> arquivos html que podem receber variáveis do Node).
Usaremos o https://handlebarsjs.com/

yarn add express-handlebars nodemailer-express-handlebars

**Arquivo mail.js dentro de config**

```js
export default {
  host: 'smtp.mailtrap.io',
  port: 2525,
  secure: false,
  auth: {
    user: '61b37c31ffe56f',
    pass: 'b00f313f6c507c',
  },
  default: {
    from: 'Equipe GoBarber <noreply@gobarber.com>',
  },
};
```

**Arquivo Mail.js dentro da pasta lib (utils)**

```js
import exphbs from 'express-handlebars';
import nodemailer from 'nodemailer';
import nodemailerhbs from 'nodemailer-express-handlebars';
import { resolve } from 'path';
import mailConfig from '../config/mail';

class Mail {
  constructor() {
    const { host, port, secure, auth } = mailConfig;
    this.transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: auth.user ? auth : null,
    });

    this.configureTemplate();
  }

  sendMail(message) {
    return this.transporter.sendMail({
      ...mailConfig.default,
      ...message,
    });
  }

  configureTemplate() {
    const viewPath = resolve(__dirname, '..', 'app', 'views', 'emails');

    this.transporter.use(
      'compile',
      nodemailerhbs({
        viewEngine: exphbs.create({
          layoutsDir: resolve(viewPath, 'layouts'),
          partialsDir: resolve(viewPath, 'partials'),
          defaultLayout: 'default',
          extname: '.hbs',
        }),
        viewPath,
        extName: '.hbs',
      })
    );
  }
}

export default new Mail();
```

## Gerenciar a fila no Redis (BeeQueue)

Existe o kue também que é mais robusto (define prioridade dos jobs, retentativa após x minutes).
O BeeQueue não possui essas features só que é mais perfomático.

yarn add bee-queue

**Arquivo Queue.js dentro da pasta lib**

```js
import Bee from 'bee-queue';
import OrderWithdrawMail from '../app/jobs/OrderWithdrawMail';
import redisConfig from '../config/redis';

const jobs = [OrderWithdrawMail];

class Queue {
  constructor() {
    this.queues = {};

    this.init();
  }

  init() {
    jobs.forEach(({ key, handle }) => {
      this.queues[key] = {
        bee: new Bee(key, {
          redis: redisConfig,
        }),
        handle,
      };
    });
  }

  add(queue, job) {
    return this.queues[queue].bee.createJob(job).save();
  }

  processQueue() {
    jobs.forEach(job => {
      const { bee, handle } = this.queues[job.key];
      console.log('entrei no processQueue');
      //.on é para ouvir um evento no caso de falha
      bee.on('failed', this.handleFailure).process(handle);
    });
  }

  handleFailure(job, err) {
    console.log(`Queue ${job.queue.name}: FAILED`, err);
  }
}

export default new Queue();
```

**Arquivo queue.js dentro da pasta src**

```js
import Queue from './lib/Queue';

Queue.processQueue();
```

## Tratamento de exceções na aplicação via site

yarn add @sentry/node@5.11.2

## Tratamento de exceções no controller com express

Necessário instalar uma extensão para tratar os erros ocasionados nos controllers quando os endpoints são assíncronos

yarn add express-async-errors

## Tratativa de mensagens de erro

yarn add youch
