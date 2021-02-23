const { getAST, getDependencies, transform } = require('./parser');
const path = require('path');
module.exports = class Compiler {
  constructor(options) {
    const { entry, output } = options;
    this.entry = entry;
    this.output = output;
    this.modules = [];
  }
  run() {
    const entryModule = this.buildModule(this.entry, true);
    this.modules.push(entryModule);
    this.modules.map((_module) => {
      _module.dependencies.map((dependence) => {
        this.modules.push(this.buildModule(dependence));
      });
    });
    console.log(this.modules);
  }
  buildModule(filename, isEntry) {
    let ast;
    if (isEntry) {
      ast = getAST(filename);
    } else {
      //如果是依赖文件 将相对路径转换为绝对路径
      const absolutePath = path.join(process.cwd(), '../src');
      ast = getAST(absolutePath);
    }

    return {
      filename,
      dependencies: getDependencies(ast),
      source: transform(ast),
    };
  }
  emitFiles() {}
};
