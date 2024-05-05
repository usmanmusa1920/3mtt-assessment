# 3mtt-assessment

Install npm

```sh
apt install npm
```

To see npm and nodejs version

```sh
node --version
npm --version
```

create the package.json file using npm

```sh
npm init
```

To install Express and add it to our package.json file

```sh
npm install --save express
```

This tool `nodemon` help to restarts our server as soon as we make a change in any of our files, otherwise we need to restart the server manually after each file modification. The `-g` mean install globally.

```sh
npm install -g nodemon
```

Install nunjucks, a full featured templating engine for javascript. It is heavily inspired by jinja2.

```sh
npm install -S nunjucks

npm install -S nunjucks chokidar
```

To run the app on terminal

```sh
nodemon run.js
```

Then hit to `127.0.0.1:3000`


```sh
# if fetch is not define
npm install node-fetch
# then put the line below at the top of the files where you are using the fetch API:
import fetch from "node-fetch";
```