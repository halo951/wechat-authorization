# wechat-authorization

### description
>  微信授权接口统一入口. 
> 授权域名 `littleprince.authorization.mqsocial.com`

## usage

1. 配置 `appid`,`项目名`
- // 添加 [main.js](./src/main.js#L10)  **获取 微信 appid** 方法 `case`.
- 例:
```
    switch (project) {
    case "project name":
        return "xxxxxxx";
    }
```
2. 根据需求创建访问路径,参考 [参数解释](###参数解释),和 [demo](###DEMO).

3. 在目标地址 读取`code`,如果`code`不存在,就执行跳转授权域名方法.


### 参数解释
> `[:protocol]://authorization.[:baseHost]/[:project]/[:env]/[:path]?[:query]#[:hash]`
1. `protocol` http 协议 可选 `http` 或 `https`. 备注:如果访问使用的`https:` 那么回调网址也是`https`
2. `baseHost` 一级域名
3. `project` 项目名
4. `env` 环境名,需要加上前缀,例 `:pro`、`:test`, 如果生产环境不带 env参数,可以忽略. 
5. `path` 跳转后的目标路径
6. `query` 请求携带的 get 参数
7. `hash` 请求携带的 hash 参数

#### 注意事项.

1. 不要使用 `params` 作为变量名.
2. 环境名 需要加上前缀变量 `:[env name]`.

---
### DEMO

1. **basic**
    1. `visit` http://authorization.host.com/agent
    2. `target` http://agent.host.com?code=xxx

2. **env**
    1. `visit` http://authorization.host.com/agent/:test
    2. `target` http://agent.test.host.com?code=xxx

4. **https**
    1. `visit` https://authorization.host.com/agent
    2. `target` https://agent.host.com?code=xxx

5. **携带 path**
    1. ***带env***
        - `visit` http://authorization.host.com/agent/:test/a/b/c
        - `target` http://agent.test.host.com/a/b/c?code=xxx
    2. ***忽略env***
        - `visit` http://authorization.host.com/agent/a/b/c
        - `target` http://agent.host.com/a/b/c?code=xxx

6. **局域网及本地ip测试**
    1. ***本机***
        - `visit` http://authorization.host.com/:localhost/a/b/c
        - `target` http://localhost/a/b/c?code=xxx
    2. ***局域网***
        - `visit` http://authorization.host.com/:192.168.1.1/a/b/c
        - `target` http://192.168.1.1/a/b/c?code=xxx
    2. ***局域网:端口号***
        - `visit` http://authorization.host.com/:192.168.1.1:8080/a/b/c
        - `target` http://192.168.1.1:8080/a/b/c?code=xxx

6. **带参复杂路径示例**
    1. `visit` https://authorization.host.com/agent/:test/game/enter?q1=a&q2=b#h1=a&h2=b 
    2. `target` https://agent.test.host.com/game/enter?q1=a&q2=b&code=xxx#h1=a&h2=b 

---

### 调试相关

1. 本地调试 `yarn serve`

2. 编译 `yarn build`


## 更新日志

> Time:2019年12月19日 14:59:23
1. 使用 `webpack` 重写

> Time:2019-3-4 18:49:56

1. 增加 localhost 解析,获取 code 后,返回 localhost

2. fix bug.
