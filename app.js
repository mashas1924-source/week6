export default function (express, bodyParser, createReadStream, crypto, http) {
  const app = express();

  app.use((req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,OPTIONS,DELETE');
    next();
  });

  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());

  app.get('/login/', (req, res) => {
    res.type('text/plain').send('masha_s');
  });

  app.get('/code/', (req, res) => {
    res.type('text/plain');
    createReadStream(import.meta.url.substring(7)).pipe(res);
  });

  app.get('/sha1/:input/', (req, res) => {
    res.type('text/plain').send(crypto.createHash('sha1').update(req.params.input).digest('hex'));
  });

  app.all('/req/', (req, res) => {
    const addr = (req.query && req.query.addr) || (req.body && req.body.addr);
    http.get(addr, (r) => {
      let data = '';
      r.setEncoding('utf8');
      r.on('data', (chunk) => { data += chunk; });
      r.on('end', () => res.type('text/plain').send(data));
    }).on('error', (e) => res.status(500).type('text/plain').send(e.message));
  });

  app.all('*', (req, res) => {
    res.type('text/plain').send('masha_s');
  });

  return app;
}
