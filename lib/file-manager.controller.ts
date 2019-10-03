import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiOperation, ApiConsumes, ApiImplicitFile } from '@nestjs/swagger';

@Controller('/images')
export class FileManagerController {
  @Post('/upload')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ title: 'upload', operationId: 'uploadCustomers' })
  @ApiConsumes('multipart/form-data')
  @ApiImplicitFile({
    name: 'file',
    required: true,
    description: 'image',
  })
  public async upload(@UploadedFile() file: Express.Multer.File) {
    return { url: file.location };
  }
}
