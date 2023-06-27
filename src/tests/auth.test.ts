import request from "supertest";
import express, { Express, Router } from "express";
import UserRoutes from "../routes/users";
import * as usersModule from "../services/users";
import generateTokens from "../utils/generateTokens";

jest.mock("../services/users");
jest.mock("../utils/generateTokens");

describe("User Routes", () => {
  let app: Express;
  let userRoutes: Router;

  beforeAll(() => {
    app = express();
    userRoutes = new UserRoutes().router;
    app.use(express.json());
    app.use("/", userRoutes);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should register a new user", async () => {
    const saveUserMock = jest.spyOn(usersModule, "saveUser");
    saveUserMock.mockResolvedValue();

    const response = await request(app).post("/signup").send({
      username: "testuser",
      email: "testuser@example.com",
      password: "Aa12345678@"
    });

    expect(response.status).toBe(201);
    expect(response.body).toEqual({ error: false, message: "user created successfully" });
    expect(saveUserMock).toHaveBeenCalledTimes(1);
    expect(saveUserMock).toHaveBeenCalledWith({
      email: "testuser@example.com",
      password: "Aa12345678@",
      username: "testuser"
    });
  });

  it("should handle registration failure on database", async () => {
    const saveUserMock = jest.spyOn(usersModule, "saveUser");
    saveUserMock.mockRejectedValue(new Error("Database error"));

    const response = await request(app).post("/signup").send({
      username: "testuser",
      email: "testuser@example.com",
      password: "Aa12345678@"
    });

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ error: true, message: "internal server error" });
    expect(saveUserMock).toHaveBeenCalledTimes(1);
    expect(saveUserMock).toHaveBeenCalledWith({
      email: "testuser@example.com",
      password: "Aa12345678@",
      username: "testuser"
    });
  });

  it("should handle registration failure with conflict user", async () => {
    const getUserFromEmailMock = (usersModule.getUserFromEmail as jest.Mock).mockReturnValue(true);

    const response = await request(app).post("/signup").send({
      username: "testuser",
      email: "testuser@example.com",
      password: "Aa12345678@"
    });

    expect(response.status).toBe(409);
    expect(response.body).toEqual({ error: true, message: "user with this email already exist" });
    expect(getUserFromEmailMock).toHaveBeenCalledTimes(1);
  });

  it("should handle registeration failure with multiple wrong values", async () => {
    const testCases = [
      { username: "testuser", password: "12345678", email: "testuser@example.com" },
      { password: "Aa12345678@", email: "testuser@example.com" },
      { username: "testuser", password: "Aa12345678@" },
      { username: "testuser", email: "testuser@example.com" },
      { username: "testuser", password: "Aa12345678", email: "testuser@example.com" }
    ];

    testCases.forEach(async (testCase) => {
      const response = await request(app).post("/signup").send(testCase);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("message");
      expect(response.body).toHaveProperty("error", true);
    });
  });

  it('should sign in a user with valid credentials', async () => {
    (usersModule.getUserFromEmail as jest.Mock).mockImplementation((email: string) => {
      if (email === 'testuser@example.com') {
        return Promise.resolve({
          passwordComparison: jest.fn().mockImplementation((password: string, callback: (error: Error | null, isMatch: boolean) => void) => {
            if (password === 'Aa12345678@') {
              callback(null, true);
            } else {
              callback(null, false);
            }
          }),
        });
      } else {
        return Promise.resolve(null);
      }
    });

    (generateTokens as jest.Mock).mockResolvedValue({
      accessToken: 'mockAccessToken',
      refreshToken: 'mockRefreshToken',
    });

    const response = await request(app)
      .post('/signin')
      .send({
        email: 'testuser@example.com',
        password: 'Aa12345678@',
      });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      accessToken: 'mockAccessToken',
      refreshToken: 'mockRefreshToken',
      error: false,
      message: 'login successful',
    });
    expect(usersModule.getUserFromEmail).toHaveBeenCalledTimes(1);
    expect(usersModule.getUserFromEmail).toHaveBeenCalledWith('testuser@example.com');
    expect(generateTokens).toHaveBeenCalledTimes(1);
    expect(generateTokens).toHaveBeenCalledWith(expect.any(Object));
  });

  it('should handle sign in failure with invalid credentials', async () => {
    (usersModule.getUserFromEmail as jest.Mock).mockResolvedValue(null);

    const response = await request(app)
      .post('/signin')
      .send({
        email: 'testuser@example.com',
        password: 'Aa12345678@',
      });

    expect(response.status).toBe(401);
    expect(response.body).toEqual({
      error: true,
      message: 'invalid email or password',
    });
    expect(usersModule.getUserFromEmail).toHaveBeenCalledTimes(1);
    expect(usersModule.getUserFromEmail).toHaveBeenCalledWith('testuser@example.com');
    expect(generateTokens).not.toHaveBeenCalled();
  });

  it('should handle internal server error', async () => {
    (usersModule.getUserFromEmail as jest.Mock).mockRejectedValue(new Error('Database error'));

    const response = await request(app)
      .post('/signin')
      .send({
        email: 'testuser@example.com',
        password: 'Aa12345678@',
      });

    expect(response.status).toBe(500);
    expect(response.body).toEqual({
      error: true,
      message: 'Internal server error',
    });
    expect(usersModule.getUserFromEmail).toHaveBeenCalledTimes(1);
    expect(usersModule.getUserFromEmail).toHaveBeenCalledWith('testuser@example.com');
    expect(generateTokens).not.toHaveBeenCalled();
  });
});
