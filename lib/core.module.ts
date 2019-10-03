import { Module, DynamicModule, Global } from '@nestjs/common';
import { NestjsAwsS3ManagerController } from './nestjs-aws-s3-manager.controller';
import { NestjsAwsS3ManagerService } from './nestjs-aws-s3-manager.service';
import {
  NestjsAwss3managerModuleOptions,
  NestjsAwss3managerModuleAsyncOptions,
} from './interfaces/options.interface';
import { NESTJS_AWS_S3_MANAGER_MODULE_OPTIONS } from './nestjs-aws-s3-manager.constants';
import { MulterModule } from '@nestjs/platform-express';
import * as multerS3 from 'multer-s3';
import * as AWS from 'aws-sdk';

@Global()
@Module({})
export class NestjsAwsS3ManagerCoreModule {
  static forRoot(options: NestjsAwss3managerModuleOptions): DynamicModule {
    const nestjsAwss3managerModuleOptions = {
      provide: NESTJS_AWS_S3_MANAGER_MODULE_OPTIONS,
      useValue: options,
    };
    return {
      module: NestjsAwsS3ManagerCoreModule,
      controllers: [NestjsAwsS3ManagerController],
      providers: [NestjsAwsS3ManagerService, nestjsAwss3managerModuleOptions],
      imports: [
        MulterModule.register({
          storage: multerS3({
            s3: new AWS.S3({
              accessKeyId: options.awsAccessKeyId,
              secretAccessKey: options.awsSecretAccessKey,
            }),
            bucket: options.awsBucketName,
            acl: 'public-read',
            key(request, file, cb) {
              cb(null, `${Date.now().toString()} - ${file.originalname}`);
            },
          }),
        }),
      ],
    };
  }

  static forRootAsync(
    options: NestjsAwss3managerModuleAsyncOptions,
  ): DynamicModule {
    return {
      module: NestjsAwsS3ManagerCoreModule,
      imports: options.imports,
      providers: [],
      exports: [],
    };
  }
}
