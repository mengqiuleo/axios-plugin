import { AxiosPlugin } from '@axios-plugin/core';
import { AxiosInstance, AxiosRequestConfig } from 'axios';

interface Options {
    cloneData?: boolean;
    cleanupInterval?: number;
    maxEntries?: number;
}
declare enum StorageType {
    MemoryStorage = "MemoryStorage",
    LocalStorage = "LocalStorage",
    SessionStorage = "SessionStorage"
}
/**
 * 使用这些可选参数可以根据具体的应用场景来优化缓存设置。
 * 例如，如果你的缓存中的数据比较大或者需要保证缓存数据的独立性，可以将cloneData设置为true；
 * 如果你希望定期清理过期的缓存数据，可以设置cleanupInterval；
 * 如果你希望避免缓存占用过多内存，可以设置maxEntries。
 *
 * cloneData 的场景在 https://github.com/arthurfiorette/axios-cache-interceptor/issues/163，数据过多，后面同名的进行覆盖，导致存储数据出错
 */
declare class CachePlugin implements AxiosPlugin {
    memory: StorageType;
    options?: Options;
    constructor(memory: StorageType, options?: Options);
    created(axiosInstance?: AxiosInstance, config?: AxiosRequestConfig): void;
}

export { CachePlugin, Options, StorageType };
