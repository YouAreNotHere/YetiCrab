console.log('Loading ormconfig.cjs...');
const { DataSource } = require('typeorm');

console.log('Creating DataSource...');
const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST || 'db',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  username: process.env.DB_USERNAME || 'YouAreNotHere',
  password: process.env.DB_PASSWORD || '123456',
  database: process.env.DB_NAME || 'test_db',
  entities: [`${__dirname}/**/*.entity{.ts,.js}`],
  migrations: [`${__dirname}/migrations/*{.ts,.js}`],
  synchronize: false,
  logging: true,
});

console.log('Exporting DataSource...');
module.exports = AppDataSource;

// npx typeorm-ts-node-commonjs migration:run -d ormconfig.cjs