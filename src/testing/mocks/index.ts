//import { env } from '@/config/env';


const env=process.env;
export const enableMocking = async () => {
  if (process.env.ENABLE_API_MOCKING) {
    const { worker } = await import('./browser');
    const { initializeDb } = await import('./db');
    await initializeDb();
    return worker.start();
  }
};
