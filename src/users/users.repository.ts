import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User } from './users.schema';
import { UserRequestDto } from './dto/Users.request.dto';
import * as mongoose from 'mongoose';
import { CommentsSchema } from '../comments/comments.schema';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async findByIdAndUpdateImg(id: string, fileName: string) {
    const user = await this.userModel.findById(id);

    user.imgUrl = `http://localhost:800/media/${fileName}`;
    const newUser = await user.save();

    console.log(newUser);
    return newUser.readOnlyData;
  }

  async findUserByIdWithoutPassword(
    userId: string | Types.ObjectId,
  ): Promise<User | null> {
    const user = await this.userModel.findById(userId).select('-password');
    return user;
  }

  async findUserByEmail(email: string): Promise<User | null> {
    const user = await this.userModel.findOne({ email });
    return user;
  }

  async existsByEmail(email: string): Promise<boolean> {
    const result = await this.userModel.exists({ email });
    return result ? true : false;
  }

  async create(user: UserRequestDto): Promise<User> {
    return await this.userModel.create(user);
  }

  async findAll() {
    const CommentsModel = mongoose.model('comments', CommentsSchema);
    const result = await this.userModel
      .find()
      .populate('comments', CommentsModel);

    return result;
  }
}
