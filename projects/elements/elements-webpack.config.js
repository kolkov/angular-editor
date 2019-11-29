const uuidv1 = require('uuid/v1');

module.exports = {
  output: {
    jsonpFunction: 'angularElements-' + uuidv1(),
    library: 'elements',
  },
};
