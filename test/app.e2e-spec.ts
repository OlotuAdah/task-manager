import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import * as request from "supertest";
import { AppModule } from "./../src/app.module";

describe("AppController (e2e)", () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it("/api/auth/register (POST)", () => {
    return request
      .default(app.getHttpServer())
      .post("/api/auth/register")
      .send({
        email: "test@example.com",
        password: "password123",
        firstName: "Test",
        lastName: "User",
      })
      .expect(201);
  });

  afterAll(async () => {
    await app.close();
  });
});
