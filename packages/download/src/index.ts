// @ts-ignore
import { AxiosPlugin } from "@axios-plugin/core";
import { AxiosInstance } from 'axios';

export class DownLoadPlugin implements AxiosPlugin {
  constructor(public filename?: string){
    this.filename = filename || "filename"
  }
  created(axios: AxiosInstance) {
    axios.interceptors.response.use(
      response => {
        const contentType = response.headers["content-type"];
        if (contentType === "application/octet-stream" || contentType.startsWith("application/")) {
          const blob = new Blob([response.data]);
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.download = this.filename; // 设置下载文件名
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url); // 释放 URL 对象
        }
        return response;
      },
      error => {
        return Promise.reject(error);
      }
    );
  }
}