import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { Document, SchemaOptions } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import {Comments} from "../comments/comments.schema";

const options: SchemaOptions = {
  collection: 'users',
  timestamps: true,
};

@Schema(options)
export class User extends Document {
  @ApiProperty({
    example: 'maple@maple.com',
    description: 'email',
    required: true,
  })
  @Prop({
    required: true,
    unique: true,
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: 'JangDongGyu',
    description: 'name',
    required: true,
  })
  @Prop({
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'maplePassword1',
    description: 'password',
    required: true,
  })
  @Prop({
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  password: string;

  @Prop({
    // default: 'https://localhost:8080/media/no-image.jpeg',
    default:
      'https://raw.githubusercontent.com/amamov/teaching-nestjs-a-to-z/main/images/1.jpeg',
  })
  @IsString()
  imgUrl: string;

  readonly readOnlyData: {
    id: string;
    email: string;
    name: string;
    imgUrl: string;
  };

  readonly comments: Comments[];
}

export const _UserSchema = SchemaFactory.createForClass(User);

_UserSchema.virtual('readOnlyData').get(function (this: User) {
  return {
    id: this.id,
    email: this.email,
    name: this.name,
    imgUrl: this.imgUrl,
    comments: this.comments,
  };
});

_UserSchema.virtual('comments', {
  ref: 'comments',
  localField: '_id',
  foreignField: 'info',
});
/*
 * 포퓰레이터 설정
 * */
_UserSchema.set('toObject', { virtuals: true });
_UserSchema.set('toJSON', { virtuals: true });

export const UserSchema = _UserSchema;
