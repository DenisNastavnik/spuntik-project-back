import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { MinioService } from 'nestjs-minio-client';
import { config } from './config';
import { BufferedFile } from './file.model';
import * as crypto from 'crypto';

@Injectable()
export class MinioClientService {
  private readonly logger: Logger;
  private readonly baseBucket = config.MINIO_BUCKET;

  public get client() {
    return this.minio.client;
  }

  constructor(private readonly minio: MinioService) {
    this.logger = new Logger('MinioStorageService');
  }

  public async upload(file: BufferedFile, baseBucket: string = this.baseBucket) {
    if (!(file.mimetype.includes('jpeg') || file.mimetype.includes('png'))) {
      throw new HttpException('Ошибка загрузки файла', HttpStatus.BAD_REQUEST);
    }
    const temp_filename = Date.now().toString();
    const hashedFileName = crypto.createHash('md5').update(temp_filename).digest('hex');
    const ext = file.originalname.substring(
      file.originalname.lastIndexOf('.'),
      file.originalname.length,
    );
    const filename = hashedFileName + ext;
    const fileName: string = `${filename}`;
    const fileBuffer = file.buffer;
    this.client.putObject(baseBucket, fileName, fileBuffer, (err) => {
      if (err) {
        throw new HttpException('Ошибка загрузки файла', HttpStatus.BAD_REQUEST);
      }
    });

    return {
      url: `${config.MINIO_ENDPOINT}:${config.MINIO_PORT}/${config.MINIO_BUCKET}/${filename}`,
    };
  }

  async delete(objetName: string, baseBucket: string = this.baseBucket) {
    this.client.removeObject(baseBucket, objetName, (err) => {
      if (err)
        throw new HttpException('С удалением файла что-то пошло не так', HttpStatus.BAD_REQUEST);
    });
  }
}
