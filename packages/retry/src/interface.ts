export interface RetryOptions {
  /**
   * 请求重试次数
   * @default 3 
   * @type {number}
   * @memberof RetryOptions
   */
  times?: number
  /**
   * 请求重试延迟时间，默认在 300ms 后重试
   * @default 300
   * @type {number}
   * @memberof RetryOptions
   */
  delay?: number
}
