import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { AuthService } from 'src/auth/services/auth.service';
import { FeedService } from '../services/feed.service';
import { User } from 'src/auth/controllers/models/user.interface';
import { request } from 'http';

@Injectable()
export class IsCreatorGuard implements CanActivate {
  constructor(private authService:AuthService, private feedService: FeedService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {

    const request = context.switchToHttp().getRequest();
    
    const {  user , params } : { user: User; params: { id: number } } = request;

    if (!user || !params ) return false;

    if (user.role === 'admin') return true; //permettre aux administrateurs de faire des demandes


    const userId = user.id;
    const feedId = params.id;

    //Determiner si l'utilisateur connnecté est le même que l'utilisateur qui a crée la publication du fil d'actualité
    
  }
}
