# Nestjs aws s3 manager

File manager module for NestJs.

### Installation

**Yarn**

```bash
yarn add @coara/nestjs-aws-s3-manager
```

**NPM**

```bash
npm install @coara/nestjs-aws-s3-manager --save
```

### Getting Started

Let's register the FileManagerModule in `app.module.ts`

```typescript
import { Module } from '@nestjs/common';
import { FileManagerModule } from '@coara/nestjs-aws-s3-manager';

@Module({
  imports: [
    FileManagerModule.forRoot({
      awsAccessKeyId: '****',
      awsSecretAccessKey: '****',
      awsBucketName: 'my-bucket-name',
    }),
  ],
})
export class AppModule {}
```

With Async

```typescript
import { Module } from '@nestjs/common';
import { FileManagerModule } from '@coara/nestjs-aws-s3-manager';

@Module({
  imports: [
    FileManagerModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        awsAccessKeyId: configService.get('AWS_ACCESS_KEY_ID'),
        awsSecretAccessKey: configService.get('AWS_SECRET_ACCESS_KEY'),
        awsBucketName: 'my-bucket-name',
      }),
      inject: [ConfigService],
    }),
  ],
})
export class AppModule {}
```

### API Endpoints

```bash
curl -F 'file=@path/to/local/file' http://localhost:3000/images
```

That's it!
