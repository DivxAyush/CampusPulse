export const getHealthPayload = () => {
  const uptimeSeconds = Math.floor(process.uptime());
  const hours = Math.floor(uptimeSeconds / 3600);
  const minutes = Math.floor((uptimeSeconds % 3600) / 60);
  const seconds = uptimeSeconds % 60;
  const memory = process.memoryUsage();

  return {
    status: 'healthy',
    uptime: `${hours}h ${minutes}m ${seconds}s`,
    timestamp: new Date().toISOString(),
    service: 'Campus Plus API',
    environment: process.env.NODE_ENV || 'development',
    keepAlive: 'active',
    message: 'Campus Plus keep-alive pulse OK. Cold start prevented.',
    memoryUsage: {
      rss: `${Math.round(memory.rss / 1024 / 1024)} MB`,
      heapUsed: `${Math.round(memory.heapUsed / 1024 / 1024)} MB`,
    },
  };
};

