/**
 * 微信登录授权
 */
export const wechatAuthorization = () => {
  // # 一级域名
  const baseHost = `mqsocial.com`;

  /**
   * 获取 微信 appid
   * @param {string} project 项目名
   */
  const getWechatAppId = (project) => {
    switch (project) {
      default:
        return ``;
    }
  };

  /**
   * 解析url
   */
  const parseUrl = () => {
    const { protocol, pathname, search, hash } = location;
    // # 生成路由地址
    let route = pathname.split("/").filter((p) => p != "");
    let options = {
      // 来源
      referrer: document.referrer,
    };
    // ? parse path
    switch (route.length) {
      case 1: // > 仅项目
        options.project = route[0];
        break;
      case 2: // > 项目加环境
        options.project = route[0];
        // 判断 route[1] 是 env 还是path
        if (/^:/.test(route[1])) {
          options.env = route[1].replace(/^:/, "");
        } else {
          options.path = route[1];
        }
        break;
      default:
        // > 其他情况
        if (route.length > 2) {
          options.project = route[0];
          // 判断 route[1] 是 env 还是path
          if (/^:/.test(route[1])) {
            options.env = route[1].replace(/^:/, "");
            // * path1/path2/path3 ...
            options.path = route.slice(2, route.length).join("/");
          } else {
            options.path = route.slice(1, route.length).join("/");
          }
        }
        break;
    }
    // # 解构 search query
    let searchQuery = (() => {
      if (!search || search.trim() == "") {
        return {};
      } else {
        // # 生成query
        let query = {};
        search
          .replace(/^\?/, "")
          .split("&")
          .filter((q) => q != "" && /=/.test(q))
          .forEach((q) => {
            let param = q.split(/=/);
            if (param.length > 2) {
              param = [param[0], param.slice(1, param.length).join("=")];
            }
            query[param[0]] = param[1];
          });

        return query;
      }
    })();
    // # 结构 hash query
    let hashQuery = (() => {
      if (!hash || hash.trim() == "") {
        return {};
      } else if (/&/.test(hash)) {
        // # 多参数hash
        let query = {};
        hash
          .replace(/^\#/, "")
          .split("&")
          .filter((q) => q != "" && /=/.test(q))
          .forEach((q) => {
            let param = q.split(/=/);
            if (param.length > 2) {
              param = [param[0], param.slice(1, param.length).join("=")];
            }
            // ! 多参数hash加上hash标识
            query[`hash.${param[0]}`] = param[1];
          });
        return query;
      } else {
        // # 单独hash value
        return {
          hash: hash.replace(/^#/, ""),
        };
      }
    })();
    // # merge query
    let query = { ...searchQuery, ...hashQuery };
    // ? parse code
    let code = query.code || null;
    // # 移除query.code
    if (query.code) delete query.code;
    // > merge options
    Object.assign(options, {
      code,
      query,
    });
    // 请求参数
    return {
      protocol, // 协议 :
      project: null,
      env: null,
      path: null,
      code: null,
      query: null, // 合并 search query 和 hash query
      ...options,
    };
  };
  /**
   * @format
   * json object fix util
   * @param str 需要修复的json字符串
   * @returns {Object|false} false情况属于字符串不是json对象时返回, 其他情况返回JSON.parse好的json对象.
   * @description 这是一个json字符串修复工具,用于修复被破坏的json对象
   * * 支持情况:
   * * 1. key 缺少双引号
   * * 2. json字符串存在逗号无法parse
   * * 3. json 字符串缺少外部大括号
   */
  const tryFixJsonObject = (str) => {
    if (/^{.+?}$/g.test(str)) {
      // 当前是json对象
      // fix object
      str = str
        .replace(/:"(.+?)"[,|\}]/gi, (origin, matched) => {
          // 修复 ,
          return origin.replace(matched, matched.replace(",", "%d")); // fix value by str has ','
        })
        .replace(/[\{|,](.+?):/g, (origin, matched) => {
          // 修复 key
          if (/^".+?"$/.test(matched)) {
            return origin;
          } else {
            return origin.replace(matched, `"${matched}"`);
          }
        })
        .replace(/(\"\w+\":)((?!\{).+?)([,|\}])/gim, function (
          origin,
          prefix,
          matched,
          suffix
        ) {
          if (
            matched != "null" &&
            matched != "true" &&
            matched != "false" &&
            matched != "null" &&
            isNaN(matched) &&
            !/^\".+?\"$/.test(matched)
          ) {
            return `${prefix}"${matched.replace(/"/g, '"')}"${suffix}`;
          } else {
            return origin;
          }
        });
    } else if (/.+?:.+?/.test(str)) {
      // 判断是否是json对象
      // 补全外部大括号
      return tryFixJsonObject(
        `{${str}}`.replace(/^\{\{/, "{").replace(/\}\}$/, "}")
      );
    } else {
      // 返回false,放弃修正
      return false;
    }
    let obj = JSON.parse(str);
    for (let key in obj) {
      if (typeof obj[key] == "string") {
        obj[key] = obj[key].replace("%d", ",");
      }
    }
    return obj;
  };

  // 解析url
  let options = parseUrl();
  // ? 判断是否包含code
  if (!options.code) {
    /* 不包含跳转微信获取code */
    // ? check
    if (!options.project) throw { errMsg: `target project is not defined.` };
    // # 合并访问地址到请求参数
    let query = {
      // # 访问地址
      visit: {
        protocol: options.protocol,
        project: options.project,
        env: options.env,
        path: options.path,
      },
      // # 参数
      params: options.query,
    };

    // - convert query
    let redirectUri = `${location.origin}?params=${encodeURIComponent(
      JSON.stringify(query)
    )}`;
    let appId = getWechatAppId(options.project);
    // > generate target link
    let targetLink = `https://open.weixin.qq.com/connect/oauth2/authorize?redirect_uri=${redirectUri}&appid=${appId}&response_type=code&scope=snsapi_userinfo#wechat_redirect`;
    // ! go to
    location.href = targetLink;
  } else {
    /* 包含,解构参数,跳转到目标项目 */
    // # decode
    let query = decodeURIComponent(options.query.params);
    // # fix json and convert to Object
    try {
      console.log("origin query:", query);
      // ? 如果json对象 双引号丢了,那么 尝试修复JSON
      query = tryFixJsonObject(query);
    } catch (error) {
      console.error(`转换json失败`);
      alert(`获取用户信息失败`);
    }
    // # 提取参数
    let { visit, params } = query;

    // ? parse query
    let { hash, search } = (() => {
      let searchArray = [];
      let hashArray = [];
      for (let k in params) {
        if (k == "hash") {
          hashArray.push(params[k]);
        } else if (/^hash\./.test(k)) {
          let key = k.replace(/^hash\./, "");
          hashArray.push(`${key}=${params[k]}`);
        } else {
          searchArray.push(`${k}=${params[k]}`);
        }
      }
      return {
        hash: hashArray.length > 0 ? hashArray.join("&") : null,
        search: searchArray.length > 0 ? searchArray.join("&") : null,
      };
    })();

    // - find visit query
    const { protocol, project, env, path } = visit;

    // # get code
    let code = options.code;

    // > generate target link
    let targetHost = baseHost.indexOf(".") == 0 ? baseHost : `.${baseHost}`;
    let targetEnv = env ? `.${env}` : "";
    let targetPath = path ? `/${path}` : "";
    let targetQuery = search
      ? `?${[`code=${code}`, search].join("&")}`
      : `?code=${code}`;
    let targetHash = hash ? `#${hash}` : "";
    let targetLink = "";
    // 生成目标地址
    if (
      /localhost/.test(env) ||
      /[0-255]\.[0-255]\.[0-255]\.[0-255]/.test(env)
    ) {
      // ? 判断目标地址是否是本地地址 或 ip
      targetLink = `http://${env}`;
    } else {
      // ? 判断目标环境是否是
      targetLink = `${protocol}//${project}${targetEnv}${targetHost}`;
    }
    let suffix = `${targetPath}${targetQuery}${targetHash}`;
    // ! go to
    location.href = targetLink + suffix;
  }
};
// exec
wechatAuthorization();
