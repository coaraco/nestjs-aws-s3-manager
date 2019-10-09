import {
  Module,
  DynamicModule,
  Global,
  Logger,
  Provider,
} from '@nestjs/common';
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
import { ConfigModule } from './config.module';

@Global()
@Module({})
export class FileManagerCoreModule {
  static forRoot(options: FileManagerModuleOptions): DynamicModule {
    return {
      module: FileManagerCoreModule,
      controllers: [FileManagerController],
      providers: [
        FileManagerService,
        {
          provide: FILE_MANAGER_MODULE_OPTIONS,
          useValue: options,
        },
      ],
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
      controllers: [FileManagerController],
      providers: [FileManagerService],
      imports: [
        ...options.imports,
        ConfigModule.forRoot({
          providers: [this.createAsyncProviders(options)],
          imports: options.imports,
        }),
        MulterModule.registerAsync({
          imports: [
            ConfigModule.forRoot({
              providers: [this.createAsyncProviders(options)],
              imports: options.imports,
            }),
          ],
          useFactory: (optionsAsync: FileManagerModuleOptions) => {
            Logger.log(optionsAsync.awsSecretAccessKey);
            return {
              storage: multerS3({
                s3: new AWS.S3({
                  accessKeyId: optionsAsync.awsAccessKeyId,
                  secretAccessKey: optionsAsync.awsSecretAccessKey,
                }),
                bucket: optionsAsync.awsBucketName,
                acl: 'public-read',
                key(request, file, cb) {
                  cb(null, `${Date.now().toString()} - ${file.originalname}`);
                },
              }),
            };
          },
          inject: [FILE_MANAGER_MODULE_OPTIONS],
        }),
      ],
    };
  }

  private static createAsyncProviders(
    options: FileManagerModuleAsyncOptions,
  ): Provider {
    return {
      provide: FILE_MANAGER_MODULE_OPTIONS,
      useFactory: options.useFactory,
      inject: options.inject,
    };
  }
}
