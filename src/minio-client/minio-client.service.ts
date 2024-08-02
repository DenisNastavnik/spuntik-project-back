import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { MinioService } from 'nestjs-minio-client';
import * as crypto from 'crypto';
import { BufferedFile } from './minio-client.model';

@Injectable()
export class MinioClientService {
  private readonly logger: Logger;

  private readonly baseBucket = String(process.env.MINIO_BUCKET);

  public get client() {
    return this.minio.client;
  }

  constructor(private readonly minio: MinioService) {
    this.logger = new Logger('MinioStorageService');
  }

  public async upload(
    file: BufferedFile,
    baseBucket: string = this.baseBucket,
    allowedExtensions: string[] = ['.jpg', '.png'],
  ) {
    const fileExt = file.originalname.substring(file.originalname.lastIndexOf('.'));

    if (!allowedExtensions.includes(fileExt)) {
      throw new HttpException(
        'Недопустимые расширения. Допустимые расширения: ' + allowedExtensions.join(', '),
        HttpStatus.BAD_REQUEST,
      );
    }

    const temp_filename = Date.now().toString();
    const hashedFileName = crypto.createHash('md5').update(temp_filename).digest('hex');
    const ext = file.originalname.substring(
      file.originalname.lastIndexOf('.'),
      file.originalname.length,
    );
    const metaData = {
      'Content-Type': file.mimetype,
    };
    const filename = hashedFileName + ext;
    const fileName: string = `${filename}`;
    const fileBuffer = file.buffer;
    await this.client.putObject(baseBucket, fileName, fileBuffer, metaData).catch((err) => {
      throw new HttpException(`Ошибка загрузки файла: ${err}`, HttpStatus.BAD_REQUEST);
    });

    return {
      url: `${process.env.MINIO_ENDPOINT}:${process.env.MINIO_PORT}/${process.env.MINIO_BUCKET}/${filename}`,
    };
  }

  async delete(objectName: string, baseBucket: string = this.baseBucket) {
    const exists = await this.client.statObject(baseBucket, objectName).catch((err) => {
      throw new HttpException(
        `Ошибка при проверке существования файла: ${err}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    });

    if (exists) {
      await this.client.removeObject(baseBucket, objectName).catch((err) => {
        throw new HttpException(`Ошибка удаления файла: ${err}`, HttpStatus.BAD_REQUEST);
      });
    }
  }
}
