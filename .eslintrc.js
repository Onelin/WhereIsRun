module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true
  },
  extends: ['airbnb-base', 'prettier', 'plugin:react/jsx-runtime'],
  parser: '@babel/eslint-parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: 'latest',
    sourceType: 'module',
    requireConfigFile: false
  },
  plugins: ['react', 'prettier'],
  rules: {
    'react/jsx-uses-react': 'off',
    'react/react-in-jsx-scope': 'off',
    // 'import/no-extraneous-dependencies': [
    //   'error',
    //   { devDependencies: true, optionalDependencies: false, peerDependencies: false }
    // ],
    'global-require': false
  },
  settings: {
    react: {
      version: 'detect' // React version. "detect" automatically picks the version you have installed.
    }
  }
}
