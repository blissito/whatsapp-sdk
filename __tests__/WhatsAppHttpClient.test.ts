import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { Effect } from "effect";
import { WhatsAppHttpClient, makeWhatsAppHttpClient } from "../src/http/WhatsAppHttpClient";

// Mock configuration for testing
const testConfig = {
  phoneNumberId: "test_phone_number_id",
  accessToken: "test_access_token",
  baseUrl: "https://graph.facebook.com",
  apiVersion: "v17.0"
};

describe("WhatsAppHttpClient", () => {
  let httpClient: ReturnType<typeof makeWhatsAppHttpClient>;

  beforeAll(() => {
    httpClient = makeWhatsAppHttpClient(testConfig);
  });

  it("should be created with the correct configuration", () => {
    expect(httpClient).toBeDefined();
    // We can't directly access private properties, but we can check if methods exist
    expect(typeof httpClient.sendTextMessage).toBe("function");
    expect(typeof httpClient.uploadMedia).toBe("function");
    expect(typeof httpClient.getMediaInfo).toBe("function");
    expect(typeof httpClient.downloadMedia).toBe("function");
  });

  // Note: Actual API calls would require mocking the fetch calls
  // For now, we'll test that the methods exist and return Effects
  it("should return an Effect for sendTextMessage", () => {
    const result = httpClient.sendTextMessage("1234567890", "Test message");
    expect(Effect.isEffect(result)).toBe(true);
  });

  it("should return an Effect for uploadMedia", () => {
    const testData = new Uint8Array([1, 2, 3]);
    const result = httpClient.uploadMedia({
      data: testData,
      type: "image/jpeg"
    });
    expect(Effect.isEffect(result)).toBe(true);
  });

  it("should return an Effect for getMediaInfo", () => {
    const result = httpClient.getMediaInfo("test_media_id");
    expect(Effect.isEffect(result)).toBe(true);
  });

  it("should return an Effect for downloadMedia", () => {
    const result = httpClient.downloadMedia("https://example.com/media/test.jpg");
    expect(Effect.isEffect(result)).toBe(true);
  });
});
