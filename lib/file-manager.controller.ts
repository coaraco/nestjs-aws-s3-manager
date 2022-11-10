import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiOperation, ApiConsumes, ApiBody } from '@nestjs/swagger';

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
