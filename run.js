var express = require('express');
const nunjucks = require('nunjucks')
var app = express();
const path = require('path');
var dt = require('./toolkit_box');

const fetch = require("node-fetch");


app.use(express.static(__dirname + '/static'));
app.set('view engine', 'html');

// configuring nunjucks module (similar to jinja)
nunjucks.configure('templates', {
    autoescape: true,
    express: app
});


curr_dt = `The date and time are currently: ${dt.myDateTime()}`;


function tmp_dir(f){
    /** Relative path to template directory */

    return path.join(__dirname, 'templates/' + f);
};


// home page
app.get('/', async function(req, res){
    d_d = [];
    async function fetchRepositories() {
        await fetch(`https://api.github.com/users/usmanmusa1920/repos`, {method: "GET"})
        // .then(response => response.json()) //Converting the response to a JSON object
        .then((response) => {
            return response.json()
        })
        .then(data => {
            // const numRepos = data.public_repos;
            // console.log(numRepos);
            // console.log(data.public_repos);
            // console.log(data);
            
            
            for (let i = 0; i<=data.length; i++){
                d = data[i]
                try{
                    a = d.name;
                    d_d.push(a);
                    if (typeof document !== 'undefined') {
                        // let element = document.querySelector('.class-name')
                        const root = document.querySelector('.apdn');
                        root.innerHTML = a;
                        // Manipulating the DOM here
                    }
                    console.log(' ***', a);
                }
                catch{
                    // pass
                }
            }
            // console.log(data.name);
            })
            .catch(error => console.error(error));
    };
    fetchRepositories();
    context = {
        welcome: 'Welcome to Usman Musa GitHub repositories portfolio',
        d_d: d_d,
    };
    res.render(tmp_dir('index.html'), context);
});


// about page
app.get('/about', function(req, res){
    res.send("I am about page! " + curr_dt);
});


// 404 page
app.use(function(req, res, next) {
    res.status(404);

    // respond with html page
    if (req.accepts('html')) {
        res.render('404', { url: req.url });
        return;
    }

    // respond with json
    if (req.accepts('json')) {
        res.json({ error: 'Not found' });
        return;
    }
    context = {
        url: req.url,
    };

    // default to plain-text. send()
    res.type('txt').send('Not found');
});


app.listen(3000);
