import { Injectable } from '@nestjs/common';
import { BufferedFile } from 'src/minio-client/minio-client.model';
import { MinioClientService } from 'src/minio-client/minio-client.service';

@Injectable()
export class FileUploadService {
  constructor(private minioClientService: MinioClientService) {}

  async uploadSingle(image: BufferedFile) {
    const uploaded_image = await this.minioClientService.upload(image);

    return {
      image_url: uploaded_image.url,
      message: 'Файл загружен на MinIO S3',
    };
  }

  async uploadMany(files: BufferedFile) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const image1 = files['image1'][0];
    const uploaded_image1 = await this.minioClientService.upload(image1);

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const image2 = files['image2'][0];
    const uploaded_image2 = await this.minioClientService.upload(image2);

    return {
      image1_url: uploaded_image1.url,
      image2_url: uploaded_image2.url,
      message: 'Файлы загружены на MinIO S3',
    };
  }

  async deleteFile(objectName: string) {
    await this.minioClientService.delete(objectName);

    return {
      message: 'Файл удален из MinIO S3',
    };
  }
}
