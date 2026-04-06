# statisticalbureau

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Local JSON debug switch
开发环境默认读取 `public/json/*.json`。

如需临时切回云端 `/resource`：
```
http://localhost:8080/?dataSource=cloud
```

如需再次切回本地：
```
http://localhost:8080/?dataSource=local
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
