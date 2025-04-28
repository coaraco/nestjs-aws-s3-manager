import { ModuleMetadata } from '@nestjs/common/interfaces';

export interface FileManagerModuleOptions {
  awsBucketName: string;
  awsAccessKeyId: string;
  awsSecretAccessKey: string;
  awsRegion?: string;
  awsEndpoint?: string;
}

export interface FileManagerModuleAsyncOptions
  extends Pick<ModuleMetadata, 'imports'> {
  useFactory: (
    ...args: any[]
  ) => Promise<FileManagerModuleOptions> | FileManagerModuleOptions;
  inject: any[];
}

export interface FileManagerOptionsFactory {
  createTypeOrmOptions(
    connectionName?: string,
  ): Promise<FileManagerModuleOptions> | FileManagerModuleOptions;
}
