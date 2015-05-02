var request = new XMLHttpRequest();
var token = document.querySelector('script[token]').getAttribute('token');
var flag = 'false'; //
console.log(token);

function toUrlEncoded(obj) {
  var urlEncoded = "";
  for (var key in obj) {
    urlEncoded += encodeURIComponent(key) + '=' + encodeURIComponent(obj[key]) + '&';
  }
  return urlEncoded;
}

window.onerror = function(msg, url, line, column, err) {
  console.log('Bingo' + err.stack);
  // console.log(err.stack.split(/^    at/gm));
  // console.log(err.stack.split(/\bat\b/g)[0]);
  // console.log(err.stack.split(/\bat\b/g)[1]);
  // console.log(err.stack.split(/\bat\b/g)[2]);
  var error = {
    msg: msg,
    url: url,
    line: line,
    column: column,
    token: token
  };
  request.onreadystatechange = function() {
      if (request.readyState == 4 && request.status == 200) {
        console.log(request.responseText);
        if (request.responseText === 'false') {
          var visitor = clientInfo(window);
          console.log(visitor);
          request.open('POST', 'http://192.168.0.168:5000/visitor', true);
          request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
          request.send(toUrlEncoded(visitor));
        }
      }
    }
    // request.open('POST', 'http://localhost:5000/error', true);
  request.open('POST', 'http://192.168.0.168:5000/error', true);
  request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  request.send(toUrlEncoded(error));

}

window.onevent = function(name, url, tag) {
  var _event = {
    name: name,
    url: url,
    token: token,
    tag: tag
  };
  request.open('POST', 'http://localhost:5000/error', true);
  request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  request.send(toUrlEncoded(_event));
}

window.onload = function() {
  console.log('load');
  throw new Error();
};

