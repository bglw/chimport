# chimport

A dumb no-good webpack loader that just cats files in place 🤷‍♂️

`npm i -D chimport`

#### webpack.config.js
```
...
{
  test: /\.js$/,
  loaders: ['chimport']
}
...
```

#### file.js
```
chimport './file.js';       # Replace this line with a file
chimport './lib/**/*.js';   # Replace this line with multiple files
```