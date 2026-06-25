import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import fs from "fs";
import path from "path";

// Vite plugin to act as a telemetry aggregation server
function telemetryServerPlugin() {
  return {
    name: 'telemetry-server',
    configureServer(server) {
      server.middlewares.use('/__telemetry', (req, res) => {
        if (req.method === 'POST') {
          let body = '';
          req.on('data', chunk => {
            body += chunk.toString();
          });
          req.on('end', () => {
            try {
              const payload = JSON.parse(body);
              const type = payload.type; // e.g., 'component_renders', 'hooks', 'routes', 'supabase'
              if (type && payload.data) {
                const logPath = path.resolve(process.cwd(), `runtime/${type}.jsonl`);
                fs.appendFileSync(logPath, JSON.stringify(payload.data) + '\n');
              }
              res.statusCode = 200;
              res.end('OK');
            } catch (err) {
              res.statusCode = 400;
              res.end('Bad Request');
            }
          });
        } else {
          res.statusCode = 405;
          res.end('Method Not Allowed');
        }
      });
    }
  };
}

export default defineConfig({
  plugins: [react({ jsxRuntime: 'classic' }), tailwindcss(), telemetryServerPlugin()],
  server: {
    watch: {
      ignored: ['**/runtime/**']
    }
  },
  build: {
    rollupOptions: {
      onwarn(warning, warn) {
        if (
          warning.code === "MODULE_LEVEL_DIRECTIVE" &&
          (warning.message.includes("use client") || warning.message.includes("Module level directives"))
        ) {
          return;
        }
        warn(warning);
      }
    }
  }
});
