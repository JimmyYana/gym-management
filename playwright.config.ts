import { defineConfig, devices } from "@playwright/test";

const mockUrl = "http://127.0.0.1:4191";

export default defineConfig({
  testDir: "./tests",
  workers: 1,
  use: { ...devices["Pixel 7"], baseURL: "http://127.0.0.1:4192" },
  webServer: [
    { command: "node tests/mockapi.mjs", url: `${mockUrl}/health` },
    {
      command: "npm run start -- --hostname 127.0.0.1 --port 4192",
      url: "http://127.0.0.1:4192/planes",
      env: { MOCKAPI_PLANES_URL: `${mockUrl}/planes`, MOCKAPI_MIEMBROS_URL: `${mockUrl}/miembros` },
    },
  ],
});
