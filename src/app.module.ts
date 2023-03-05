import { Module } from '@nestjs/common';
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule, ConfigService } from "@nestjs/config";

import configuration from "./config/configuration";
import { AwsCostReportModule } from "./aws-cost-report/aws-cost-report.module";
import { AwsCostReport } from "./aws-cost-report/entity";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration]
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const mongoProtocol = configService.get('mongoProtocol');
        const mongoUser = configService.get('mongoUser');
        const mongoPassword = configService.get('mongoPassword');
        const mongoHost = configService.get('mongoHost');
        const mongoName = configService.get('dbName');
        const mongoRequestParams = configService.get('mongoRequestParams');

        const mongoDBConnection = `${mongoProtocol}://${mongoUser}:${
          mongoPassword
        }@${mongoHost}/${mongoName}?${mongoRequestParams}`

        return {
          type: 'mongodb',
          url: mongoDBConnection,
          useUnifiedTopology: true,
          useNewUrlParser: true,
          synchronize: true,
          entities: [AwsCostReport]
        }
      },
      inject: [ConfigService],
    }),
    AwsCostReportModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
