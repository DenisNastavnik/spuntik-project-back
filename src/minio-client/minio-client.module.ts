import { Module } from '@nestjs/common';
import { MinioClientService } from './minio-client.service';
import { MinioModule } from 'nestjs-minio-client';

@Module({
  imports: [
    MinioModule.register({
      endPoint: process.env.MINIO_ENDPOINT || 'localhost',
      port: Number(process.env.MINIO_PORT) || 9001,
      useSSL: false,
      accessKey: process.env.MINIO_ACCESSKEY || 'defaultAccessKey',
      secretKey: process.env.MINIO_SECRETKEY || 'defaultSecretKey',
    }),
  ],
  providers: [MinioClientService],
  exports: [MinioClientService],
})
export class MinioClientModule {}
