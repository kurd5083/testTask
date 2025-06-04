const nextConfig = {
   images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // Разрешает любые домены (небезопасно для продакшена!)
      },
    ],
  },

  async rewrites() {
    return [
      {
        source: "/api/:path*", // Все запросы, начинающиеся с `/api/`
        destination: "http://o-complex.com:1337/:path*", // Перенаправляем на API
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/api/:path*", // Применяем заголовки CORS к API-запросам
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value: "*", // Или ваш домен, например "http://localhost:3000"
          },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET, POST, PUT, DELETE, OPTIONS",
          },
          {
            key: "Access-Control-Allow-Headers",
            value: "Content-Type, Authorization",
          },
        ],
      },
    ];
  },
};

export default nextConfig;