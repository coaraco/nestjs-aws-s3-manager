import { Module, DynamicModule, Global } from '@nestjs/common';
import { FileManagerController } from './file-manager.controller';
import { FileManagerService } from './file.service';
import {
  FileManagerModuleOptions,
  FileManagerModuleAsyncOptions,
} from './interfaces/options.interface';
import { FILE_MANAGER_MODULE_OPTIONS } from './file-manager.constants';
import { MulterModule } from '@nestjs/platform-express';
import * as multerS3 from 'multer-s3';
import * as AWS from 'aws-sdk';

@Global()
@Module({})
export class FileManagerCoreModule {
  static forRoot(options: FileManagerModuleOptions): DynamicModule {
    const nestjsAwss3managerModuleOptions = {
      provide: FILE_MANAGER_MODULE_OPTIONS,
      useValue: options,
    };
    return {
      module: FileManagerCoreModule,
      controllers: [FileManagerController],
      providers: [FileManagerService, nestjsAwss3managerModuleOptions],
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

  static forRootAsync(options: FileManagerModuleAsyncOptions): DynamicModule {
    return {
      module: FileManagerCoreModule,
      imports: options.imports,
      providers: [],
      exports: [],
    };
  }
}
