import { Module, DynamicModule, Global, Logger, Provider, Type } from '@nestjs/common';
import { FileManagerController } from './file-manager.controller';
import { FileManagerService } from './file.service';
import {
  FileManagerModuleOptions,
  FileManagerModuleAsyncOptions,
  FileManagerOptionsFactory,
} from './interfaces/options.interface';
import { FILE_MANAGER_MODULE_OPTIONS } from './file-manager.constants';
import { MulterModule } from '@nestjs/platform-express';
import * as multerS3 from 'multer-s3';
import * as AWS from 'aws-sdk';
import { ApiOperation } from '@nestjs/swagger';

@Global()
@Module({})
export class FileManagerCoreModule {
  static forRoot(options: FileManagerModuleOptions): DynamicModule {
    const managerModuleOptions = {
      provide: FILE_MANAGER_MODULE_OPTIONS,
      useValue: options,
    };
    return {
      module: FileManagerCoreModule,
      controllers: [FileManagerController],
      providers: [FileManagerService, managerModuleOptions],
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
    const asyncProviders = this.createAsyncProviders(options);
    return {
      module: FileManagerCoreModule,
      controllers: [FileManagerController],
      providers: [...asyncProviders, FileManagerService],
      imports: options.imports,
      exports: [],
    };
  }

  private static createAsyncProviders(
    options: FileManagerModuleAsyncOptions,
  ): Provider[] {
    if (options.useExisting || options.useFactory) {
      return [this.createAsyncOptionsProvider(options)];
    }
    const useClass = options.useClass as Type<FileManagerOptionsFactory>;
    return [
      this.createAsyncOptionsProvider(options),
      {
        provide: useClass,
        useClass,
      },
    ];
  }

  private static createAsyncOptionsProvider(
    options: FileManagerModuleAsyncOptions,
  ): Provider {
    if (options.useFactory) {
      return {
        provide: FILE_MANAGER_MODULE_OPTIONS,
        useFactory: options.useFactory,
        inject: options.inject || [],
      };
    }
    // `as Type<TypeOrmOptionsFactory>` is a workaround for microsoft/TypeScript#31603
    const inject = [
      (options.useClass || options.useExisting) as Type<FileManagerOptionsFactory>,
    ];
    return {
      provide: FILE_MANAGER_MODULE_OPTIONS,
      useFactory: async (optionsFactory: FileManagerOptionsFactory) =>
        await optionsFactory.createTypeOrmOptions(options.name),
      inject,
    };
  }
}
