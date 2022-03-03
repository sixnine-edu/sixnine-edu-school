/*
 * @Description: 
 * @Version: 1.0
 * @Autor: yongqing
 * @Date: 2021-12-07 09:40:11
 * @LastEditors: yongqing
 * @LastEditTime: 2021-12-17 10:49:43
 */
/**
 * 动态加载初始资源
 */
; (function () {
  var resList = {
    icon: window.SITE_CONFIG.cdnUrl + '/static/img/favicon.ico',
    css: [
      window.SITE_CONFIG.cdnUrl + '/static/css/app.css',
    ],
    js: [
      // 插件, 放置业务之前加载, 以免业务需求依赖插件时, 还未加载出错
      // 插件 - echarts
      'https://cdn.bootcss.com/echarts/4.8.0/echarts.min.js',

      // 插件 - tinymce
      'https://cdn.bootcss.com/tinymce/4.9.4/tinymce.min.js',
      'https://cdn.bootcdn.net/ajax/libs/d3/5.16.0/d3.min.js',
      window.SITE_CONFIG.cdnUrl + '/static/plugins/echarts-4.8.0/walden.js',
      window.SITE_CONFIG.cdnUrl + '/static/plugins/echarts-4.8.0/map.china.js',
      window.SITE_CONFIG.cdnUrl + '/static/plugins/tinymce.4.9.4/zh_CN.js',
      
      window.SITE_CONFIG.cdnUrl + '/static/plugins/aliyun-upload-sdk-1.5.0/lib/es6-promise.min.js',
      window.SITE_CONFIG.cdnUrl + '/static/plugins/aliyun-upload-sdk-1.5.0/lib/aliyun-oss-sdk-5.3.1.min.js',
      window.SITE_CONFIG.cdnUrl + '/static/plugins/aliyun-upload-sdk-1.5.0/aliyun-upload-sdk-1.5.0.min.js',

      // 业务
      window.SITE_CONFIG.cdnUrl + '/static/js/manifest.js',
      window.SITE_CONFIG.cdnUrl + '/static/js/vendor.js',
      window.SITE_CONFIG.cdnUrl + '/static/js/app.js'
    ]
  };

  // 图标
  (function () {
    var _icon = document.createElement('link');
    _icon.setAttribute('rel', 'shortcut icon');
    _icon.setAttribute('type', 'image/x-icon');
    _icon.setAttribute('href', resList.icon);
    document.getElementsByTagName('head')[0].appendChild(_icon);
  })();

  // 样式
  (function () {
    document.getElementsByTagName('html')[0].style.opacity = 0;
    var i = 0;
    var _style = null;
    var createStyles = function () {
      if (i >= resList.css.length) {
        document.getElementsByTagName('html')[0].style.opacity = 1;
        return;
      }
      _style = document.createElement('link');
      _style.href = resList.css[i];
      _style.setAttribute('rel', 'stylesheet');
      _style.onload = function () {
        i++;
        createStyles();
      }
      document.getElementsByTagName('head')[0].appendChild(_style);
    }
    createStyles();
  })();

  // 脚本
  document.onreadystatechange = function () {
    if (document.readyState === 'interactive') {
      var i = 0;
      var _script = null;
      var createScripts = function () {
        if (i >= resList.js.length) {
          return;
        }
        _script = document.createElement('script');
        _script.src = resList.js[i];
        _script.onload = function () {
          i++;
          createScripts();
        }
        document.getElementsByTagName('body')[0].appendChild(_script);
      }
      createScripts();
    }
  };
})();
