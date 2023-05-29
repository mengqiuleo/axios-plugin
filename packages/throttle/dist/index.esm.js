import axios from 'axios';

let reqList = [];
// let maxTime = 500 // 默认maxTime为500ms
// 过滤请求事件
const stopRepeatRequest = (maxTime, url, cancelFun) => {
    // url存在  更新 time
    if (reqList.length !== 0 && reqList.find(i => i.url === url)) {
        // 存在
        // 存在 并且 还不能进行下次点击
        let arr = reqList.filter(item => item.url === url && new Date().getTime() - item.time < maxTime);
        if (arr && arr.length !== 0) {
            cancelFun();
            return true;
        }
        else {
            // 存在能进行下一次点击  能进行接口连接
            reqList = reqList.map(i => {
                if (i.url === url) {
                    i.time = new Date().getTime();
                }
                return i;
            });
            return false;
        }
    }
    else {
        // 不存在直接添加 能进行接口连接
        reqList.push({
            url,
            time: new Date().getTime()
        });
        return false;
    }
};
// 接口请求完成后清除
const allowRequest = (maxTime) => {
    if (reqList.length) {
        // 只保留不能多次请求的接口
        reqList = reqList.filter(item => new Date().getTime() - item.time < maxTime);
    }
};
class ThrottlePlugin {
    constructor(options) {
        this.options = options;
        this.maxTime = options.maxTime || 500; //默认 500ms
    }
    created(axiosInstance, config) {
        axiosInstance.interceptors.request.use(config => {
            // 增加请求头
            config.headers["token"] = "631858809502165102";
            config.headers["authCode"] = "000001";
            config.headers["sysCode"] = "100003";
            let cancelFun = null;
            config.cancelToken = new axios.CancelToken(cancel => {
                cancelFun = cancel;
            });
            stopRepeatRequest(this.maxTime, config.url, cancelFun);
            console.log('throttlePlugin: request cancel');
            return config;
        }, error => {
            // Do something with request error
            return Promise.reject(error);
        });
        axiosInstance.interceptors.response.use(response => {
            // Do something before response is sent
            allowRequest(this.maxTime);
            return response;
        }, error => {
            // Do something with response error
            return Promise.reject(error);
        });
    }
}

export { ThrottlePlugin };
