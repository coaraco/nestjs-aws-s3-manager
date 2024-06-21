import { DynamicModule, Module } from '@nestjs/common';
import { FileManagerCoreModule } from './file-manager-core.module';
import {
  FileManagerModuleAsyncOptions,
  FileManagerModuleOptions,
} from './interfaces/options.interface';

@Module({})
export class FileManagerModule {
  static forRoot(options: FileManagerModuleOptions): DynamicModule {
    return {
      module: FileManagerModule,
      imports: [FileManagerCoreModule.forRoot(options)],
    };
  }

  static forRootAsync(options: FileManagerModuleAsyncOptions): DynamicModule {
    return {
      module: FileManagerModule,
      imports: [FileManagerCoreModule.forRootAsync(options)],
    };
  }
}
