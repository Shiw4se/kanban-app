/* eslint-disable */
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Kanban API (e2e)', () => {
  let app: INestApplication;
  let boardId: string;
  let taskId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });


  it('/boards (POST) - Create Board', () => {
    return request(app.getHttpServer())
        .post('/boards')
        .send({ id: 'test-board-1', title: 'E2E Test Board' })
        .expect(201)
        .expect((res) => {
          boardId = res.body.id;
          expect(res.body.title).toBe('E2E Test Board');
        });
  });


  it('/tasks (POST) - Create Task', () => {
    return request(app.getHttpServer())
        .post('/tasks')
        .send({
          title: 'Test Task',
          description: 'Test Desc',
          status: 'todo',
          boardId: boardId,
        })
        .expect(201)
        .expect((res) => {
          taskId = res.body.id;
          expect(res.body.title).toBe('Test Task');
        });
  });


  it('/tasks/:id (PATCH) - Move Task', () => {
    return request(app.getHttpServer())
        .patch(`/tasks/${taskId}`)
        .send({ status: 'in_progress', order: 1 })
        .expect(200)
        .expect((res) => {
          expect(res.body.status).toBe('in_progress');
        });
  });


  it('/boards/:id (GET) - Get Board', () => {
    return request(app.getHttpServer())
        .get(`/boards/${boardId}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.id).toBe(boardId);
          expect(res.body.tasks).toHaveLength(1);
          expect(res.body.tasks[0].id).toBe(taskId);
        });
  });


  it('/boards/:id (DELETE) - Delete Board', () => {
    return request(app.getHttpServer())
        .delete(`/boards/${boardId}`)
        .expect(200);
  });


  it('/boards/:id (GET) - Ensure Deleted', () => {
    return request(app.getHttpServer())
        .get(`/boards/${boardId}`)
        .expect(404);
  });
});