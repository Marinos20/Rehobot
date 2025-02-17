import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from "@nestjs/common";
import { Response } from "express";

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
    private readonly logger = new Logger(AllExceptionsFilter.name);

    catch(exception: unknown, host: ArgumentsHost): void {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        let status = HttpStatus.INTERNAL_SERVER_ERROR;
        let message = 'Une erreur interne est survenue';

        if (exception instanceof HttpException) {
            status = exception.getStatus();
            const responseBody = exception.getResponse();

            // Vérifie si responseBody est une chaîne de caractères
            if (typeof responseBody === 'string') {
                message = responseBody;
            } else if (typeof responseBody === 'object' && responseBody !== null && 'message' in responseBody) {
                // Si responseBody est un objet et qu'il contient un message, on l'assigne
                message = (responseBody as { message: string }).message || 'Une erreur interne est survenue';
            }
        }

        // Log uniquement les erreurs sous forme d'un message normal (pas de logs d'erreur)
        this.logger.log(`Erreur détectée : ${JSON.stringify(message)}`);

        response.status(status).json({
            statusCode: status,
            timestamp: new Date().toISOString(),
            path: request.url,
            message,
        });
    }
}
