import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor, FileFieldsInterceptor } from '@nestjs/platform-express';
import { FileUploadService } from './file-upload.service';
import { BufferedFile } from 'src/minio-client/minio-client.model';
import { AuthGuard, RolesGuard } from 'src/users';
import { Role, Roles } from 'src/decorators';

@Controller('file-upload')
export class FileUploadController {
  constructor(private fileUploadService: FileUploadService) {}

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Vendor)
  @Post('single')
  @UseInterceptors(FileInterceptor('image'))
  async uploadSingle(@UploadedFile() file: BufferedFile) {
    return await this.fileUploadService.uploadSingle(file);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Vendor)
  @Post('many')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'image1', maxCount: 1 },
      { name: 'image2', maxCount: 1 },
    ]),
  )
  async uploadMany(@UploadedFiles() files: BufferedFile) {
    return this.fileUploadService.uploadMany(files);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Vendor)
  @Delete(':fileName')
  async deleteSingle(@Param('fileName') fileName: string) {
    return await this.fileUploadService.deleteFile(fileName);
  }
}