var clientInfo = function(window) {
  {
    var unknown = '-';

    // screen
    var screenSize = '';
    if (screen.width) {
      width = (screen.width) ? screen.width : '';
      height = (screen.height) ? screen.height : '';
      screenSize += '' + width + " x " + height;
    }

    //browser
    var nVer = navigator.appVersion;
    var nAgt = navigator.userAgent;
    var browser = navigator.appName;
    var version = '' + parseFloat(navigator.appVersion);
    var majorVersion = parseInt(navigator.appVersion, 10);
    var nameOffset, verOffset, ix;

    // Opera 8.0+ (UA detection to detect Blink/v8-powered Opera)
    var isOpera = !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;
    var isFirefox = typeof InstallTrigger !== 'undefined'; // Firefox 1.0+
    // At least Safari 3+: "[object HTMLElementConstructor]"
    var isSafari = Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0;
    var isChrome = !!window.chrome && !isOpera; // Chrome 1+
    var isIE = /*@cc_on!@*/ false || !!document.documentMode; // At least IE6

    switch (true) {
      case isFirefox:
        browser = 'Firefox';
        break;
      case isChrome:
        console.log('Chrome');
        browser = 'Chrome';
        break;
      case isSafari:
        console.log('Safari');
        browser = 'Safari';
        break;
      case isOpera:
        console.log('Opera');
        browser = 'Opera';
        break;
      case isIE:
        browser = 'IE';
        break;
      default:
        browser = 'undefined';
        break;
    }

    // Opera
    if ((verOffset = nAgt.indexOf('Opera')) != -1) {
      // browser = 'Opera';
      version = nAgt.substring(verOffset + 6);
      if ((verOffset = nAgt.indexOf('Version')) != -1) {
        version = nAgt.substring(verOffset + 8);
      }
    }
    // MSIE
    else if ((verOffset = nAgt.indexOf('MSIE')) != -1) {
      version = nAgt.substring(verOffset + 5);
    }
    // Chrome
    else if ((verOffset = nAgt.indexOf('Chrome')) != -1) {
      version = nAgt.substring(verOffset + 7);
    }
    // Safari
    else if ((verOffset = nAgt.indexOf('Safari')) != -1) {
      version = nAgt.substring(verOffset + 7);
      if ((verOffset = nAgt.indexOf('Version')) != -1) {
        version = nAgt.substring(verOffset + 8);
      }
    }
    // Firefox
    else if ((verOffset = nAgt.indexOf('Firefox')) != -1) {
      version = nAgt.substring(verOffset + 8);
    }
    // MSIE 11+
    else if (nAgt.indexOf('Trident/') != -1) {
      version = nAgt.substring(nAgt.indexOf('rv:') + 3);
    }

    // trim the version string
    if ((ix = version.indexOf(';')) != -1) version = version.substring(0, ix);
    if ((ix = version.indexOf(' ')) != -1) version = version.substring(0, ix);
    if ((ix = version.indexOf(')')) != -1) version = version.substring(0, ix);

    majorVersion = parseInt('' + version, 10);
    if (isNaN(majorVersion)) {
      version = '' + parseFloat(navigator.appVersion);
      majorVersion = parseInt(navigator.appVersion, 10);
    }

    // mobile version
    var mobile = /Mobile|mini|Fennec|Android|iP(ad|od|hone)/.test(nVer);

    // cookie
    var cookieEnabled = (navigator.cookieEnabled) ? true : false;

    if (typeof navigator.cookieEnabled == 'undefined' && !cookieEnabled) {
      document.cookie = 'testcookie';
      cookieEnabled = (document.cookie.indexOf('testcookie') != -1) ? true : false;
    }

    // system
    var os = unknown;
    var clientStrings = [{
      s: 'Windows 3.11',
      r: /Win16/
    }, {
      s: 'Windows 95',
      r: /(Windows 95|Win95|Windows_95)/
    }, {
      s: 'Windows ME',
      r: /(Win 9x 4.90|Windows ME)/
    }, {
      s: 'Windows 98',
      r: /(Windows 98|Win98)/
    }, {
      s: 'Windows CE',
      r: /Windows CE/
    }, {
      s: 'Windows 2000',
      r: /(Windows NT 5.0|Windows 2000)/
    }, {
      s: 'Windows XP',
      r: /(Windows NT 5.1|Windows XP)/
    }, {
      s: 'Windows Server 2003',
      r: /Windows NT 5.2/
    }, {
      s: 'Windows Vista',
      r: /Windows NT 6.0/
    }, {
      s: 'Windows 7',
      r: /(Windows 7|Windows NT 6.1)/
    }, {
      s: 'Windows 8.1',
      r: /(Windows 8.1|Windows NT 6.3)/
    }, {
      s: 'Windows 8',
      r: /(Windows 8|Windows NT 6.2)/
    }, {
      s: 'Windows NT 4.0',
      r: /(Windows NT 4.0|WinNT4.0|WinNT|Windows NT)/
    }, {
      s: 'Windows ME',
      r: /Windows ME/
    }, {
      s: 'Android',
      r: /Android/
    }, {
      s: 'Open BSD',
      r: /OpenBSD/
    }, {
      s: 'Sun OS',
      r: /SunOS/
    }, {
      s: 'Linux',
      r: /(Linux|X11)/
    }, {
      s: 'iOS',
      r: /(iPhone|iPad|iPod)/
    }, {
      s: 'Mac OS X',
      r: /Mac OS X/
    }, {
      s: 'Mac OS',
      r: /(MacPPC|MacIntel|Mac_PowerPC|Macintosh)/
    }, {
      s: 'QNX',
      r: /QNX/
    }, {
      s: 'UNIX',
      r: /UNIX/
    }, {
      s: 'BeOS',
      r: /BeOS/
    }, {
      s: 'OS/2',
      r: /OS\/2/
    }, {
      s: 'Search Bot',
      r: /(nuhk|Googlebot|Yammybot|Openbot|Slurp|MSNBot|Ask Jeeves\/Teoma|ia_archiver)/
    }];
    for (var id in clientStrings) {
      var cs = clientStrings[id];
      if (cs.r.test(nAgt)) {
        os = cs.s;
        break;
      }
    }

    var osVersion = unknown;

    if (/Windows/.test(os)) {
      osVersion = /Windows (.*)/.exec(os)[1];
      os = 'Windows';
    }

    switch (os) {
      case 'Mac OS X':
        osVersion = /Mac OS X (10[\.\_\d]+)/.exec(nAgt)[1];
        break;

      case 'Android':
        osVersion = /Android ([\.\_\d]+)/.exec(nAgt)[1];
        break;

      case 'iOS':
        osVersion = /OS (\d+)_(\d+)_?(\d+)?/.exec(nVer);
        osVersion = osVersion[1] + '.' + osVersion[2] + '.' + (osVersion[3] | 0);
        break;
    }

    // flash (you'll need to include swfobject)
    /* script src="//ajax.googleapis.com/ajax/libs/swfobject/2.2/swfobject.js" */
    var flashVersion = 'no check';
    if (typeof swfobject != 'undefined') {
      var fv = swfobject.getFlashPlayerVersion();
      if (fv.major > 0) {
        flashVersion = fv.major + '.' + fv.minor + ' r' + fv.release;
      } else {
        flashVersion = unknown;
      }
    }
  }

  return window.jscd = {
    browser: browser,
    browserVersion: version,
    OS: os,
    OS_Version: osVersion,
    mobile: mobile,
    cookies: cookieEnabled,
    flashVersion: flashVersion,
    viewport: screenSize
  };
}

// throw new Error();
