import { Test, TestingModule } from '@nestjs/testing';
import { CommentsController } from './comments.controller';
import {MongooseModule} from "@nestjs/mongoose";
import {User, UserSchema} from "../../users/users.schema";
import {CommentsSchema} from "../comments.schema";

describe('CommentsController', () => {
  let controller: CommentsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CommentsController],
    }).compile();

    controller = module.get<CommentsController>(CommentsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
