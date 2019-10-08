import { ModuleMetadata, Type } from '@nestjs/common/interfaces';

export interface FileManagerModuleOptions {
  awsBucketName: string;
  awsAccessKeyId: string;
  awsSecretAccessKey: string;
}

export interface FileManagerModuleAsyncOptions
  extends Pick<ModuleMetadata, 'imports'> {
  name?: string;
  useExisting?: Type<FileManagerOptionsFactory>;
  useClass?: Type<FileManagerOptionsFactory>;
  useFactory?: (
    ...args: any[]
  ) => Promise<FileManagerModuleOptions> | FileManagerModuleOptions;
  inject?: any[];
}

export interface FileManagerOptionsFactory {
  createTypeOrmOptions(
    connectionName?: string,
  ): Promise<FileManagerModuleOptions> | FileManagerModuleOptions;
}
