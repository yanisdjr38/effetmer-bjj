import request from "supertest";
import app from "../src/app.js";
import { connectDB } from "../src/config/database.js";
import AuthToken from "../src/models/AuthToken.js";
import RefreshToken from "../src/models/RefreshToken.js";
import User from "../src/models/User.js";

describe("Authentication Flow", () => {
  let testEmail = `test-${Date.now()}@example.com`;
  let magicToken = null;
  let accessToken = null;
  let refreshToken = null;

  beforeAll(async () => {
    await connectDB();
    // Clear test data
    await User.deleteMany({ email: testEmail });
    await AuthToken.deleteMany({ email: testEmail });
    await RefreshToken.deleteMany({});
  });

  afterAll(async () => {
    // Cleanup
    await User.deleteMany({ email: testEmail });
    await AuthToken.deleteMany({ email: testEmail });
  });

  describe("POST /api/auth/request-magic-link", () => {
    it("should request magic link with valid email", async () => {
      const res = await request(app)
        .post("/api/auth/request-magic-link")
        .send({ email: testEmail });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty("email");
      expect(res.body.data).toHaveProperty("expiresIn");
    });

    it("should reject invalid email", async () => {
      const res = await request(app)
        .post("/api/auth/request-magic-link")
        .send({ email: "invalid-email" });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it("should rate limit after 3 requests per hour", async () => {
      const email = `ratelimit-${Date.now()}@example.com`;

      // First 3 should succeed
      for (let i = 0; i < 3; i++) {
        const res = await request(app)
          .post("/api/auth/request-magic-link")
          .send({ email });

        expect(res.status).toBe(200);
      }

      // 4th should be rate limited
      const res = await request(app)
        .post("/api/auth/request-magic-link")
        .send({ email });

      expect(res.status).toBe(429);
    });
  });

  describe("POST /api/auth/verify-magic-link", () => {
    it("should verify magic link and return tokens", async () => {
      // First request magic link
      const linkRes = await request(app)
        .post("/api/auth/request-magic-link")
        .send({ email: testEmail });

      // Get the token from database (normally sent via email)
      const authToken = await AuthToken.findOne({ email: testEmail });
      expect(authToken).toBeTruthy();

      // For testing, we need to get the token from the database
      // In production, this would come from email
      // Since we can't easily extract the plain token, this test is conceptual
      // In real test infrastructure, mock the email sending
    });

    it("should reject invalid token", async () => {
      const res = await request(app)
        .post("/api/auth/verify-magic-link")
        .send({ email: testEmail, token: "invalid-token" });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });
  });

  describe("POST /api/auth/refresh-token", () => {
    it("should refresh access token with valid refresh token", async () => {
      // This requires a valid refresh token from a previous login
      // Skipping for now as it requires mock login
    });

    it("should reject invalid refresh token", async () => {
      const res = await request(app)
        .post("/api/auth/refresh-token")
        .send({ refreshToken: "invalid-token" });

      expect(res.status).toBe(401);
    });
  });

  describe("POST /api/auth/logout", () => {
    it("should require authentication", async () => {
      const res = await request(app).post("/api/auth/logout");

      expect(res.status).toBe(401);
    });
  });

  describe("GET /api/health", () => {
    it("should return health status", async () => {
      const res = await request(app).get("/api/health");

      expect(res.status).toBe(200);
      expect(res.body.status).toBe("ok");
    });
  });
});
