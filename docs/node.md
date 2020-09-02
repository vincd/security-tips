# Node


## BodyParser urlencoded

With the node module `express` you can parse the payload of a request with the
`body-parser` module:

```node
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
```

When the `extended: true` option is passed to the middleware then a user may
provide a urlencoded payload such as:

```
params[key]=value&foo=bar
```

Then on the node code, there is the following code:

```node
const params = req.body['params']
const foo = req.body['foo']
```

The `params` variable is not a string but a dictionary (`{"key": "value"}`).
An attacker can with this method to bypass some code logic. There is two
examples on the Google CTF 2020:

- [Google CTF - Log-Me-In](https://capturetheflag.withgoogle.com/challenges/web-log-me-in)
- [Google CTF - Pasteurize](https://capturetheflag.withgoogle.com/challenges/web-pasteurize)
