/*
 * @Description:
 * @Version: 1.0
 * @Autor: yongqing
 * @Date: 2020-12-07 09:40:11
 * @LastEditors: yongqing
 * @LastEditTime: 2020-12-16 21:42:24
 */
/**
 * 开发环境
 */
; (function () {
  window.SITE_CONFIG = {}

  // api接口请求地址
  window.SITE_CONFIG['baseUrl'] = 'http://106.14.157.243:8113'
  // 静态资源文件url
  window.SITE_CONFIG['resourcesUrl'] = ''
  // cdn地址 = 域名 + 版本号
  window.SITE_CONFIG['domain'] = './' // 域名T
  window.SITE_CONFIG['version'] = ''   // 版本号(年月日时分)
  window.SITE_CONFIG['cdnUrl'] = window.SITE_CONFIG.domain + window.SITE_CONFIG.version
})()
