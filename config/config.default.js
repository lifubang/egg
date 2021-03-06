'use strict';

const fs = require('fs');
const path = require('path');

module.exports = appInfo => {
  // appInfo contains name, baseDir, env, HOME, and pkg

  const appRoot = appInfo.env === 'local' || appInfo.env === 'unittest' ? appInfo.baseDir : appInfo.HOME;

  const exports = {

    /**
     * runtime env
     * @member {String} Config#env
     * @since 1.0.0
     */
    env: appInfo.env,

    /**
     * app name
     * @member {String} Config#name
     * @since 1.0.0
     */
    name: appInfo.name,

    /**
     * Should set by every app itself
     * @member {String} Config#keys
     * @since 1.0.0
     */
    keys: '',

    /**
     * Detect request, protocol header, case sensitive.
     * If your app behind a proxy, like nginx, maybe you should set it to `x-forwarded-proto`
     * @member {String} Config#protocolHeaders
     * @since 1.0.0
     */
    protocolHeaders: '',

    /**
     * package.json object
     * @member {Object} Config#pkg
     * @since 1.0.0
     */
    pkg: appInfo.pkg,

    /**
     * app base dir
     * @member {String} Config#baseDir
     * @since 1.0.0
     */
    baseDir: appInfo.baseDir,

    /**
     * current user HOME dir
     * @member {String} Config#HOME
     * @since 1.0.0
     */
    HOME: appInfo.HOME,

    /**
     * store runtime info dir
     * @member {String} Config#rundir
     * @since 1.0.0
     * @private
     */
    rundir: path.join(appInfo.baseDir, 'run'),
  };

  /**
   * notfound 中间件 options
   *
   * 指定应用 404 页面
   *
   * 只有在 `enableRedirect === true && pageUrl` 才会真正 302 跳转到友好的404页面。
   *
   * @member Config#notfound
   * @property {String} pageUrl - 默认为空，不设置全局统一 404 页面
   * @property {Boolean} enableRedirect - 是否跳转到 global404Url，默认在 local 为 false，其他为 true
   * ```
   */
  exports.notfound = {
    pageUrl: '',
    enableRedirect: appInfo.env === 'prod',
  };

  /**
   * siteFile options
   * @member Config#siteFile
   * key 值为 path，若 value 为 url，则 redirect，若 value 为文件 buffer，则直接返回此文件
   * @example
   *  - 指定应用 favicon, => '/favicon.ico': 'https://eggjs.org/favicon.ico',
   *  - 指定应用 crossdomain.xml, => '/crossdomain.xml': fs.readFileSync('path_to_file')
   *  - 指定应用 robots.txt, => '/robots.txt': fs.readFileSync('path_to_file')
   *
   * ```js
   * exports.siteFile = {
   *   '/favicon.ico': 'https://eggjs.org/favicon.ico',
   * };
   */
  exports.siteFile = {
    '/favicon.ico': fs.readFileSync(path.join(__dirname, 'favicon.png')),
  };

  /**
   * bodyParser options
   * @member Config#bodyParser
   * @property {String} encoding - body 的编码格式，默认为 utf8
   * @property {String} formLimit - form body 的大小限制，默认为 100kb
   * @property {String} jsonLimit - json body 的大小限制，默认为 100kb
   * @property {Boolean} strict - json body 解析是否为严格模式，如果为严格模式则只接受 object 和 array
   * @property {Number} queryString.arrayLimit - 表单元素数组长度限制，默认 100，否则会转换为 json 格式
   * @property {Number} queryString.depth - json 数值深度限制，默认 5
   * @property {Number} queryString.parameterLimit - 参数个数限制，默认 1000
   */
  exports.bodyParser = {
    encoding: 'utf8',
    formLimit: '100kb',
    jsonLimit: '100kb',
    strict: true,
    // @see https://github.com/hapijs/qs/blob/master/lib/parse.js#L8 for more options
    queryString: {
      arrayLimit: 100,
      depth: 5,
      parameterLimit: 1000,
    },
  };

  /**
   * logger options
   * @member Config#logger
   * @property {String} dir - 日志存储目录
   * @property {String} rotateLogDirs - 自动按日切割的目录
   * @property {String} encoding - 日志文件编码，预发和生产环境默认是 gbk，其他环境是 utf8
   * @property {String} level - 默认保存的日志级别，可选值: DEBUG, INFO, WARN, ERROR, NONE, 生产环境默认 INFO
   * @property {String} env - 运行环境，等价于 antx.env
   * @property {String} consoleLevel - 默认输出到标准输出的日志级别，本地开发环境默认是 INFO，单元测试 WARN，其他环境都是 NONE
   * @property {Boolean} outputJSON - 是否输出 json 格式的日志，用于阿里监控。除非你明确知道自己想做什么，其他情况都不要配置
   * @property {Boolean} buffer - 是否开启磁盘写入缓存，默认 true
   * @property {String} errorLogName - 异常日志文件名
   * @property {String} coreLogName - egg core 日志文件名
   * @property {String} agentLogName - agent worker 进程日志文件名
   * @property {Object} coreLogger - core logger 的自定义配置
   */
  exports.logger = {
    dir: path.join(appRoot, 'logs', appInfo.name),
    rotateLogDirs: [ path.join(appRoot, 'logs', appInfo.name) ],
    encoding: 'utf8',
    env: appInfo.env,
    level: 'INFO',
    consoleLevel: 'INFO',
    outputJSON: false,
    buffer: true,
    appLogName: `${appInfo.name}-web.log`,
    coreLogName: 'egg-web.log',
    agentLogName: 'egg-agent.log',
    errorLogName: 'common-error.log',
    coreLogger: {},
  };

  /**
   * urllib options
   * @member Config#urllib
   * @property {Boolean} keepAlive - 是否开启 http keepalive, 默认是 true
   * @property {Integer} keepAliveTimeout - socket 最长空闲时间, 单位毫秒, 默认是 30000 毫秒
   * @property {Integer} timeout - socket 最长不活跃时间, 单位毫秒, 默认是 30000 毫秒
   * @property {Integer} maxSockets - 对单个 host 的最大 socket 数, 默认是 Infinity 无限制
   * @property {Integer} maxFreeSockets - 对单个 host 的最大空闲 socket 数, 默认是 256
   */
  exports.urllib = {
    keepAlive: true,
    keepAliveTimeout: 30000,
    timeout: 30000,
    maxSockets: Infinity,
    maxFreeSockets: 256,
  };

  /**
   * 定义 core 中间件加载的顺序，中间件的名称会映射到 app.middlewares 上
   * @member {Array} Config#middleware
   */
  exports.coreMiddleware = [
    'meta',
    'siteFile',
    'notfound',
    'bodyParser',
    'overrideMethod',
  ];

  /**
   * jsonp options
   * @member Config#jsonp
   * @property {String} callback - jsonp 的 callback 方法参数名，默认为 `_callback`
   * @property {Number} limit - callback 方法名称最大长度，默认为 `50`
   */
  exports.jsonp = {
    callback: '_callback',
    limit: 50,
  };

  /**
   * emit `startTimeout` if worker don't ready after `workerStartTimeout` ms
   * @member {Number} Config.workerStartTimeout
   */
  exports.workerStartTimeout = 10 * 60 * 1000;

  return exports;
};
