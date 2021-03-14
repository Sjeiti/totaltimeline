module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module'
  },
  // required to lint *.vue files
  plugins: [
    'html'
  ],
  // add your custom rules here
  'rules': {
    // allow debugger during development
    'no-new': 0,
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
    'one-var': ['error', 'never'],
    'semi': ['error', 'never'],
    'indent': ['error', 2],
    'no-var': 'error',
    'prefer-const': 'error',
    'prefer-arrow-callback': 'error',
    'no-unused-expressions': ['error', { 'allowShortCircuit': true }],
    'no-unused-vars': 'error'/*,
    'no-default-export': 'error'*/
  }
}
