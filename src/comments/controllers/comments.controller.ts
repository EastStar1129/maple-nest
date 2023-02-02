import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { CommentsService } from '../services/comments.service';
import { ApiOperation } from '@nestjs/swagger';
import { CommentsCreateDto } from '../dto/comments.create.dto';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentService: CommentsService) {}
  @ApiOperation({
    summary: '모든 유저 프로필에 적힌 댓글 가져오기',
  })
  @Get()
  async getAllComments() {
    return this.commentService.getAllComments();
  }

  @ApiOperation({
    summary: '특정 유저 프로필에 댓글 남기기',
  })
  @Post(':id')
  async createComment(
    @Param('id') id: string,
    @Body() body: CommentsCreateDto,
  ) {
    return this.commentService.createComment(id, body);
  }

  @ApiOperation({
    summary: '좋아요 수 올리기',
  })
  @Patch(':id')
  async plusLike(@Param('id') id: string) {
    return this.commentService.plusLike(id);
  }
}
