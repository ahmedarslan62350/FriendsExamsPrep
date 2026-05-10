import http from 'http';
import app from './app';
import { env, connectDB } from './config';

const server = http.createServer(app);

const startServer = async () => {
  try {
    // 1. Connect to Database
    await connectDB();

    // 2. Start Listening
    const PORT = env.port;
    server.listen(PORT, () => {
      console.log(`🚀 Server running in ${env.nodeEnv} mode on port ${PORT}`);
      console.log(`🔗 API Base: http://localhost:${PORT}/api/v1`);
    });

    // Handle unhandled rejections
    process.on('unhandledRejection', (err: Error) => {
      console.error('UNHANDLED REJECTION! 💥 Shutting down...');
      console.error(err.name, err.message);
      server.close(() => {
        process.exit(1);
      });
    });

    // Handle sigterm
    process.on('SIGTERM', () => {
      console.log('👋 SIGTERM RECEIVED. Shutting down gracefully');
      server.close(() => {
        console.log('💥 Process terminated!');
      });
    });

  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
