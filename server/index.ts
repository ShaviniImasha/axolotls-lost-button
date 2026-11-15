import { createServer } from './server';
import dotenv from 'dotenv';

dotenv.config();

const port = process.env.PORT || 3001;
const app = createServer();

app.listen(port, () => {
  console.log(`Axolotl’s Lost Button Express Server running at http://localhost:${port}`);
});

