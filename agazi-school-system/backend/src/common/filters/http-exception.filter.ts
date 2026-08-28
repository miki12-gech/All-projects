import { ExceptionFilter, Catch, ArgumentsHost, HttpException, Logger } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger('HttpException'); // 👈 ስህተቱን ለመመዝገብ

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const message = exception.getResponse();

    // ስህተቱን በሰርቨሩ ላይ መዝግብ (ለዲቨሎፐሩ እንዲታይ)
    this.logger.error(`Path: ${request.url} | Error: ${JSON.stringify(message)}`);

    // ለተጠቃሚው የሚመለሰው መልስ
    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: (message as any).message || message,
    });
  }
}
