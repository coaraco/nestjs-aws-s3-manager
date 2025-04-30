import { S3Client } from '@aws-sdk/client-s3';
import {
  DynamicModule,
  Global,
  Module,
  Provider,
} from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import * as multerS3 from 'multer-s3';
import { ConfigModule } from './config.module';
import { FILE_MANAGER_MODULE_OPTIONS } from './file-manager.constants';
import { FileManagerController } from './file-manager.controller';
import { FileManagerService } from './file.service';
import {
  FileManagerModuleAsyncOptions,
  FileManagerModuleOptions,
} from './interfaces/options.interface';
import { randomUUID } from 'crypto';
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
            s3: new S3Client({
              region: options.awsRegion,
              endpoint: options.awsEndpoint,
              credentials: {
                accessKeyId: options.awsAccessKeyId,
                secretAccessKey: options.awsSecretAccessKey,
              }
            }),
            bucket: options.awsBucketName,
            acl: 'public-read',
            key(request, file, cb) {
              if (options.filePath) {
                cb(null, `${options.filePath}/${randomUUID()}`);
              } else {
                cb(null, `${Date.now().toString()} - ${file.originalname}`);
              }
            },
          }),
        }),
      ],
    };
  }

  static forRootAsync(options: FileManagerModuleAsyncOptions): DynamicModule {
    const imports = options.imports ? options.imports : [];
    return {
      module: FileManagerCoreModule,
      controllers: [FileManagerController],
      providers: [FileManagerService],
      imports: [
        ...imports,
        ConfigModule.forRoot({
          providers: [this.createAsyncProviders(options)],
          imports,
        }),
        MulterModule.registerAsync({
          imports: [
            ConfigModule.forRoot({
              providers: [this.createAsyncProviders(options)],
              imports,
            }),
          ],
          useFactory: (optionsAsync: FileManagerModuleOptions) => {
            return {
              storage: multerS3({
                s3: new S3Client({
                  region: optionsAsync.awsRegion,
                  endpoint: optionsAsync.awsEndpoint,
                  credentials: {
                    accessKeyId: optionsAsync.awsAccessKeyId,
                    secretAccessKey: optionsAsync.awsSecretAccessKey,
                  }
                }),
                bucket: optionsAsync.awsBucketName,
                acl: 'public-read',
                key(request, file, cb) {
                  if (optionsAsync.filePath) {
                    cb(null, `${optionsAsync.filePath}/${randomUUID()}`);
                  } else {
                    cb(null, `${Date.now().toString()} - ${file.originalname}`);
                  }
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
