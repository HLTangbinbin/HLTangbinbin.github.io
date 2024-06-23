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
        onProxyRes: (proxyRes, req, res, next) => {
            console.log('proxy res here =====');
            proxyRes.headers['x-added'] = 'foobar';
            res.header("Access-Control-Allow-Origin", "https://hltangbinbin.github.io");
            res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
            res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
            next();
        },
        
    }),
    
);

// 启动服务器
const port = 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});