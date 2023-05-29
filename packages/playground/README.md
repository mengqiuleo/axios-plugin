# playground
json-server --watch db.json

  http://localhost:3000/posts
  http://localhost:3000/comments
  http://localhost:3000/profile

在浏览器中访问http://localhost:3000/posts，即可查看到以JSON格式展示的用户数据。


playground 所有命令都要在 该文件夹下执行


## 测试缓存
json-server 可以控制响应头中的缓存机制。默认情况下，json-server 返回的响应头中包含 Cache-Control: no-cache, no-store, must-revalidate 指令，这表示浏览器不应该缓存响应结果。

要控制返回的响应头中的缓存机制，您可以在运行 json-server 时使用 --middlewares 标志指定一个自定义的中间件函数。以下是一个示例实现：
```js
module.exports = (req, res, next) => {
  res.header('Cache-Control', 'max-age=3600'); // 将缓存时间设置为一小时
  next();
};
```
这个中间件会将响应头中的 Cache-Control 字段设置为 max-age=3600，表示浏览器可以缓存响应结果并在一小时内重复使用该缓存。

然后，在运行 json-server 时，您可以将这个自定义中间件传递给 --middlewares 标志，例如：
```js
json-server --watch db.json --middlewares ./cache.js
```