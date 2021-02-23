const fs = require('fs');
const travers = require('babel-traverse').default;
const babylon = require('babylon');
const { transformFromAst } = require('babel-core');

module.exports = {
  //将path转换成AST
  getAST: (path) => {
    const source = fs.readFileSync(path, 'utf-8');

    return babylon.parse(source, {
      sourceType: 'module',
    });
  },

  getDependencies: (ast) => {
    const dependencies = [];
    travers(ast, {
      ImportDeclaration: ({ node }) => {
        dependencies.push(node.source.value);
      },
    });
    return dependencies;
  },
  transform: (ast) => {
    const { code } = transformFromAst(ast, null, {
      presets: ['env'],
    });

    return code;
  },
};
