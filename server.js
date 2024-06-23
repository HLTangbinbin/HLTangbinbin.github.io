import express from 'express';
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

app.use(
    '/api',
    createProxyMiddleware({
      target: 'https://data.stats.gov.cn',
        pathRewrite: {
            '^/api': '',
        },
        changeOrigin: true,
        onProxyRes: (proxyRes, req, res) => {
            console.log('proxy res here =====');
            proxyRes.headers['x-added'] = 'foobar';
        },
    }),
);

// 启动服务器
const port = 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});