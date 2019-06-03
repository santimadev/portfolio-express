require('dotenv').config()
const express = require('express');
const path = require('path');
const i18n = require('i18n-express');
const bodyParser = require('body-parser');
const compression = require('compression');

const navigation = require('./routes/navigation');
let app = express();

app.use(compression());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use('/assets', express.static(path.join(__dirname, 'assets'), {
  maxAge: '1m'
}));
app.use('/content', express.static(path.join(__dirname, '../content')));

app.use(i18n({
  translationsPath: path.join(__dirname, 'assets/i18n'),
  siteLangs: ["en", "es"],
  textsVarName: 't'
}))

app.use(navigation);

app.get('*', (req, res) => {
  res.render('pages/404');
})

app.listen(process.env.PORT, function () {
  console.log(`Example app listening on port ${process.env.PORT}`);
});