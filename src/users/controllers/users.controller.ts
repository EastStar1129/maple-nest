import {
  Body,
  Controller,
  Get,
  HttpException,
  Param,
  ParseIntPipe,
  Post,
  Req,
  UploadedFiles,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from '../users.service';
import { HttpExceptionFilter } from '../../common/exceptions/http-exception.filter';
import { PositiveIntPipe } from '../../common/pipes/PositiveInt.pipe';
import { SuccessInterceptor } from '../../common/interceptors/success.interceptor';
import { UserRequestDto } from '../dto/Users.request.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ReadOnlyUserDto } from '../dto/user.dto';
import { AuthService } from '../../auth/auth.service';
import { LoginRequestDto } from '../../auth/dto/login.request.dto';
import { JwtAuthGuard } from '../../auth/jwt/jwt.guard';
import { CurrentUser } from '../../common/decorators/user.decorator';
import { FilesInterceptor } from '@nestjs/platform-express';
import { multerOptions } from '../../common/util/multer.options';
import { User } from '../users.schema';

@Controller('users')
@UseInterceptors(SuccessInterceptor)
@UseFilters(HttpExceptionFilter)
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @ApiResponse({
    status: 500,
    description: 'Server Error..',
  })
  @ApiResponse({
    status: 200,
    description: '성공',
    type: ReadOnlyUserDto,
  })
  @ApiOperation({ summary: '회원가입' })
  @Post()
  async signUp(@Body() body: UserRequestDto) {
    return await this.usersService.signUp(body);
  }

  @ApiOperation({ summary: '현재 유저 가져오기' })
  @UseGuards(JwtAuthGuard)
  @Get()
  getCurrentUser(@CurrentUser() user) {
    return user.readOnlyData;
  }

  @ApiOperation({ summary: '로그인' })
  @Post('login')
  logIn(@Body() loginRequestDto: LoginRequestDto) {
    return this.authService.jwtLogin(loginRequestDto);
  }

  @ApiOperation({ summary: '유저 이미지 업로드' })
  @UseInterceptors(FilesInterceptor('image', 10, multerOptions('users')))
  @UseGuards(JwtAuthGuard)
  @Post('upload')
  uploadUserImg(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @CurrentUser() user: User,
  ) {
    this.usersService.uploadImg(user, files);
    return { image: `http://localhost:8080/media/users/${files[0].filename}` }; // 단일파일만
  }

  @ApiOperation({ summary: '모든 유저 가져오기' })
  @Get('all')
  getAllCat() {
    return this.usersService.getAllUser();
  }
}
