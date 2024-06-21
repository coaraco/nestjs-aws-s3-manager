import {
  DynamicModule,
  ForwardReference,
  Module,
  Provider,
  Type,
} from '@nestjs/common';

@Module({})
export class ConfigModule {
  static forRoot(options: {
    providers: Array<Provider<any>>;
    imports: Array<
      Type<any> | DynamicModule | Promise<DynamicModule> | ForwardReference<any>
    >;
  }): DynamicModule {
    return {
      module: ConfigModule,
      imports: options.imports,
      providers: options.providers,
      exports: [...options.providers],
    };
  }
}
