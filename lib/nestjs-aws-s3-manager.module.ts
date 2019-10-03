import { Module, DynamicModule } from '@nestjs/common';
import { NestjsAwsS3ManagerCoreModule } from './core.module';
import {
  NestjsAwss3managerModuleAsyncOptions,
  NestjsAwss3managerModuleOptions,
} from './interfaces/options.interface';

@Module({})
export class NestjsAwsS3ManagerModule {
  static forRoot(options: NestjsAwss3managerModuleOptions): DynamicModule {
    return {
      module: NestjsAwsS3ManagerModule,
      imports: [NestjsAwsS3ManagerCoreModule.forRoot(options)],
    };
  }

  static forRootAsync(
    options: NestjsAwss3managerModuleAsyncOptions,
  ): DynamicModule {
    return {
      module: NestjsAwsS3ManagerModule,
      imports: [NestjsAwsS3ManagerCoreModule.forRootAsync(options)],
    };
  }
}
