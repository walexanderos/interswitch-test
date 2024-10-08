import { ArgumentsHost, Catch, HttpStatus } from "@nestjs/common";
import { BaseExceptionFilter } from "@nestjs/core";
import { Prisma } from "@prisma/client";
import { Response } from "express";
import { appConstant } from "../constants/app.constant";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

@Catch(PrismaClientKnownRequestError)
export class AppExceptionFilter extends BaseExceptionFilter {
  catch(exception: PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    switch (exception.code) {
      case 'P2000':
        this.catchValueTooLong(exception, response);
        break;
      case 'P2002':
        this.catchUniqueConstraint(exception, response);
        break;
      case 'P2025':
        this.catchNotFound(exception, response);
        break;
      default:
        this.unhandledException(exception, response);
        break;
    }
  }

  /**
   * Catches P2000 error code
   * https://www.prisma.io/docs/reference/api-reference/error-reference#p2000
   *
   * @param exception P2000
   * @param response 400 Bad Request
   */
  catchValueTooLong(
    exception: PrismaClientKnownRequestError,
    response: Response,
  ) {
    const status = HttpStatus.BAD_REQUEST;
    response.status(status).json({
      statusCode: status,
      message: appConstant.errorDefinition.BAD_REQUEST,
      timestamp: new Date().toISOString(),
      path: response.req.url
    });
  }

  /**
   * Catches P2002 error code
   * https://www.prisma.io/docs/reference/api-reference/error-reference#p2002
   *
   * @param exception P2002
   * @param response 409 Conflict
   */
  catchUniqueConstraint(
    exception: PrismaClientKnownRequestError,
    response: Response,
  ) {
    const status = HttpStatus.CONFLICT;
    response.status(status).json({
      statusCode: status,
      message: appConstant.errorDefinition.UNIQUE,
      timestamp: new Date().toISOString(),
      path: response.req.url
    });
  }

  /**
   * Catches P2025 error code
   * https://www.prisma.io/docs/reference/api-reference/error-reference#p2025
   *
   * @param exception P2025
   * @param response 404 Not Found
   */
  catchNotFound(
    exception: PrismaClientKnownRequestError,
    response: Response,
  ) {
    const status = HttpStatus.NOT_FOUND;
    response.status(status).json({
      statusCode: status,
      message: appConstant.errorDefinition.NOT_FOUND,
      timestamp: new Date().toISOString(),
      path: response.req.url
    });
  }

  unhandledException(
    exception: PrismaClientKnownRequestError,
    response: Response
  ) {
    // default 500 error code
    const status = HttpStatus.INTERNAL_SERVER_ERROR;
    response.status(status).json({
      statusCode: status,
      message: appConstant.errorDefinition.SERVER_ERROR,
      timestamp: new Date().toISOString(),
      path: response.req.url
    });
  }

  /**
   *
   * @param exception
   * @returns replace line breaks with empty string
   */
  cleanUpException(exception: PrismaClientKnownRequestError): string {
    return exception.message.replace(/\n/g, '');
  }
}