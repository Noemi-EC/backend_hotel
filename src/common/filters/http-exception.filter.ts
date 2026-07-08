import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const responseBody =
      exception instanceof HttpException
        ? exception.getResponse()
        : 'Internal server error';

    const safeMessage =
      status === Number(HttpStatus.INTERNAL_SERVER_ERROR)
        ? 'Internal server error'
        : typeof responseBody === 'string'
          ? responseBody
          : Array.isArray(responseBody)
            ? responseBody.join(', ')
            : typeof responseBody === 'object' &&
                responseBody !== null &&
                'message' in responseBody
              ? ((responseBody as { message?: string | string[] }).message ??
                'Bad request')
              : 'Bad request';

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: safeMessage,
    });
  }
}
