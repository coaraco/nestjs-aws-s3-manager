import { ModuleMetadata, Type } from '@nestjs/common/interfaces';

export interface NestjsAwss3managerModuleOptions {
  awsBucketName: string;
  awsAccessKeyId: string;
  awsSecretAccessKey: string;
}

export interface NestjsAwss3managerModuleAsyncOptions
  extends Pick<ModuleMetadata, 'imports'> {
  name?: string;
  useFactory?: (
    ...args: any[]
  ) =>
    | Promise<NestjsAwss3managerModuleOptions>
    | NestjsAwss3managerModuleOptions;
  inject?: any[];
}
