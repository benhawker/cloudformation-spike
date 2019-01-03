import Path from 'path';
import fs from 'fs';
import Ajv from 'ajv';
import yaml from 'js-yaml';

const ROOT = `${__dirname}/../../`;

global.readAndLoad = (relativePath) => {
  const path = Path.join(ROOT, relativePath);
  return yaml.safeLoad(fs.readFileSync(path, 'utf8'));
};

global.loadSchema = (relativePath) => {
  const ajv = new Ajv();
  const schema = global.readAndLoad(relativePath);
  return ajv.compile(schema);
};

global.loadVelocityTemplate = (relativePath, type) => {
  const templates = global.readAndLoad(relativePath);
  return templates[type];
};
