import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiOperation } from '@nestjs/swagger';

@Controller('images')
export class FileManagerController {
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ description: 'upload', operationId: 'uploadCustomers' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        file: {
          type: "string",
          format: "binary",
        }
      }
    }
  })
  public async upload(@UploadedFile() file: any) {
    return { url: file.location };
  }
}
