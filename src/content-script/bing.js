;(function () {
  function i(n, t, i) {
    for (var r = 0; r < t.length; r++)
      if (
        (i === 'C' && n.toUpperCase().indexOf(t[r].toUpperCase()) === 0) ||
        (i === 'S' && n.toUpperCase().indexOf(t[r].toUpperCase()) >= 0)
      )
        return !0
    return !1
  }
  function o(n, t, i) {
    // sj_log('CI.AdPrevention', n, t + ':' + i)
  }
  function s(n) {
    while (n && n.tagName !== 'BODY' && f.length > 0) {
      if (
        f.indexOf(n.id) > -1 ||
        (n.className &&
          (n.className.indexOf('lpc_ip_root_class') >= 0 || n.className.indexOf('ms-Layer') >= 0))
      )
        return !0
      n = n.parentNode
    }
    return !1
  }
  function n(n, t, i) {
    n.parentNode &&
      n.parentNode.nodeType === 1 &&
      (n.tagName == 'IFRAME' || (n.nodeType === 1 && n.offsetWidth && n.offsetWidth > 20)) &&
      ((t += 'D'), n.parentNode.removeChild(n), o(t, n.tagName, i))
  }
  function h(r) {
    r.src &&
      ((t.href = r.src),
      window.location.hostname.indexOf(t.hostname) < 0 &&
        !i(t.hostname, l, 'S') &&
        n(r, 'RS', t.hostname))
  }
  function c(t) {
    var r = t.className,
      u = r && r.trim()
    !u || u.indexOf('b_') === 0 || i(u, a, 'C') || s(t) || n(t, 'RC', r)
  }
  function r(t) {
    var i = window.location.pathname,
      r
    try {
      window.MutationObserver != undefined &&
      (typeof MutationObserver != 'function' ||
        MutationObserver.toString().indexOf('[native code]') < 0)
        ? sj_log('CI.AdPrevention', 'MutationObserver overrided', 'true')
        : (window.MutationObserver || window.WebKitMutationObserver) &&
          typeof MutationObserver == 'function'
        ? i &&
          (i.toUpperCase() === '/SEARCH' ||
            i.toUpperCase() === '/' ||
            i.toUpperCase() === '/MAPS') &&
          ((r = new MutationObserver(function (t) {
            var f, r, e, i
            if (t)
              for (f = 0; f < t.length; f++)
                if (((r = t[f].addedNodes), r && r.length))
                  for (e = 0; e < r.length; e++) {
                    i = r[e]
                    switch (i.tagName) {
                      case 'IFRAME':
                      case 'IMG':
                      case 'SCRIPT':
                      case 'LINK':
                        h(i)
                        break
                      case 'DIV':
                      case 'LI':
                        c(i)
                        break
                      case 'OBJECT':
                        i.type &&
                          i.type.indexOf('flash') >= 0 &&
                          n(i, 'RN', i.outerHTML.substr(0, u))
                        break
                      case 'CENTER':
                        n(i, 'RN', i.outerHTML.substr(0, u))
                        break
                      default:
                        return
                    }
                  }
          })),
          r.observe(t, {
            childList: !0,
            subtree: !0,
          }))
        : sj_log('CI.AdPrevention', 'MutationObserver not available', 'true')
    } catch (f) {
      sj_log('CI.AdPrevention', 'error_creating_dom_observer', f.name)
    }
  }
  var t = sj_ce('a'),
    u = 100,
    l = _w.APD ? _w.APD.slice() : [],
    a = _w.APC ? _w.APC.slice() : [],
    f = _w.APN ? _w.APN.slice() : [],
    e
  r(document.getElementsByTagName('head')[0])
  e = function () {
    r(document.getElementsByTagName('body')[0])
  }
  window.addEventListener('load', e)
})()
