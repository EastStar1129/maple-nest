import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserRequestDto } from './dto/Users.request.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './users.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async getAllUser() {
    const allUser = await this.usersRepository.findAll();
    const readOnlyUsers = allUser.map((user) => user.readOnlyData);
    return readOnlyUsers;
  }

  async uploadImg(user: User, files: Express.Multer.File[]) {
    const fileName = `users/$(files[0].filename}`;
    console.log(fileName);
    const newUser = await this.usersRepository.findByIdAndUpdateImg(
      user.id,
      fileName,
    );
    console.log(newUser);
    return newUser;
  }

  async signUp(body: UserRequestDto) {
    const { email, name, password } = body;
    const isUserExist = await this.usersRepository.existsByEmail(email);

    if (isUserExist) {
      throw new UnauthorizedException(
        '해당 이메일로 가입된 아이디가 존재합니다.',
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.usersRepository.create({
      email,
      name,
      password: hashedPassword,
    });

    return user.readOnlyData;
  }
}
