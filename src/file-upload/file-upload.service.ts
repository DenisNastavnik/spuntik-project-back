import { Injectable } from '@nestjs/common';
import { MinioClientService } from 'src/minio-client/minio-client.service';
import { BufferedFile } from 'src/minio-client/file.model';

@Injectable()
export class FileUploadService {
  constructor(private readonly minioClientService: MinioClientService) {}

  async upload(files: BufferedFile[]) {
    const uploadedImages = [];

    for (const file of files) {
      const uploadedImage = await this.minioClientService.upload(file);
      uploadedImages.push(uploadedImage);
    }

    const imageUrls = uploadedImages.map((image, index) => ({
      [`image${index + 1}_url`]: image.url,
    }));

    return {
      ...imageUrls,
      message: 'Файлы загружены на MinioS3',
    };
  }
}
