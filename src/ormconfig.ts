import { DataSource, DataSourceOptions } from "typeorm";
const dbConfig: DataSourceOptions = {
  type: 'sqlite',
  database: 'db.sqlite',
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  synchronize: false, // Set to true only for development
};

export const AppDataSource = new DataSource(dbConfig);