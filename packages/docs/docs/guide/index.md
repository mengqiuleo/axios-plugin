# @axios-plugin

![logo](../public/logo.svg)

## 概述

我希望将 `@axios-plugin` 称为一套 axios **请求层拦截器调度解决方案**。

它将项目中自定义封装的请求、响应拦截器进行解构，封装成一个插件，并且通过 `@axios-plugin/core` 将 axios 插件化，
之后就可以在插件化之后的 axios 实例身上挂载各种功能插件。

`@axios-plugin`针对诸如 Token 的添加，接口缓存、错误重试、响应状态码处理、超时处理等常见业务场景，提供了解决方案。另外当这些功能不满足你的需求时，可以通过[自定义插件](https://www.npmjs.com/package/@axios-plugin/core#自定义插件)的方式快速封装。


通过插件化的开发，可以实现所有**拦截器职责单一**、方便维护、并**统一维护**和**自动调度**，避免实际业务中对每个项目的重复封装。

## 如何运行的
在 `@axios-plugin/core` 内部，实现了一个 `AxiosPluginify` 类，并且通过向外暴露的 `pluginify` 函数，返回一个 `AxiosPluginify` 类的实例。
在 `AxiosPluginify` 类身上，有 `use` 方法，实现将传入的插件收集到数组中，以便挂载到 `axios` 实例上。
另外，该类还有 `generate` 方法，它会按照传入的插件顺序，依次将这些插件挂载到 传入的 `axios` 实例上，最后返回新的 `axios` 实例。

## 特性
- 按需加载
- 对插件解构，降低代码耦合度
- 提供常见拦截器插件
- 支持自定义插件
- 包装已有类库
- 灵活性高

## 已经支持的插件
- [@axios-plugin/cache](../plugin/cache.md)
- [@axios-plugin/interceptor](../plugin/interceptor.md)
- [@axios-plugin/retry](../plugin/retry.md)
- [@axios-plugin/throttle](../plugin/throttle.md)
- [@axios-plugin/timeout](../plugin/timeout.md)
- [@axios-plugin/download](../plugin/download.md)
- [@axios-plugin/token](../plugin/token.md)

## 灵感
偶然一次在掘金阅读了这篇文章：[从 13K 的前端开源项目我学到了啥？](https://juejin.cn/post/6876943860988772360)，
了解到 **插件化** 的架构设计，插件化的好处之一就是可以支持按需加载，此外把独立功能都拆分成独立的插件，会让核心系统更加稳定，拥有一定的健壮性。

## 关于插件化
插件化架构（Plug-in Architecture），是一种面向功能进行拆分的可扩展性架构，通常用于实现基于产品的应用。插件化架构模式允许你将其他应用程序功能作为插件添加到核心应用程序，从而提供可扩展性以及功能分离和隔离。

插件化架构模式包括两种类型的架构组件：核心系统（Core System）和插件模块（Plug-in modules）。应用逻辑被分割为独立的插件模块和核心系统，提供了可扩展性、灵活性、功能隔离和自定义处理逻辑的特性。

![pluginify](../public/pluginify.jpg)

图中 Core System 的功能相对稳定，不会因为业务功能扩展而不断修改，而插件模块是可以根据实际业务功能的需要不断地调整或扩展。 插件化架构的本质就是将可能需要不断变化的部分封装在插件中，从而达到快速灵活扩展的目的，而又不影响整体系统的稳定。

插件化架构的核心系统通常提供系统运行所需的最小功能集。插件模块是独立的模块，包含特定的处理、额外的功能和自定义代码，来向核心系统增强或扩展额外的业务能力。 通常插件模块之间也是独立的，也有一些插件是依赖于若干其它插件的。重要的是，尽量减少插件之间的通信以避免依赖的问题。

摘自 [从 13K 的前端开源项目我学到了啥？](https://juejin.cn/post/6876943860988772360)

## TODO
- 处理 ts 类型警告，而不是使用 @ts-ignore
-  支持可更换请求库，eg: fetch、xhr
-  开发自定义Plugin脚手架模板
-  增强拦截器调度
     -  处理拦截器失败的情况
     -  参考webpack插件机制tapable
     -  在插件中传递上下文ctx





## FAQ


### 插件的执行顺序是怎样的

`@axios-plugin` 会按照 `use` 方法的执行顺序来处理它们的挂载.

唯一需要注意的是 `axios` 的拦截器是栈结构, 也就是说**后挂载的拦截器先执行**.


### 我是否可以多次调用 `generate` 方法

可以, 不过 `@axios-plugin/core` 没有对 `beforeCreate` 和 `created` 所传入的参数做任何处理.

如果你在这些钩子函数中修改了传入钩子的参数, 则需要考虑这些插件在后续 `generate` 调用的时候的逻辑.

一个更加简单的方式是复用生产出的 `axios` 实例, 而不是多次调用 `generate` 方法.

## 技术栈
- TypeScript
- Jest
- Rollup
- Lerna
- VitePress


## 鸣谢


[设计一个可插拔的请求库?](https://juejin.cn/post/6960254713631604766#heading-14)

[如何优雅的管理 HTTP 请求和响应拦截器](https://www.yuque.com/wangpingan/cute-frontend/ocl9ah)

[axios-pluginify](https://github.com/uioz/axios-pluginify)

感谢各位前辈提供的思路和代码案例

