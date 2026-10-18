To read a TOML file with TypeScript, you must read the file contents as a string using Node.js filesystem tools and parse it into an object using a compliant TOML library like js-toml or smol-toml. Because TOML parsers return an un-typed object (any or unknown), you should explicitly define a TypeScript interface to enforce type safety.Here is a comprehensive guide to reading and parsing TOML files natively or via modern runtimes.Method 1: Reading Natively with Node.js & TypeScriptThis approach uses standard Node.js libraries and works inside any typical backend environment.1. Install DependenciesInstall the js-toml NPM package along with Node's type definitions:bashnpm install js-toml
npm install -D @types/node
Use code with caution.2. Create Your TOML File (config.toml)tomltitle = "Production Environment"

[database]
server = "192.168.1.1"
ports = [ 8001, 8002, 8003 ]
connection_max = 5000
enabled = true
Use code with caution.3. Read and Type-Cast the File (app.ts)typescriptimport * as fs from 'fs';
import * as path from 'path';
import { parse } from 'js-toml';

// 1. Define the interface matching your TOML structure
interface Config {
  title: string;
  database: {
    server: string;
    ports: number[];
    connection_max: number;
    enabled: boolean;
  };
}

try {
  // 2. Read the file synchronously from disk
  const filePath = path.join(__dirname, 'config.toml');
  const fileContent = fs.readFileSync(filePath, 'utf-8');

  // 3. Parse and type-cast the resulting object
  const config = parse(fileContent) as Config;

  // 4. Access variables with full TypeScript autocomplete
  console.log(`Title: ${config.title}`);
  console.log(`Database Port: ${config.database.ports[0]}`);
} catch (error) {
  console.error("Error reading or parsing TOML file:", error);
}
Use code with caution.Method 2: Importing TOML Directly via Modern RuntimesIf you are building your application with modern runtimes or bundlers, you can entirely bypass explicit file reading and import .toml files directly into your source code.Using Bun ⚡Bun natively supports TOML as a first-class module format. No dependencies or configuration updates are needed:typescript// app.ts
import config from "./config.toml";

console.log(config.database.server); 
Use code with caution.Note: To resolve TypeScript editor warnings, add @types/bun to your development dependencies.Using Deno 🦕Deno provides a dedicated formatting framework directly through its standard library. You can use the @std/toml package via JSR:typescriptimport { parse } from "jsr:@std/toml";

const text = await Deno.readTextFile("./config.toml");
const config = parse(text) as Config;
Use code with caution.Advanced: Enforcing Strict Run-time ValidationCasting your TOML contents via as Config only helps with compile-time type hinting; it will not protect your system if a field is structurally corrupt or missing at runtime. To ensure runtime protection, pass your parsed object through a validation library like Zod:typescriptimport { z } from 'zod';
import { parse } from 'js-toml';
import * as fs from 'fs';

const ConfigSchema = z.object({
  title: z.string(),
  database: z.object({
    server: z.string().ip(), // valid IP validation
    ports: z.array(z.number()),
    enabled: z.boolean(),
  }),
});

const rawText = fs.readFileSync('./config.toml', 'utf-8');
const rawParsed = parse(rawText);

// Safely parses and throws an informative error if schemas don't match
const secureConfig = ConfigSchema.parse(rawParsed); 
Use code with caution.Would you like to explore how to write/serialize data back into a TOML file, or would you prefer help setting up a tsconfig.json plugin to enable direct TOML imports in a Webpack/Vite frontend build?8 sitesParsing and serializing TOML - Deno DocsEdit on Github. TOML is a widely used configuration language designed to be feature-rich and intuitive to write. import { parse, s...DenoTypeScript - property does not exist on object after parsing with tomlAug 27, 2020 — You might be getting the error `Property 'modules' does not exist on type 'object'` because: * TypeScript can't infer the structur...Stack Overflowsapphi-red/typescript-plugin-toml - GitHubOct 31, 2023 — Usage * npm i -D typescript-plugin-toml # yarn add -D typescript-plugin-toml. * { "compilerOptions": { "plugins": [{ "name": "type...GitHubShow all
