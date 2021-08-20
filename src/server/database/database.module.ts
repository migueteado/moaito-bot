import { Global, Module } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Client } from 'pg';
import config from '../config';

@Global()
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [config.KEY],
      useFactory: (configService: ConfigType<typeof config>) => {
        const { user: username, name: database, host, port, pass: password } = configService.postgres;
        return {
          type: 'postgres',
          host,
          port,
          username,
          password,
          database,
          synchronize: false,
          autoLoadEntities: true,
        };
      },
    }),
  ],
  providers: [
    {
      provide: 'Postgres',
      useFactory: (configService: ConfigType<typeof config>) => {
        const { user, name: database, host, port, pass: password } = configService.postgres;
        const client = new Client({
          user, 
          host, 
          database, 
          password, 
          port,
        });
        client.connect();
        return client;
      },
      inject: [config.KEY]
    }
  ],
  exports: ['Postgres']
})
export class DatabaseModule {}
