import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { FeedService } from '../services/feed.service';
import { FeedPost } from '../models/post.interface';
import { from, Observable, skip, take } from 'rxjs';
import { DeleteResult, UpdateResult } from 'typeorm';
import { JwtGuard } from 'src/auth/guards/jwt.guard';

@Controller('feed')
export class FeedController {

    constructor(private feedService: FeedService) { }

    @UseGuards(JwtGuard)
    @Post()
    create(@Body() feedPost: FeedPost): Observable<FeedPost> {
        return this.feedService.createPost(feedPost);

    }
    //**recuperation allpost */
    //  @Get()
    //  findAll(): Observable<FeedPost[]> {
    //     return this.feedService.findAllPost();
    //  }
  //pagination
    @Get()
    findSelected(@Query('take') take: number = 1, @Query('skip') skip: number = 1): Observable<FeedPost[]> {
        take = take > 20 ? 20 : take;
        return this.feedService.findPosts(take, skip);
    }

    @Put(':id')
    update(
        @Param('id') id: number,
        @Body() feedPost: FeedPost
    ): Observable<UpdateResult> {
        return this.feedService.updatePost(id, feedPost)
    }
    @Delete(':id')
    delete(@Param('id') id: number
    ): Observable<DeleteResult> {
        return this.feedService.deletePost(id);
    }

}
