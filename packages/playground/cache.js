module.exports = (req, res, next) => {
  res.header('Cache-Control', 'max-age=3600'); // 将缓存时间设置为一小时
  next();
};