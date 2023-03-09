"use strict";
(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __esm = (fn2, res) => function __init() {
    return fn2 && (res = (0, fn2[__getOwnPropNames(fn2)[0]])(fn2 = 0)), res;
  };
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // node_modules/.pnpm/preact@10.11.3/node_modules/preact/dist/preact.module.js
  function s(n2, l3) {
    for (var u3 in l3)
      n2[u3] = l3[u3];
    return n2;
  }
  function a(n2) {
    var l3 = n2.parentNode;
    l3 && l3.removeChild(n2);
  }
  function h(l3, u3, i3) {
    var t3, o4, r3, f3 = {};
    for (r3 in u3)
      "key" == r3 ? t3 = u3[r3] : "ref" == r3 ? o4 = u3[r3] : f3[r3] = u3[r3];
    if (arguments.length > 2 && (f3.children = arguments.length > 3 ? n.call(arguments, 2) : i3), "function" == typeof l3 && null != l3.defaultProps)
      for (r3 in l3.defaultProps)
        void 0 === f3[r3] && (f3[r3] = l3.defaultProps[r3]);
    return v(l3, f3, t3, o4, null);
  }
  function v(n2, i3, t3, o4, r3) {
    var f3 = { type: n2, props: i3, key: t3, ref: o4, __k: null, __: null, __b: 0, __e: null, __d: void 0, __c: null, __h: null, constructor: void 0, __v: null == r3 ? ++u : r3 };
    return null == r3 && null != l.vnode && l.vnode(f3), f3;
  }
  function y() {
    return { current: null };
  }
  function p(n2) {
    return n2.children;
  }
  function d(n2, l3) {
    this.props = n2, this.context = l3;
  }
  function _(n2, l3) {
    if (null == l3)
      return n2.__ ? _(n2.__, n2.__.__k.indexOf(n2) + 1) : null;
    for (var u3; l3 < n2.__k.length; l3++)
      if (null != (u3 = n2.__k[l3]) && null != u3.__e)
        return u3.__e;
    return "function" == typeof n2.type ? _(n2) : null;
  }
  function k(n2) {
    var l3, u3;
    if (null != (n2 = n2.__) && null != n2.__c) {
      for (n2.__e = n2.__c.base = null, l3 = 0; l3 < n2.__k.length; l3++)
        if (null != (u3 = n2.__k[l3]) && null != u3.__e) {
          n2.__e = n2.__c.base = u3.__e;
          break;
        }
      return k(n2);
    }
  }
  function b(n2) {
    (!n2.__d && (n2.__d = true) && t.push(n2) && !g.__r++ || o !== l.debounceRendering) && ((o = l.debounceRendering) || setTimeout)(g);
  }
  function g() {
    for (var n2; g.__r = t.length; )
      n2 = t.sort(function(n3, l3) {
        return n3.__v.__b - l3.__v.__b;
      }), t = [], n2.some(function(n3) {
        var l3, u3, i3, t3, o4, r3;
        n3.__d && (o4 = (t3 = (l3 = n3).__v).__e, (r3 = l3.__P) && (u3 = [], (i3 = s({}, t3)).__v = t3.__v + 1, j(r3, t3, i3, l3.__n, void 0 !== r3.ownerSVGElement, null != t3.__h ? [o4] : null, u3, null == o4 ? _(t3) : o4, t3.__h), z(u3, t3), t3.__e != o4 && k(t3)));
      });
  }
  function w(n2, l3, u3, i3, t3, o4, r3, c3, s3, a3) {
    var h3, y3, d3, k4, b3, g4, w4, x4 = i3 && i3.__k || e, C3 = x4.length;
    for (u3.__k = [], h3 = 0; h3 < l3.length; h3++)
      if (null != (k4 = u3.__k[h3] = null == (k4 = l3[h3]) || "boolean" == typeof k4 ? null : "string" == typeof k4 || "number" == typeof k4 || "bigint" == typeof k4 ? v(null, k4, null, null, k4) : Array.isArray(k4) ? v(p, { children: k4 }, null, null, null) : k4.__b > 0 ? v(k4.type, k4.props, k4.key, k4.ref ? k4.ref : null, k4.__v) : k4)) {
        if (k4.__ = u3, k4.__b = u3.__b + 1, null === (d3 = x4[h3]) || d3 && k4.key == d3.key && k4.type === d3.type)
          x4[h3] = void 0;
        else
          for (y3 = 0; y3 < C3; y3++) {
            if ((d3 = x4[y3]) && k4.key == d3.key && k4.type === d3.type) {
              x4[y3] = void 0;
              break;
            }
            d3 = null;
          }
        j(n2, k4, d3 = d3 || f, t3, o4, r3, c3, s3, a3), b3 = k4.__e, (y3 = k4.ref) && d3.ref != y3 && (w4 || (w4 = []), d3.ref && w4.push(d3.ref, null, k4), w4.push(y3, k4.__c || b3, k4)), null != b3 ? (null == g4 && (g4 = b3), "function" == typeof k4.type && k4.__k === d3.__k ? k4.__d = s3 = m(k4, s3, n2) : s3 = A(n2, k4, d3, x4, b3, s3), "function" == typeof u3.type && (u3.__d = s3)) : s3 && d3.__e == s3 && s3.parentNode != n2 && (s3 = _(d3));
      }
    for (u3.__e = g4, h3 = C3; h3--; )
      null != x4[h3] && N(x4[h3], x4[h3]);
    if (w4)
      for (h3 = 0; h3 < w4.length; h3++)
        M(w4[h3], w4[++h3], w4[++h3]);
  }
  function m(n2, l3, u3) {
    for (var i3, t3 = n2.__k, o4 = 0; t3 && o4 < t3.length; o4++)
      (i3 = t3[o4]) && (i3.__ = n2, l3 = "function" == typeof i3.type ? m(i3, l3, u3) : A(u3, i3, i3, t3, i3.__e, l3));
    return l3;
  }
  function x(n2, l3) {
    return l3 = l3 || [], null == n2 || "boolean" == typeof n2 || (Array.isArray(n2) ? n2.some(function(n3) {
      x(n3, l3);
    }) : l3.push(n2)), l3;
  }
  function A(n2, l3, u3, i3, t3, o4) {
    var r3, f3, e3;
    if (void 0 !== l3.__d)
      r3 = l3.__d, l3.__d = void 0;
    else if (null == u3 || t3 != o4 || null == t3.parentNode)
      n:
        if (null == o4 || o4.parentNode !== n2)
          n2.appendChild(t3), r3 = null;
        else {
          for (f3 = o4, e3 = 0; (f3 = f3.nextSibling) && e3 < i3.length; e3 += 1)
            if (f3 == t3)
              break n;
          n2.insertBefore(t3, o4), r3 = o4;
        }
    return void 0 !== r3 ? r3 : t3.nextSibling;
  }
  function C(n2, l3, u3, i3, t3) {
    var o4;
    for (o4 in u3)
      "children" === o4 || "key" === o4 || o4 in l3 || H(n2, o4, null, u3[o4], i3);
    for (o4 in l3)
      t3 && "function" != typeof l3[o4] || "children" === o4 || "key" === o4 || "value" === o4 || "checked" === o4 || u3[o4] === l3[o4] || H(n2, o4, l3[o4], u3[o4], i3);
  }
  function $(n2, l3, u3) {
    "-" === l3[0] ? n2.setProperty(l3, u3) : n2[l3] = null == u3 ? "" : "number" != typeof u3 || c.test(l3) ? u3 : u3 + "px";
  }
  function H(n2, l3, u3, i3, t3) {
    var o4;
    n:
      if ("style" === l3)
        if ("string" == typeof u3)
          n2.style.cssText = u3;
        else {
          if ("string" == typeof i3 && (n2.style.cssText = i3 = ""), i3)
            for (l3 in i3)
              u3 && l3 in u3 || $(n2.style, l3, "");
          if (u3)
            for (l3 in u3)
              i3 && u3[l3] === i3[l3] || $(n2.style, l3, u3[l3]);
        }
      else if ("o" === l3[0] && "n" === l3[1])
        o4 = l3 !== (l3 = l3.replace(/Capture$/, "")), l3 = l3.toLowerCase() in n2 ? l3.toLowerCase().slice(2) : l3.slice(2), n2.l || (n2.l = {}), n2.l[l3 + o4] = u3, u3 ? i3 || n2.addEventListener(l3, o4 ? T : I, o4) : n2.removeEventListener(l3, o4 ? T : I, o4);
      else if ("dangerouslySetInnerHTML" !== l3) {
        if (t3)
          l3 = l3.replace(/xlink(H|:h)/, "h").replace(/sName$/, "s");
        else if ("href" !== l3 && "list" !== l3 && "form" !== l3 && "tabIndex" !== l3 && "download" !== l3 && l3 in n2)
          try {
            n2[l3] = null == u3 ? "" : u3;
            break n;
          } catch (n3) {
          }
        "function" == typeof u3 || (null == u3 || false === u3 && -1 == l3.indexOf("-") ? n2.removeAttribute(l3) : n2.setAttribute(l3, u3));
      }
  }
  function I(n2) {
    this.l[n2.type + false](l.event ? l.event(n2) : n2);
  }
  function T(n2) {
    this.l[n2.type + true](l.event ? l.event(n2) : n2);
  }
  function j(n2, u3, i3, t3, o4, r3, f3, e3, c3) {
    var a3, h3, v3, y3, _4, k4, b3, g4, m3, x4, A4, C3, $3, H3, I3, T4 = u3.type;
    if (void 0 !== u3.constructor)
      return null;
    null != i3.__h && (c3 = i3.__h, e3 = u3.__e = i3.__e, u3.__h = null, r3 = [e3]), (a3 = l.__b) && a3(u3);
    try {
      n:
        if ("function" == typeof T4) {
          if (g4 = u3.props, m3 = (a3 = T4.contextType) && t3[a3.__c], x4 = a3 ? m3 ? m3.props.value : a3.__ : t3, i3.__c ? b3 = (h3 = u3.__c = i3.__c).__ = h3.__E : ("prototype" in T4 && T4.prototype.render ? u3.__c = h3 = new T4(g4, x4) : (u3.__c = h3 = new d(g4, x4), h3.constructor = T4, h3.render = O), m3 && m3.sub(h3), h3.props = g4, h3.state || (h3.state = {}), h3.context = x4, h3.__n = t3, v3 = h3.__d = true, h3.__h = [], h3._sb = []), null == h3.__s && (h3.__s = h3.state), null != T4.getDerivedStateFromProps && (h3.__s == h3.state && (h3.__s = s({}, h3.__s)), s(h3.__s, T4.getDerivedStateFromProps(g4, h3.__s))), y3 = h3.props, _4 = h3.state, v3)
            null == T4.getDerivedStateFromProps && null != h3.componentWillMount && h3.componentWillMount(), null != h3.componentDidMount && h3.__h.push(h3.componentDidMount);
          else {
            if (null == T4.getDerivedStateFromProps && g4 !== y3 && null != h3.componentWillReceiveProps && h3.componentWillReceiveProps(g4, x4), !h3.__e && null != h3.shouldComponentUpdate && false === h3.shouldComponentUpdate(g4, h3.__s, x4) || u3.__v === i3.__v) {
              for (h3.props = g4, h3.state = h3.__s, u3.__v !== i3.__v && (h3.__d = false), h3.__v = u3, u3.__e = i3.__e, u3.__k = i3.__k, u3.__k.forEach(function(n3) {
                n3 && (n3.__ = u3);
              }), A4 = 0; A4 < h3._sb.length; A4++)
                h3.__h.push(h3._sb[A4]);
              h3._sb = [], h3.__h.length && f3.push(h3);
              break n;
            }
            null != h3.componentWillUpdate && h3.componentWillUpdate(g4, h3.__s, x4), null != h3.componentDidUpdate && h3.__h.push(function() {
              h3.componentDidUpdate(y3, _4, k4);
            });
          }
          if (h3.context = x4, h3.props = g4, h3.__v = u3, h3.__P = n2, C3 = l.__r, $3 = 0, "prototype" in T4 && T4.prototype.render) {
            for (h3.state = h3.__s, h3.__d = false, C3 && C3(u3), a3 = h3.render(h3.props, h3.state, h3.context), H3 = 0; H3 < h3._sb.length; H3++)
              h3.__h.push(h3._sb[H3]);
            h3._sb = [];
          } else
            do {
              h3.__d = false, C3 && C3(u3), a3 = h3.render(h3.props, h3.state, h3.context), h3.state = h3.__s;
            } while (h3.__d && ++$3 < 25);
          h3.state = h3.__s, null != h3.getChildContext && (t3 = s(s({}, t3), h3.getChildContext())), v3 || null == h3.getSnapshotBeforeUpdate || (k4 = h3.getSnapshotBeforeUpdate(y3, _4)), I3 = null != a3 && a3.type === p && null == a3.key ? a3.props.children : a3, w(n2, Array.isArray(I3) ? I3 : [I3], u3, i3, t3, o4, r3, f3, e3, c3), h3.base = u3.__e, u3.__h = null, h3.__h.length && f3.push(h3), b3 && (h3.__E = h3.__ = null), h3.__e = false;
        } else
          null == r3 && u3.__v === i3.__v ? (u3.__k = i3.__k, u3.__e = i3.__e) : u3.__e = L(i3.__e, u3, i3, t3, o4, r3, f3, c3);
      (a3 = l.diffed) && a3(u3);
    } catch (n3) {
      u3.__v = null, (c3 || null != r3) && (u3.__e = e3, u3.__h = !!c3, r3[r3.indexOf(e3)] = null), l.__e(n3, u3, i3);
    }
  }
  function z(n2, u3) {
    l.__c && l.__c(u3, n2), n2.some(function(u4) {
      try {
        n2 = u4.__h, u4.__h = [], n2.some(function(n3) {
          n3.call(u4);
        });
      } catch (n3) {
        l.__e(n3, u4.__v);
      }
    });
  }
  function L(l3, u3, i3, t3, o4, r3, e3, c3) {
    var s3, h3, v3, y3 = i3.props, p3 = u3.props, d3 = u3.type, k4 = 0;
    if ("svg" === d3 && (o4 = true), null != r3) {
      for (; k4 < r3.length; k4++)
        if ((s3 = r3[k4]) && "setAttribute" in s3 == !!d3 && (d3 ? s3.localName === d3 : 3 === s3.nodeType)) {
          l3 = s3, r3[k4] = null;
          break;
        }
    }
    if (null == l3) {
      if (null === d3)
        return document.createTextNode(p3);
      l3 = o4 ? document.createElementNS("http://www.w3.org/2000/svg", d3) : document.createElement(d3, p3.is && p3), r3 = null, c3 = false;
    }
    if (null === d3)
      y3 === p3 || c3 && l3.data === p3 || (l3.data = p3);
    else {
      if (r3 = r3 && n.call(l3.childNodes), h3 = (y3 = i3.props || f).dangerouslySetInnerHTML, v3 = p3.dangerouslySetInnerHTML, !c3) {
        if (null != r3)
          for (y3 = {}, k4 = 0; k4 < l3.attributes.length; k4++)
            y3[l3.attributes[k4].name] = l3.attributes[k4].value;
        (v3 || h3) && (v3 && (h3 && v3.__html == h3.__html || v3.__html === l3.innerHTML) || (l3.innerHTML = v3 && v3.__html || ""));
      }
      if (C(l3, p3, y3, o4, c3), v3)
        u3.__k = [];
      else if (k4 = u3.props.children, w(l3, Array.isArray(k4) ? k4 : [k4], u3, i3, t3, o4 && "foreignObject" !== d3, r3, e3, r3 ? r3[0] : i3.__k && _(i3, 0), c3), null != r3)
        for (k4 = r3.length; k4--; )
          null != r3[k4] && a(r3[k4]);
      c3 || ("value" in p3 && void 0 !== (k4 = p3.value) && (k4 !== l3.value || "progress" === d3 && !k4 || "option" === d3 && k4 !== y3.value) && H(l3, "value", k4, y3.value, false), "checked" in p3 && void 0 !== (k4 = p3.checked) && k4 !== l3.checked && H(l3, "checked", k4, y3.checked, false));
    }
    return l3;
  }
  function M(n2, u3, i3) {
    try {
      "function" == typeof n2 ? n2(u3) : n2.current = u3;
    } catch (n3) {
      l.__e(n3, i3);
    }
  }
  function N(n2, u3, i3) {
    var t3, o4;
    if (l.unmount && l.unmount(n2), (t3 = n2.ref) && (t3.current && t3.current !== n2.__e || M(t3, null, u3)), null != (t3 = n2.__c)) {
      if (t3.componentWillUnmount)
        try {
          t3.componentWillUnmount();
        } catch (n3) {
          l.__e(n3, u3);
        }
      t3.base = t3.__P = null, n2.__c = void 0;
    }
    if (t3 = n2.__k)
      for (o4 = 0; o4 < t3.length; o4++)
        t3[o4] && N(t3[o4], u3, i3 || "function" != typeof n2.type);
    i3 || null == n2.__e || a(n2.__e), n2.__ = n2.__e = n2.__d = void 0;
  }
  function O(n2, l3, u3) {
    return this.constructor(n2, u3);
  }
  function P(u3, i3, t3) {
    var o4, r3, e3;
    l.__ && l.__(u3, i3), r3 = (o4 = "function" == typeof t3) ? null : t3 && t3.__k || i3.__k, e3 = [], j(i3, u3 = (!o4 && t3 || i3).__k = h(p, null, [u3]), r3 || f, f, void 0 !== i3.ownerSVGElement, !o4 && t3 ? [t3] : r3 ? null : i3.firstChild ? n.call(i3.childNodes) : null, e3, !o4 && t3 ? t3 : r3 ? r3.__e : i3.firstChild, o4), z(e3, u3);
  }
  function S(n2, l3) {
    P(n2, l3, S);
  }
  function q(l3, u3, i3) {
    var t3, o4, r3, f3 = s({}, l3.props);
    for (r3 in u3)
      "key" == r3 ? t3 = u3[r3] : "ref" == r3 ? o4 = u3[r3] : f3[r3] = u3[r3];
    return arguments.length > 2 && (f3.children = arguments.length > 3 ? n.call(arguments, 2) : i3), v(l3.type, f3, t3 || l3.key, o4 || l3.ref, null);
  }
  function B(n2, l3) {
    var u3 = { __c: l3 = "__cC" + r++, __: n2, Consumer: function(n3, l4) {
      return n3.children(l4);
    }, Provider: function(n3) {
      var u4, i3;
      return this.getChildContext || (u4 = [], (i3 = {})[l3] = this, this.getChildContext = function() {
        return i3;
      }, this.shouldComponentUpdate = function(n4) {
        this.props.value !== n4.value && u4.some(b);
      }, this.sub = function(n4) {
        u4.push(n4);
        var l4 = n4.componentWillUnmount;
        n4.componentWillUnmount = function() {
          u4.splice(u4.indexOf(n4), 1), l4 && l4.call(n4);
        };
      }), n3.children;
    } };
    return u3.Provider.__ = u3.Consumer.contextType = u3;
  }
  var n, l, u, i, t, o, r, f, e, c;
  var init_preact_module = __esm({
    "node_modules/.pnpm/preact@10.11.3/node_modules/preact/dist/preact.module.js"() {
      f = {};
      e = [];
      c = /acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|itera/i;
      n = e.slice, l = { __e: function(n2, l3, u3, i3) {
        for (var t3, o4, r3; l3 = l3.__; )
          if ((t3 = l3.__c) && !t3.__)
            try {
              if ((o4 = t3.constructor) && null != o4.getDerivedStateFromError && (t3.setState(o4.getDerivedStateFromError(n2)), r3 = t3.__d), null != t3.componentDidCatch && (t3.componentDidCatch(n2, i3 || {}), r3 = t3.__d), r3)
                return t3.__E = t3;
            } catch (l4) {
              n2 = l4;
            }
        throw n2;
      } }, u = 0, i = function(n2) {
        return null != n2 && void 0 === n2.constructor;
      }, d.prototype.setState = function(n2, l3) {
        var u3;
        u3 = null != this.__s && this.__s !== this.state ? this.__s : this.__s = s({}, this.state), "function" == typeof n2 && (n2 = n2(s({}, u3), this.props)), n2 && s(u3, n2), null != n2 && this.__v && (l3 && this._sb.push(l3), b(this));
      }, d.prototype.forceUpdate = function(n2) {
        this.__v && (this.__e = true, n2 && this.__h.push(n2), b(this));
      }, d.prototype.render = p, t = [], g.__r = 0, r = 0;
    }
  });

  // node_modules/.pnpm/preact@10.11.3/node_modules/preact/hooks/dist/hooks.module.js
  function d2(t3, u3) {
    l.__h && l.__h(r2, t3, o2 || u3), o2 = 0;
    var i3 = r2.__H || (r2.__H = { __: [], __h: [] });
    return t3 >= i3.__.length && i3.__.push({ __V: c2 }), i3.__[t3];
  }
  function p2(n2) {
    return o2 = 1, y2(B2, n2);
  }
  function y2(n2, u3, i3) {
    var o4 = d2(t2++, 2);
    if (o4.t = n2, !o4.__c && (o4.__ = [i3 ? i3(u3) : B2(void 0, u3), function(n3) {
      var t3 = o4.__N ? o4.__N[0] : o4.__[0], r3 = o4.t(t3, n3);
      t3 !== r3 && (o4.__N = [r3, o4.__[1]], o4.__c.setState({}));
    }], o4.__c = r2, !r2.u)) {
      r2.u = true;
      var f3 = r2.shouldComponentUpdate;
      r2.shouldComponentUpdate = function(n3, t3, r3) {
        if (!o4.__c.__H)
          return true;
        var u4 = o4.__c.__H.__.filter(function(n4) {
          return n4.__c;
        });
        if (u4.every(function(n4) {
          return !n4.__N;
        }))
          return !f3 || f3.call(this, n3, t3, r3);
        var i4 = false;
        return u4.forEach(function(n4) {
          if (n4.__N) {
            var t4 = n4.__[0];
            n4.__ = n4.__N, n4.__N = void 0, t4 !== n4.__[0] && (i4 = true);
          }
        }), !(!i4 && o4.__c.props === n3) && (!f3 || f3.call(this, n3, t3, r3));
      };
    }
    return o4.__N || o4.__;
  }
  function h2(u3, i3) {
    var o4 = d2(t2++, 3);
    !l.__s && z2(o4.__H, i3) && (o4.__ = u3, o4.i = i3, r2.__H.__h.push(o4));
  }
  function s2(u3, i3) {
    var o4 = d2(t2++, 4);
    !l.__s && z2(o4.__H, i3) && (o4.__ = u3, o4.i = i3, r2.__h.push(o4));
  }
  function _2(n2) {
    return o2 = 5, F(function() {
      return { current: n2 };
    }, []);
  }
  function A2(n2, t3, r3) {
    o2 = 6, s2(function() {
      return "function" == typeof n2 ? (n2(t3()), function() {
        return n2(null);
      }) : n2 ? (n2.current = t3(), function() {
        return n2.current = null;
      }) : void 0;
    }, null == r3 ? r3 : r3.concat(n2));
  }
  function F(n2, r3) {
    var u3 = d2(t2++, 7);
    return z2(u3.__H, r3) ? (u3.__V = n2(), u3.i = r3, u3.__h = n2, u3.__V) : u3.__;
  }
  function T2(n2, t3) {
    return o2 = 8, F(function() {
      return n2;
    }, t3);
  }
  function q2(n2) {
    var u3 = r2.context[n2.__c], i3 = d2(t2++, 9);
    return i3.c = n2, u3 ? (null == i3.__ && (i3.__ = true, u3.sub(r2)), u3.props.value) : n2.__;
  }
  function x2(t3, r3) {
    l.useDebugValue && l.useDebugValue(r3 ? r3(t3) : t3);
  }
  function P2(n2) {
    var u3 = d2(t2++, 10), i3 = p2();
    return u3.__ = n2, r2.componentDidCatch || (r2.componentDidCatch = function(n3, t3) {
      u3.__ && u3.__(n3, t3), i3[1](n3);
    }), [i3[0], function() {
      i3[1](void 0);
    }];
  }
  function V() {
    var n2 = d2(t2++, 11);
    if (!n2.__) {
      for (var u3 = r2.__v; null !== u3 && !u3.__m && null !== u3.__; )
        u3 = u3.__;
      var i3 = u3.__m || (u3.__m = [0, 0]);
      n2.__ = "P" + i3[0] + "-" + i3[1]++;
    }
    return n2.__;
  }
  function b2() {
    for (var t3; t3 = f2.shift(); )
      if (t3.__P && t3.__H)
        try {
          t3.__H.__h.forEach(k2), t3.__H.__h.forEach(w2), t3.__H.__h = [];
        } catch (r3) {
          t3.__H.__h = [], l.__e(r3, t3.__v);
        }
  }
  function j2(n2) {
    var t3, r3 = function() {
      clearTimeout(u3), g2 && cancelAnimationFrame(t3), setTimeout(n2);
    }, u3 = setTimeout(r3, 100);
    g2 && (t3 = requestAnimationFrame(r3));
  }
  function k2(n2) {
    var t3 = r2, u3 = n2.__c;
    "function" == typeof u3 && (n2.__c = void 0, u3()), r2 = t3;
  }
  function w2(n2) {
    var t3 = r2;
    n2.__c = n2.__(), r2 = t3;
  }
  function z2(n2, t3) {
    return !n2 || n2.length !== t3.length || t3.some(function(t4, r3) {
      return t4 !== n2[r3];
    });
  }
  function B2(n2, t3) {
    return "function" == typeof t3 ? t3(n2) : t3;
  }
  var t2, r2, u2, i2, o2, f2, c2, e2, a2, v2, l2, m2, g2;
  var init_hooks_module = __esm({
    "node_modules/.pnpm/preact@10.11.3/node_modules/preact/hooks/dist/hooks.module.js"() {
      init_preact_module();
      o2 = 0;
      f2 = [];
      c2 = [];
      e2 = l.__b;
      a2 = l.__r;
      v2 = l.diffed;
      l2 = l.__c;
      m2 = l.unmount;
      l.__b = function(n2) {
        r2 = null, e2 && e2(n2);
      }, l.__r = function(n2) {
        a2 && a2(n2), t2 = 0;
        var i3 = (r2 = n2.__c).__H;
        i3 && (u2 === r2 ? (i3.__h = [], r2.__h = [], i3.__.forEach(function(n3) {
          n3.__N && (n3.__ = n3.__N), n3.__V = c2, n3.__N = n3.i = void 0;
        })) : (i3.__h.forEach(k2), i3.__h.forEach(w2), i3.__h = [])), u2 = r2;
      }, l.diffed = function(t3) {
        v2 && v2(t3);
        var o4 = t3.__c;
        o4 && o4.__H && (o4.__H.__h.length && (1 !== f2.push(o4) && i2 === l.requestAnimationFrame || ((i2 = l.requestAnimationFrame) || j2)(b2)), o4.__H.__.forEach(function(n2) {
          n2.i && (n2.__H = n2.i), n2.__V !== c2 && (n2.__ = n2.__V), n2.i = void 0, n2.__V = c2;
        })), u2 = r2 = null;
      }, l.__c = function(t3, r3) {
        r3.some(function(t4) {
          try {
            t4.__h.forEach(k2), t4.__h = t4.__h.filter(function(n2) {
              return !n2.__ || w2(n2);
            });
          } catch (u3) {
            r3.some(function(n2) {
              n2.__h && (n2.__h = []);
            }), r3 = [], l.__e(u3, t4.__v);
          }
        }), l2 && l2(t3, r3);
      }, l.unmount = function(t3) {
        m2 && m2(t3);
        var r3, u3 = t3.__c;
        u3 && u3.__H && (u3.__H.__.forEach(function(n2) {
          try {
            k2(n2);
          } catch (n3) {
            r3 = n3;
          }
        }), u3.__H = void 0, r3 && l.__e(r3, u3.__v));
      };
      g2 = "function" == typeof requestAnimationFrame;
    }
  });

  // node_modules/.pnpm/preact@10.11.3/node_modules/preact/compat/dist/compat.module.js
  function g3(n2, t3) {
    for (var e3 in t3)
      n2[e3] = t3[e3];
    return n2;
  }
  function C2(n2, t3) {
    for (var e3 in n2)
      if ("__source" !== e3 && !(e3 in t3))
        return true;
    for (var r3 in t3)
      if ("__source" !== r3 && n2[r3] !== t3[r3])
        return true;
    return false;
  }
  function E(n2, t3) {
    return n2 === t3 && (0 !== n2 || 1 / n2 == 1 / t3) || n2 != n2 && t3 != t3;
  }
  function w3(n2) {
    this.props = n2;
  }
  function R(n2, e3) {
    function r3(n3) {
      var t3 = this.props.ref, r4 = t3 == n3.ref;
      return !r4 && t3 && (t3.call ? t3(null) : t3.current = null), e3 ? !e3(this.props, n3) || !r4 : C2(this.props, n3);
    }
    function u3(e4) {
      return this.shouldComponentUpdate = r3, h(n2, e4);
    }
    return u3.displayName = "Memo(" + (n2.displayName || n2.name) + ")", u3.prototype.isReactComponent = true, u3.__f = true, u3;
  }
  function k3(n2) {
    function t3(t4) {
      var e3 = g3({}, t4);
      return delete e3.ref, n2(e3, t4.ref || null);
    }
    return t3.$$typeof = N2, t3.render = t3, t3.prototype.isReactComponent = t3.__f = true, t3.displayName = "ForwardRef(" + (n2.displayName || n2.name) + ")", t3;
  }
  function L2(n2, t3, e3) {
    return n2 && (n2.__c && n2.__c.__H && (n2.__c.__H.__.forEach(function(n3) {
      "function" == typeof n3.__c && n3.__c();
    }), n2.__c.__H = null), null != (n2 = g3({}, n2)).__c && (n2.__c.__P === e3 && (n2.__c.__P = t3), n2.__c = null), n2.__k = n2.__k && n2.__k.map(function(n3) {
      return L2(n3, t3, e3);
    })), n2;
  }
  function U(n2, t3, e3) {
    return n2 && (n2.__v = null, n2.__k = n2.__k && n2.__k.map(function(n3) {
      return U(n3, t3, e3);
    }), n2.__c && n2.__c.__P === t3 && (n2.__e && e3.insertBefore(n2.__e, n2.__d), n2.__c.__e = true, n2.__c.__P = e3)), n2;
  }
  function D() {
    this.__u = 0, this.t = null, this.__b = null;
  }
  function F2(n2) {
    var t3 = n2.__.__c;
    return t3 && t3.__a && t3.__a(n2);
  }
  function M2(n2) {
    var e3, r3, u3;
    function o4(o5) {
      if (e3 || (e3 = n2()).then(function(n3) {
        r3 = n3.default || n3;
      }, function(n3) {
        u3 = n3;
      }), u3)
        throw u3;
      if (!r3)
        throw e3;
      return h(r3, o5);
    }
    return o4.displayName = "Lazy", o4.__f = true, o4;
  }
  function V2() {
    this.u = null, this.o = null;
  }
  function P3(n2) {
    return this.getChildContext = function() {
      return n2.context;
    }, n2.children;
  }
  function $2(n2) {
    var e3 = this, r3 = n2.i;
    e3.componentWillUnmount = function() {
      P(null, e3.l), e3.l = null, e3.i = null;
    }, e3.i && e3.i !== r3 && e3.componentWillUnmount(), n2.__v ? (e3.l || (e3.i = r3, e3.l = { nodeType: 1, parentNode: r3, childNodes: [], appendChild: function(n3) {
      this.childNodes.push(n3), e3.i.appendChild(n3);
    }, insertBefore: function(n3, t3) {
      this.childNodes.push(n3), e3.i.appendChild(n3);
    }, removeChild: function(n3) {
      this.childNodes.splice(this.childNodes.indexOf(n3) >>> 1, 1), e3.i.removeChild(n3);
    } }), P(h(P3, { context: e3.context }, n2.__v), e3.l)) : e3.l && e3.componentWillUnmount();
  }
  function j3(n2, e3) {
    var r3 = h($2, { __v: n2, i: e3 });
    return r3.containerInfo = e3, r3;
  }
  function Y(n2, t3, e3) {
    return null == t3.__k && (t3.textContent = ""), P(n2, t3), "function" == typeof e3 && e3(), n2 ? n2.__c : null;
  }
  function q3(n2, t3, e3) {
    return S(n2, t3), "function" == typeof e3 && e3(), n2 ? n2.__c : null;
  }
  function J() {
  }
  function K() {
    return this.cancelBubble;
  }
  function Q() {
    return this.defaultPrevented;
  }
  function on(n2) {
    return h.bind(null, n2);
  }
  function ln(n2) {
    return !!n2 && n2.$$typeof === z3;
  }
  function cn(n2) {
    return ln(n2) ? q.apply(null, arguments) : n2;
  }
  function fn(n2) {
    return !!n2.__k && (P(null, n2), true);
  }
  function an(n2) {
    return n2 && (n2.base || 1 === n2.nodeType && n2) || null;
  }
  function dn(n2) {
    n2();
  }
  function pn(n2) {
    return n2;
  }
  function mn() {
    return [false, dn];
  }
  function _n(n2, t3) {
    var e3 = t3(), r3 = p2({ h: { __: e3, v: t3 } }), u3 = r3[0].h, o4 = r3[1];
    return s2(function() {
      u3.__ = e3, u3.v = t3, E(u3.__, t3()) || o4({ h: u3 });
    }, [n2, e3, t3]), h2(function() {
      return E(u3.__, u3.v()) || o4({ h: u3 }), n2(function() {
        E(u3.__, u3.v()) || o4({ h: u3 });
      });
    }, [n2]), e3;
  }
  var x3, N2, A3, O2, T3, I2, W, z3, B3, H2, Z, G, X, nn, tn, en, rn, un, sn, hn, vn, yn, bn;
  var init_compat_module = __esm({
    "node_modules/.pnpm/preact@10.11.3/node_modules/preact/compat/dist/compat.module.js"() {
      init_preact_module();
      init_preact_module();
      init_hooks_module();
      init_hooks_module();
      (w3.prototype = new d()).isPureReactComponent = true, w3.prototype.shouldComponentUpdate = function(n2, t3) {
        return C2(this.props, n2) || C2(this.state, t3);
      };
      x3 = l.__b;
      l.__b = function(n2) {
        n2.type && n2.type.__f && n2.ref && (n2.props.ref = n2.ref, n2.ref = null), x3 && x3(n2);
      };
      N2 = "undefined" != typeof Symbol && Symbol.for && Symbol.for("react.forward_ref") || 3911;
      A3 = function(n2, t3) {
        return null == n2 ? null : x(x(n2).map(t3));
      };
      O2 = { map: A3, forEach: A3, count: function(n2) {
        return n2 ? x(n2).length : 0;
      }, only: function(n2) {
        var t3 = x(n2);
        if (1 !== t3.length)
          throw "Children.only";
        return t3[0];
      }, toArray: x };
      T3 = l.__e;
      l.__e = function(n2, t3, e3, r3) {
        if (n2.then) {
          for (var u3, o4 = t3; o4 = o4.__; )
            if ((u3 = o4.__c) && u3.__c)
              return null == t3.__e && (t3.__e = e3.__e, t3.__k = e3.__k), u3.__c(n2, t3);
        }
        T3(n2, t3, e3, r3);
      };
      I2 = l.unmount;
      l.unmount = function(n2) {
        var t3 = n2.__c;
        t3 && t3.__R && t3.__R(), t3 && true === n2.__h && (n2.type = null), I2 && I2(n2);
      }, (D.prototype = new d()).__c = function(n2, t3) {
        var e3 = t3.__c, r3 = this;
        null == r3.t && (r3.t = []), r3.t.push(e3);
        var u3 = F2(r3.__v), o4 = false, i3 = function() {
          o4 || (o4 = true, e3.__R = null, u3 ? u3(l3) : l3());
        };
        e3.__R = i3;
        var l3 = function() {
          if (!--r3.__u) {
            if (r3.state.__a) {
              var n3 = r3.state.__a;
              r3.__v.__k[0] = U(n3, n3.__c.__P, n3.__c.__O);
            }
            var t4;
            for (r3.setState({ __a: r3.__b = null }); t4 = r3.t.pop(); )
              t4.forceUpdate();
          }
        }, c3 = true === t3.__h;
        r3.__u++ || c3 || r3.setState({ __a: r3.__b = r3.__v.__k[0] }), n2.then(i3, i3);
      }, D.prototype.componentWillUnmount = function() {
        this.t = [];
      }, D.prototype.render = function(n2, e3) {
        if (this.__b) {
          if (this.__v.__k) {
            var r3 = document.createElement("div"), o4 = this.__v.__k[0].__c;
            this.__v.__k[0] = L2(this.__b, r3, o4.__O = o4.__P);
          }
          this.__b = null;
        }
        var i3 = e3.__a && h(p, null, n2.fallback);
        return i3 && (i3.__h = null), [h(p, null, e3.__a ? null : n2.children), i3];
      };
      W = function(n2, t3, e3) {
        if (++e3[1] === e3[0] && n2.o.delete(t3), n2.props.revealOrder && ("t" !== n2.props.revealOrder[0] || !n2.o.size))
          for (e3 = n2.u; e3; ) {
            for (; e3.length > 3; )
              e3.pop()();
            if (e3[1] < e3[0])
              break;
            n2.u = e3 = e3[2];
          }
      };
      (V2.prototype = new d()).__a = function(n2) {
        var t3 = this, e3 = F2(t3.__v), r3 = t3.o.get(n2);
        return r3[0]++, function(u3) {
          var o4 = function() {
            t3.props.revealOrder ? (r3.push(u3), W(t3, n2, r3)) : u3();
          };
          e3 ? e3(o4) : o4();
        };
      }, V2.prototype.render = function(n2) {
        this.u = null, this.o = /* @__PURE__ */ new Map();
        var t3 = x(n2.children);
        n2.revealOrder && "b" === n2.revealOrder[0] && t3.reverse();
        for (var e3 = t3.length; e3--; )
          this.o.set(t3[e3], this.u = [1, 0, this.u]);
        return n2.children;
      }, V2.prototype.componentDidUpdate = V2.prototype.componentDidMount = function() {
        var n2 = this;
        this.o.forEach(function(t3, e3) {
          W(n2, e3, t3);
        });
      };
      z3 = "undefined" != typeof Symbol && Symbol.for && Symbol.for("react.element") || 60103;
      B3 = /^(?:accent|alignment|arabic|baseline|cap|clip(?!PathU)|color|dominant|fill|flood|font|glyph(?!R)|horiz|image|letter|lighting|marker(?!H|W|U)|overline|paint|pointer|shape|stop|strikethrough|stroke|text(?!L)|transform|underline|unicode|units|v|vector|vert|word|writing|x(?!C))[A-Z]/;
      H2 = "undefined" != typeof document;
      Z = function(n2) {
        return ("undefined" != typeof Symbol && "symbol" == typeof Symbol() ? /fil|che|rad/i : /fil|che|ra/i).test(n2);
      };
      d.prototype.isReactComponent = {}, ["componentWillMount", "componentWillReceiveProps", "componentWillUpdate"].forEach(function(t3) {
        Object.defineProperty(d.prototype, t3, { configurable: true, get: function() {
          return this["UNSAFE_" + t3];
        }, set: function(n2) {
          Object.defineProperty(this, t3, { configurable: true, writable: true, value: n2 });
        } });
      });
      G = l.event;
      l.event = function(n2) {
        return G && (n2 = G(n2)), n2.persist = J, n2.isPropagationStopped = K, n2.isDefaultPrevented = Q, n2.nativeEvent = n2;
      };
      nn = { configurable: true, get: function() {
        return this.class;
      } };
      tn = l.vnode;
      l.vnode = function(n2) {
        var t3 = n2.type, e3 = n2.props, u3 = e3;
        if ("string" == typeof t3) {
          var o4 = -1 === t3.indexOf("-");
          for (var i3 in u3 = {}, e3) {
            var l3 = e3[i3];
            H2 && "children" === i3 && "noscript" === t3 || "value" === i3 && "defaultValue" in e3 && null == l3 || ("defaultValue" === i3 && "value" in e3 && null == e3.value ? i3 = "value" : "download" === i3 && true === l3 ? l3 = "" : /ondoubleclick/i.test(i3) ? i3 = "ondblclick" : /^onchange(textarea|input)/i.test(i3 + t3) && !Z(e3.type) ? i3 = "oninput" : /^onfocus$/i.test(i3) ? i3 = "onfocusin" : /^onblur$/i.test(i3) ? i3 = "onfocusout" : /^on(Ani|Tra|Tou|BeforeInp|Compo)/.test(i3) ? i3 = i3.toLowerCase() : o4 && B3.test(i3) ? i3 = i3.replace(/[A-Z0-9]/g, "-$&").toLowerCase() : null === l3 && (l3 = void 0), /^oninput$/i.test(i3) && (i3 = i3.toLowerCase(), u3[i3] && (i3 = "oninputCapture")), u3[i3] = l3);
          }
          "select" == t3 && u3.multiple && Array.isArray(u3.value) && (u3.value = x(e3.children).forEach(function(n3) {
            n3.props.selected = -1 != u3.value.indexOf(n3.props.value);
          })), "select" == t3 && null != u3.defaultValue && (u3.value = x(e3.children).forEach(function(n3) {
            n3.props.selected = u3.multiple ? -1 != u3.defaultValue.indexOf(n3.props.value) : u3.defaultValue == n3.props.value;
          })), n2.props = u3, e3.class != e3.className && (nn.enumerable = "className" in e3, null != e3.className && (u3.class = e3.className), Object.defineProperty(u3, "className", nn));
        }
        n2.$$typeof = z3, tn && tn(n2);
      };
      en = l.__r;
      l.__r = function(n2) {
        en && en(n2), X = n2.__c;
      };
      rn = { ReactCurrentDispatcher: { current: { readContext: function(n2) {
        return X.__n[n2.__c].props.value;
      } } } };
      un = "17.0.2";
      sn = function(n2, t3) {
        return n2(t3);
      };
      hn = function(n2, t3) {
        return n2(t3);
      };
      vn = p;
      yn = s2;
      bn = { useState: p2, useId: V, useReducer: y2, useEffect: h2, useLayoutEffect: s2, useInsertionEffect: yn, useTransition: mn, useDeferredValue: pn, useSyncExternalStore: _n, startTransition: dn, useRef: _2, useImperativeHandle: A2, useMemo: F, useCallback: T2, useContext: q2, useDebugValue: x2, version: "17.0.2", Children: O2, render: Y, hydrate: q3, unmountComponentAtNode: fn, createPortal: j3, createElement: h, createContext: B, createFactory: on, cloneElement: cn, createRef: y, Fragment: p, isValidElement: ln, findDOMNode: an, Component: d, PureComponent: w3, memo: R, forwardRef: k3, flushSync: hn, unstable_batchedUpdates: sn, StrictMode: vn, Suspense: D, SuspenseList: V2, lazy: M2, __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED: rn };
    }
  });

  // node_modules/.pnpm/@preact+compat@17.1.2_preact@10.11.3/node_modules/@preact/compat/index.mjs
  var compat_exports = {};
  __export(compat_exports, {
    Children: () => O2,
    Component: () => d,
    Fragment: () => p,
    PureComponent: () => w3,
    StrictMode: () => vn,
    Suspense: () => D,
    SuspenseList: () => V2,
    __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED: () => rn,
    cloneElement: () => cn,
    createContext: () => B,
    createElement: () => h,
    createFactory: () => on,
    createPortal: () => j3,
    createRef: () => y,
    default: () => bn,
    findDOMNode: () => an,
    flushSync: () => hn,
    forwardRef: () => k3,
    hydrate: () => q3,
    isValidElement: () => ln,
    lazy: () => M2,
    memo: () => R,
    render: () => Y,
    startTransition: () => dn,
    unmountComponentAtNode: () => fn,
    unstable_batchedUpdates: () => sn,
    useCallback: () => T2,
    useContext: () => q2,
    useDebugValue: () => x2,
    useDeferredValue: () => pn,
    useEffect: () => h2,
    useErrorBoundary: () => P2,
    useId: () => V,
    useImperativeHandle: () => A2,
    useInsertionEffect: () => yn,
    useLayoutEffect: () => s2,
    useMemo: () => F,
    useReducer: () => y2,
    useRef: () => _2,
    useState: () => p2,
    useSyncExternalStore: () => _n,
    useTransition: () => mn,
    version: () => un
  });
  var init_compat = __esm({
    "node_modules/.pnpm/@preact+compat@17.1.2_preact@10.11.3/node_modules/@preact/compat/index.mjs"() {
      init_compat_module();
      init_compat_module();
    }
  });

  // node_modules/.pnpm/use-sync-external-store@1.2.0_@preact+compat@17.1.2/node_modules/use-sync-external-store/cjs/use-sync-external-store-shim.production.min.js
  var require_use_sync_external_store_shim_production_min = __commonJS({
    "node_modules/.pnpm/use-sync-external-store@1.2.0_@preact+compat@17.1.2/node_modules/use-sync-external-store/cjs/use-sync-external-store-shim.production.min.js"(exports) {
      "use strict";
      var e3 = (init_compat(), __toCommonJS(compat_exports));
      function h3(a3, b3) {
        return a3 === b3 && (0 !== a3 || 1 / a3 === 1 / b3) || a3 !== a3 && b3 !== b3;
      }
      var k4 = "function" === typeof Object.is ? Object.is : h3;
      var l3 = e3.useState;
      var m3 = e3.useEffect;
      var n2 = e3.useLayoutEffect;
      var p3 = e3.useDebugValue;
      function q4(a3, b3) {
        var d3 = b3(), f3 = l3({ inst: { value: d3, getSnapshot: b3 } }), c3 = f3[0].inst, g4 = f3[1];
        n2(function() {
          c3.value = d3;
          c3.getSnapshot = b3;
          r3(c3) && g4({ inst: c3 });
        }, [a3, d3, b3]);
        m3(function() {
          r3(c3) && g4({ inst: c3 });
          return a3(function() {
            r3(c3) && g4({ inst: c3 });
          });
        }, [a3]);
        p3(d3);
        return d3;
      }
      function r3(a3) {
        var b3 = a3.getSnapshot;
        a3 = a3.value;
        try {
          var d3 = b3();
          return !k4(a3, d3);
        } catch (f3) {
          return true;
        }
      }
      function t3(a3, b3) {
        return b3();
      }
      var u3 = "undefined" === typeof window || "undefined" === typeof window.document || "undefined" === typeof window.document.createElement ? t3 : q4;
      exports.useSyncExternalStore = void 0 !== e3.useSyncExternalStore ? e3.useSyncExternalStore : u3;
    }
  });

  // node_modules/.pnpm/use-sync-external-store@1.2.0_@preact+compat@17.1.2/node_modules/use-sync-external-store/shim/index.js
  var require_shim = __commonJS({
    "node_modules/.pnpm/use-sync-external-store@1.2.0_@preact+compat@17.1.2/node_modules/use-sync-external-store/shim/index.js"(exports, module) {
      "use strict";
      if (true) {
        module.exports = require_use_sync_external_store_shim_production_min();
      } else {
        module.exports = null;
      }
    }
  });

  // node_modules/.pnpm/webextension-polyfill@0.10.0/node_modules/webextension-polyfill/dist/browser-polyfill.js
  var require_browser_polyfill = __commonJS({
    "node_modules/.pnpm/webextension-polyfill@0.10.0/node_modules/webextension-polyfill/dist/browser-polyfill.js"(exports, module) {
      (function(global, factory) {
        if (typeof define === "function" && define.amd) {
          define("webextension-polyfill", ["module"], factory);
        } else if (typeof exports !== "undefined") {
          factory(module);
        } else {
          var mod = {
            exports: {}
          };
          factory(mod);
          global.browser = mod.exports;
        }
      })(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : exports, function(module2) {
        "use strict";
        if (!globalThis.chrome?.runtime?.id) {
          throw new Error("This script should only be loaded in a browser extension.");
        }
        if (typeof globalThis.browser === "undefined" || Object.getPrototypeOf(globalThis.browser) !== Object.prototype) {
          const CHROME_SEND_MESSAGE_CALLBACK_NO_RESPONSE_MESSAGE = "The message port closed before a response was received.";
          const wrapAPIs = (extensionAPIs) => {
            const apiMetadata = {
              "alarms": {
                "clear": {
                  "minArgs": 0,
                  "maxArgs": 1
                },
                "clearAll": {
                  "minArgs": 0,
                  "maxArgs": 0
                },
                "get": {
                  "minArgs": 0,
                  "maxArgs": 1
                },
                "getAll": {
                  "minArgs": 0,
                  "maxArgs": 0
                }
              },
              "bookmarks": {
                "create": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "get": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "getChildren": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "getRecent": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "getSubTree": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "getTree": {
                  "minArgs": 0,
                  "maxArgs": 0
                },
                "move": {
                  "minArgs": 2,
                  "maxArgs": 2
                },
                "remove": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "removeTree": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "search": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "update": {
                  "minArgs": 2,
                  "maxArgs": 2
                }
              },
              "browserAction": {
                "disable": {
                  "minArgs": 0,
                  "maxArgs": 1,
                  "fallbackToNoCallback": true
                },
                "enable": {
                  "minArgs": 0,
                  "maxArgs": 1,
                  "fallbackToNoCallback": true
                },
                "getBadgeBackgroundColor": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "getBadgeText": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "getPopup": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "getTitle": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "openPopup": {
                  "minArgs": 0,
                  "maxArgs": 0
                },
                "setBadgeBackgroundColor": {
                  "minArgs": 1,
                  "maxArgs": 1,
                  "fallbackToNoCallback": true
                },
                "setBadgeText": {
                  "minArgs": 1,
                  "maxArgs": 1,
                  "fallbackToNoCallback": true
                },
                "setIcon": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "setPopup": {
                  "minArgs": 1,
                  "maxArgs": 1,
                  "fallbackToNoCallback": true
                },
                "setTitle": {
                  "minArgs": 1,
                  "maxArgs": 1,
                  "fallbackToNoCallback": true
                }
              },
              "browsingData": {
                "remove": {
                  "minArgs": 2,
                  "maxArgs": 2
                },
                "removeCache": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "removeCookies": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "removeDownloads": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "removeFormData": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "removeHistory": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "removeLocalStorage": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "removePasswords": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "removePluginData": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "settings": {
                  "minArgs": 0,
                  "maxArgs": 0
                }
              },
              "commands": {
                "getAll": {
                  "minArgs": 0,
                  "maxArgs": 0
                }
              },
              "contextMenus": {
                "remove": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "removeAll": {
                  "minArgs": 0,
                  "maxArgs": 0
                },
                "update": {
                  "minArgs": 2,
                  "maxArgs": 2
                }
              },
              "cookies": {
                "get": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "getAll": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "getAllCookieStores": {
                  "minArgs": 0,
                  "maxArgs": 0
                },
                "remove": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "set": {
                  "minArgs": 1,
                  "maxArgs": 1
                }
              },
              "devtools": {
                "inspectedWindow": {
                  "eval": {
                    "minArgs": 1,
                    "maxArgs": 2,
                    "singleCallbackArg": false
                  }
                },
                "panels": {
                  "create": {
                    "minArgs": 3,
                    "maxArgs": 3,
                    "singleCallbackArg": true
                  },
                  "elements": {
                    "createSidebarPane": {
                      "minArgs": 1,
                      "maxArgs": 1
                    }
                  }
                }
              },
              "downloads": {
                "cancel": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "download": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "erase": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "getFileIcon": {
                  "minArgs": 1,
                  "maxArgs": 2
                },
                "open": {
                  "minArgs": 1,
                  "maxArgs": 1,
                  "fallbackToNoCallback": true
                },
                "pause": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "removeFile": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "resume": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "search": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "show": {
                  "minArgs": 1,
                  "maxArgs": 1,
                  "fallbackToNoCallback": true
                }
              },
              "extension": {
                "isAllowedFileSchemeAccess": {
                  "minArgs": 0,
                  "maxArgs": 0
                },
                "isAllowedIncognitoAccess": {
                  "minArgs": 0,
                  "maxArgs": 0
                }
              },
              "history": {
                "addUrl": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "deleteAll": {
                  "minArgs": 0,
                  "maxArgs": 0
                },
                "deleteRange": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "deleteUrl": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "getVisits": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "search": {
                  "minArgs": 1,
                  "maxArgs": 1
                }
              },
              "i18n": {
                "detectLanguage": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "getAcceptLanguages": {
                  "minArgs": 0,
                  "maxArgs": 0
                }
              },
              "identity": {
                "launchWebAuthFlow": {
                  "minArgs": 1,
                  "maxArgs": 1
                }
              },
              "idle": {
                "queryState": {
                  "minArgs": 1,
                  "maxArgs": 1
                }
              },
              "management": {
                "get": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "getAll": {
                  "minArgs": 0,
                  "maxArgs": 0
                },
                "getSelf": {
                  "minArgs": 0,
                  "maxArgs": 0
                },
                "setEnabled": {
                  "minArgs": 2,
                  "maxArgs": 2
                },
                "uninstallSelf": {
                  "minArgs": 0,
                  "maxArgs": 1
                }
              },
              "notifications": {
                "clear": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "create": {
                  "minArgs": 1,
                  "maxArgs": 2
                },
                "getAll": {
                  "minArgs": 0,
                  "maxArgs": 0
                },
                "getPermissionLevel": {
                  "minArgs": 0,
                  "maxArgs": 0
                },
                "update": {
                  "minArgs": 2,
                  "maxArgs": 2
                }
              },
              "pageAction": {
                "getPopup": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "getTitle": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "hide": {
                  "minArgs": 1,
                  "maxArgs": 1,
                  "fallbackToNoCallback": true
                },
                "setIcon": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "setPopup": {
                  "minArgs": 1,
                  "maxArgs": 1,
                  "fallbackToNoCallback": true
                },
                "setTitle": {
                  "minArgs": 1,
                  "maxArgs": 1,
                  "fallbackToNoCallback": true
                },
                "show": {
                  "minArgs": 1,
                  "maxArgs": 1,
                  "fallbackToNoCallback": true
                }
              },
              "permissions": {
                "contains": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "getAll": {
                  "minArgs": 0,
                  "maxArgs": 0
                },
                "remove": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "request": {
                  "minArgs": 1,
                  "maxArgs": 1
                }
              },
              "runtime": {
                "getBackgroundPage": {
                  "minArgs": 0,
                  "maxArgs": 0
                },
                "getPlatformInfo": {
                  "minArgs": 0,
                  "maxArgs": 0
                },
                "openOptionsPage": {
                  "minArgs": 0,
                  "maxArgs": 0
                },
                "requestUpdateCheck": {
                  "minArgs": 0,
                  "maxArgs": 0
                },
                "sendMessage": {
                  "minArgs": 1,
                  "maxArgs": 3
                },
                "sendNativeMessage": {
                  "minArgs": 2,
                  "maxArgs": 2
                },
                "setUninstallURL": {
                  "minArgs": 1,
                  "maxArgs": 1
                }
              },
              "sessions": {
                "getDevices": {
                  "minArgs": 0,
                  "maxArgs": 1
                },
                "getRecentlyClosed": {
                  "minArgs": 0,
                  "maxArgs": 1
                },
                "restore": {
                  "minArgs": 0,
                  "maxArgs": 1
                }
              },
              "storage": {
                "local": {
                  "clear": {
                    "minArgs": 0,
                    "maxArgs": 0
                  },
                  "get": {
                    "minArgs": 0,
                    "maxArgs": 1
                  },
                  "getBytesInUse": {
                    "minArgs": 0,
                    "maxArgs": 1
                  },
                  "remove": {
                    "minArgs": 1,
                    "maxArgs": 1
                  },
                  "set": {
                    "minArgs": 1,
                    "maxArgs": 1
                  }
                },
                "managed": {
                  "get": {
                    "minArgs": 0,
                    "maxArgs": 1
                  },
                  "getBytesInUse": {
                    "minArgs": 0,
                    "maxArgs": 1
                  }
                },
                "sync": {
                  "clear": {
                    "minArgs": 0,
                    "maxArgs": 0
                  },
                  "get": {
                    "minArgs": 0,
                    "maxArgs": 1
                  },
                  "getBytesInUse": {
                    "minArgs": 0,
                    "maxArgs": 1
                  },
                  "remove": {
                    "minArgs": 1,
                    "maxArgs": 1
                  },
                  "set": {
                    "minArgs": 1,
                    "maxArgs": 1
                  }
                }
              },
              "tabs": {
                "captureVisibleTab": {
                  "minArgs": 0,
                  "maxArgs": 2
                },
                "create": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "detectLanguage": {
                  "minArgs": 0,
                  "maxArgs": 1
                },
                "discard": {
                  "minArgs": 0,
                  "maxArgs": 1
                },
                "duplicate": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "executeScript": {
                  "minArgs": 1,
                  "maxArgs": 2
                },
                "get": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "getCurrent": {
                  "minArgs": 0,
                  "maxArgs": 0
                },
                "getZoom": {
                  "minArgs": 0,
                  "maxArgs": 1
                },
                "getZoomSettings": {
                  "minArgs": 0,
                  "maxArgs": 1
                },
                "goBack": {
                  "minArgs": 0,
                  "maxArgs": 1
                },
                "goForward": {
                  "minArgs": 0,
                  "maxArgs": 1
                },
                "highlight": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "insertCSS": {
                  "minArgs": 1,
                  "maxArgs": 2
                },
                "move": {
                  "minArgs": 2,
                  "maxArgs": 2
                },
                "query": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "reload": {
                  "minArgs": 0,
                  "maxArgs": 2
                },
                "remove": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "removeCSS": {
                  "minArgs": 1,
                  "maxArgs": 2
                },
                "sendMessage": {
                  "minArgs": 2,
                  "maxArgs": 3
                },
                "setZoom": {
                  "minArgs": 1,
                  "maxArgs": 2
                },
                "setZoomSettings": {
                  "minArgs": 1,
                  "maxArgs": 2
                },
                "update": {
                  "minArgs": 1,
                  "maxArgs": 2
                }
              },
              "topSites": {
                "get": {
                  "minArgs": 0,
                  "maxArgs": 0
                }
              },
              "webNavigation": {
                "getAllFrames": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "getFrame": {
                  "minArgs": 1,
                  "maxArgs": 1
                }
              },
              "webRequest": {
                "handlerBehaviorChanged": {
                  "minArgs": 0,
                  "maxArgs": 0
                }
              },
              "windows": {
                "create": {
                  "minArgs": 0,
                  "maxArgs": 1
                },
                "get": {
                  "minArgs": 1,
                  "maxArgs": 2
                },
                "getAll": {
                  "minArgs": 0,
                  "maxArgs": 1
                },
                "getCurrent": {
                  "minArgs": 0,
                  "maxArgs": 1
                },
                "getLastFocused": {
                  "minArgs": 0,
                  "maxArgs": 1
                },
                "remove": {
                  "minArgs": 1,
                  "maxArgs": 1
                },
                "update": {
                  "minArgs": 2,
                  "maxArgs": 2
                }
              }
            };
            if (Object.keys(apiMetadata).length === 0) {
              throw new Error("api-metadata.json has not been included in browser-polyfill");
            }
            class DefaultWeakMap extends WeakMap {
              constructor(createItem, items = void 0) {
                super(items);
                this.createItem = createItem;
              }
              get(key) {
                if (!this.has(key)) {
                  this.set(key, this.createItem(key));
                }
                return super.get(key);
              }
            }
            const isThenable = (value) => {
              return value && typeof value === "object" && typeof value.then === "function";
            };
            const makeCallback = (promise, metadata) => {
              return (...callbackArgs) => {
                if (extensionAPIs.runtime.lastError) {
                  promise.reject(new Error(extensionAPIs.runtime.lastError.message));
                } else if (metadata.singleCallbackArg || callbackArgs.length <= 1 && metadata.singleCallbackArg !== false) {
                  promise.resolve(callbackArgs[0]);
                } else {
                  promise.resolve(callbackArgs);
                }
              };
            };
            const pluralizeArguments = (numArgs) => numArgs == 1 ? "argument" : "arguments";
            const wrapAsyncFunction = (name, metadata) => {
              return function asyncFunctionWrapper(target, ...args) {
                if (args.length < metadata.minArgs) {
                  throw new Error(`Expected at least ${metadata.minArgs} ${pluralizeArguments(metadata.minArgs)} for ${name}(), got ${args.length}`);
                }
                if (args.length > metadata.maxArgs) {
                  throw new Error(`Expected at most ${metadata.maxArgs} ${pluralizeArguments(metadata.maxArgs)} for ${name}(), got ${args.length}`);
                }
                return new Promise((resolve, reject) => {
                  if (metadata.fallbackToNoCallback) {
                    try {
                      target[name](...args, makeCallback({
                        resolve,
                        reject
                      }, metadata));
                    } catch (cbError) {
                      console.warn(`${name} API method doesn't seem to support the callback parameter, falling back to call it without a callback: `, cbError);
                      target[name](...args);
                      metadata.fallbackToNoCallback = false;
                      metadata.noCallback = true;
                      resolve();
                    }
                  } else if (metadata.noCallback) {
                    target[name](...args);
                    resolve();
                  } else {
                    target[name](...args, makeCallback({
                      resolve,
                      reject
                    }, metadata));
                  }
                });
              };
            };
            const wrapMethod = (target, method, wrapper) => {
              return new Proxy(method, {
                apply(targetMethod, thisObj, args) {
                  return wrapper.call(thisObj, target, ...args);
                }
              });
            };
            let hasOwnProperty = Function.call.bind(Object.prototype.hasOwnProperty);
            const wrapObject = (target, wrappers = {}, metadata = {}) => {
              let cache2 = /* @__PURE__ */ Object.create(null);
              let handlers = {
                has(proxyTarget2, prop) {
                  return prop in target || prop in cache2;
                },
                get(proxyTarget2, prop, receiver) {
                  if (prop in cache2) {
                    return cache2[prop];
                  }
                  if (!(prop in target)) {
                    return void 0;
                  }
                  let value = target[prop];
                  if (typeof value === "function") {
                    if (typeof wrappers[prop] === "function") {
                      value = wrapMethod(target, target[prop], wrappers[prop]);
                    } else if (hasOwnProperty(metadata, prop)) {
                      let wrapper = wrapAsyncFunction(prop, metadata[prop]);
                      value = wrapMethod(target, target[prop], wrapper);
                    } else {
                      value = value.bind(target);
                    }
                  } else if (typeof value === "object" && value !== null && (hasOwnProperty(wrappers, prop) || hasOwnProperty(metadata, prop))) {
                    value = wrapObject(value, wrappers[prop], metadata[prop]);
                  } else if (hasOwnProperty(metadata, "*")) {
                    value = wrapObject(value, wrappers[prop], metadata["*"]);
                  } else {
                    Object.defineProperty(cache2, prop, {
                      configurable: true,
                      enumerable: true,
                      get() {
                        return target[prop];
                      },
                      set(value2) {
                        target[prop] = value2;
                      }
                    });
                    return value;
                  }
                  cache2[prop] = value;
                  return value;
                },
                set(proxyTarget2, prop, value, receiver) {
                  if (prop in cache2) {
                    cache2[prop] = value;
                  } else {
                    target[prop] = value;
                  }
                  return true;
                },
                defineProperty(proxyTarget2, prop, desc) {
                  return Reflect.defineProperty(cache2, prop, desc);
                },
                deleteProperty(proxyTarget2, prop) {
                  return Reflect.deleteProperty(cache2, prop);
                }
              };
              let proxyTarget = Object.create(target);
              return new Proxy(proxyTarget, handlers);
            };
            const wrapEvent = (wrapperMap) => ({
              addListener(target, listener, ...args) {
                target.addListener(wrapperMap.get(listener), ...args);
              },
              hasListener(target, listener) {
                return target.hasListener(wrapperMap.get(listener));
              },
              removeListener(target, listener) {
                target.removeListener(wrapperMap.get(listener));
              }
            });
            const onRequestFinishedWrappers = new DefaultWeakMap((listener) => {
              if (typeof listener !== "function") {
                return listener;
              }
              return function onRequestFinished(req) {
                const wrappedReq = wrapObject(
                  req,
                  {},
                  {
                    getContent: {
                      minArgs: 0,
                      maxArgs: 0
                    }
                  }
                );
                listener(wrappedReq);
              };
            });
            const onMessageWrappers = new DefaultWeakMap((listener) => {
              if (typeof listener !== "function") {
                return listener;
              }
              return function onMessage(message, sender, sendResponse) {
                let didCallSendResponse = false;
                let wrappedSendResponse;
                let sendResponsePromise = new Promise((resolve) => {
                  wrappedSendResponse = function(response) {
                    didCallSendResponse = true;
                    resolve(response);
                  };
                });
                let result;
                try {
                  result = listener(message, sender, wrappedSendResponse);
                } catch (err) {
                  result = Promise.reject(err);
                }
                const isResultThenable = result !== true && isThenable(result);
                if (result !== true && !isResultThenable && !didCallSendResponse) {
                  return false;
                }
                const sendPromisedResult = (promise) => {
                  promise.then((msg) => {
                    sendResponse(msg);
                  }, (error) => {
                    let message2;
                    if (error && (error instanceof Error || typeof error.message === "string")) {
                      message2 = error.message;
                    } else {
                      message2 = "An unexpected error occurred";
                    }
                    sendResponse({
                      __mozWebExtensionPolyfillReject__: true,
                      message: message2
                    });
                  }).catch((err) => {
                    console.error("Failed to send onMessage rejected reply", err);
                  });
                };
                if (isResultThenable) {
                  sendPromisedResult(result);
                } else {
                  sendPromisedResult(sendResponsePromise);
                }
                return true;
              };
            });
            const wrappedSendMessageCallback = ({
              reject,
              resolve
            }, reply) => {
              if (extensionAPIs.runtime.lastError) {
                if (extensionAPIs.runtime.lastError.message === CHROME_SEND_MESSAGE_CALLBACK_NO_RESPONSE_MESSAGE) {
                  resolve();
                } else {
                  reject(new Error(extensionAPIs.runtime.lastError.message));
                }
              } else if (reply && reply.__mozWebExtensionPolyfillReject__) {
                reject(new Error(reply.message));
              } else {
                resolve(reply);
              }
            };
            const wrappedSendMessage = (name, metadata, apiNamespaceObj, ...args) => {
              if (args.length < metadata.minArgs) {
                throw new Error(`Expected at least ${metadata.minArgs} ${pluralizeArguments(metadata.minArgs)} for ${name}(), got ${args.length}`);
              }
              if (args.length > metadata.maxArgs) {
                throw new Error(`Expected at most ${metadata.maxArgs} ${pluralizeArguments(metadata.maxArgs)} for ${name}(), got ${args.length}`);
              }
              return new Promise((resolve, reject) => {
                const wrappedCb = wrappedSendMessageCallback.bind(null, {
                  resolve,
                  reject
                });
                args.push(wrappedCb);
                apiNamespaceObj.sendMessage(...args);
              });
            };
            const staticWrappers = {
              devtools: {
                network: {
                  onRequestFinished: wrapEvent(onRequestFinishedWrappers)
                }
              },
              runtime: {
                onMessage: wrapEvent(onMessageWrappers),
                onMessageExternal: wrapEvent(onMessageWrappers),
                sendMessage: wrappedSendMessage.bind(null, "sendMessage", {
                  minArgs: 1,
                  maxArgs: 3
                })
              },
              tabs: {
                sendMessage: wrappedSendMessage.bind(null, "sendMessage", {
                  minArgs: 2,
                  maxArgs: 3
                })
              }
            };
            const settingMetadata = {
              clear: {
                minArgs: 1,
                maxArgs: 1
              },
              get: {
                minArgs: 1,
                maxArgs: 1
              },
              set: {
                minArgs: 1,
                maxArgs: 1
              }
            };
            apiMetadata.privacy = {
              network: {
                "*": settingMetadata
              },
              services: {
                "*": settingMetadata
              },
              websites: {
                "*": settingMetadata
              }
            };
            return wrapObject(extensionAPIs, staticWrappers, apiMetadata);
          };
          module2.exports = wrapAPIs(chrome);
        } else {
          module2.exports = globalThis.browser;
        }
      });
    }
  });

  // src/popup/index.tsx
  init_preact_module();

  // node_modules/.pnpm/@primer+octicons-react@17.11.1_@preact+compat@17.1.2/node_modules/@primer/octicons-react/dist/index.esm.js
  init_compat();
  var sizeMap = {
    small: 16,
    medium: 32,
    large: 64
  };
  function createIconComponent(name, defaultClassName, getSVGData) {
    var svgDataByHeight = getSVGData();
    var heights = Object.keys(svgDataByHeight);
    function Icon(_ref) {
      var ariaLabel = _ref["aria-label"], tabIndex = _ref.tabIndex, _ref$className = _ref.className, className = _ref$className === void 0 ? defaultClassName : _ref$className, _ref$fill = _ref.fill, fill = _ref$fill === void 0 ? "currentColor" : _ref$fill, _ref$size = _ref.size, size = _ref$size === void 0 ? 16 : _ref$size, _ref$verticalAlign = _ref.verticalAlign, verticalAlign = _ref$verticalAlign === void 0 ? "text-bottom" : _ref$verticalAlign;
      var height = sizeMap[size] || size;
      var naturalHeight = closestNaturalHeight(heights, height);
      var naturalWidth = svgDataByHeight[naturalHeight].width;
      var width = height * (naturalWidth / naturalHeight);
      var path = svgDataByHeight[naturalHeight].path;
      return /* @__PURE__ */ bn.createElement("svg", {
        "aria-hidden": ariaLabel ? "false" : "true",
        tabIndex,
        focusable: tabIndex >= 0 ? "true" : "false",
        "aria-label": ariaLabel,
        role: "img",
        className,
        viewBox: "0 0 ".concat(naturalWidth, " ").concat(naturalHeight),
        width,
        height,
        fill,
        style: {
          display: "inline-block",
          userSelect: "none",
          verticalAlign,
          overflow: "visible"
        }
      }, path);
    }
    Icon.displayName = name;
    return Icon;
  }
  function closestNaturalHeight(naturalHeights, height) {
    return naturalHeights.map(function(naturalHeight) {
      return parseInt(naturalHeight, 10);
    }).reduce(function(acc, naturalHeight) {
      return naturalHeight <= height ? naturalHeight : acc;
    }, naturalHeights[0]);
  }
  var GearIcon = /* @__PURE__ */ createIconComponent("GearIcon", "octicon octicon-gear", function() {
    return {
      "16": {
        "width": 16,
        "path": /* @__PURE__ */ bn.createElement("path", {
          d: "M8 0a8.2 8.2 0 0 1 .701.031C9.444.095 9.99.645 10.16 1.29l.288 1.107c.018.066.079.158.212.224.231.114.454.243.668.386.123.082.233.09.299.071l1.103-.303c.644-.176 1.392.021 1.82.63.27.385.506.792.704 1.218.315.675.111 1.422-.364 1.891l-.814.806c-.049.048-.098.147-.088.294.016.257.016.515 0 .772-.01.147.038.246.088.294l.814.806c.475.469.679 1.216.364 1.891a7.977 7.977 0 0 1-.704 1.217c-.428.61-1.176.807-1.82.63l-1.102-.302c-.067-.019-.177-.011-.3.071a5.909 5.909 0 0 1-.668.386c-.133.066-.194.158-.211.224l-.29 1.106c-.168.646-.715 1.196-1.458 1.26a8.006 8.006 0 0 1-1.402 0c-.743-.064-1.289-.614-1.458-1.26l-.289-1.106c-.018-.066-.079-.158-.212-.224a5.738 5.738 0 0 1-.668-.386c-.123-.082-.233-.09-.299-.071l-1.103.303c-.644.176-1.392-.021-1.82-.63a8.12 8.12 0 0 1-.704-1.218c-.315-.675-.111-1.422.363-1.891l.815-.806c.05-.048.098-.147.088-.294a6.214 6.214 0 0 1 0-.772c.01-.147-.038-.246-.088-.294l-.815-.806C.635 6.045.431 5.298.746 4.623a7.92 7.92 0 0 1 .704-1.217c.428-.61 1.176-.807 1.82-.63l1.102.302c.067.019.177.011.3-.071.214-.143.437-.272.668-.386.133-.066.194-.158.211-.224l.29-1.106C6.009.645 6.556.095 7.299.03 7.53.01 7.764 0 8 0Zm-.571 1.525c-.036.003-.108.036-.137.146l-.289 1.105c-.147.561-.549.967-.998 1.189-.173.086-.34.183-.5.29-.417.278-.97.423-1.529.27l-1.103-.303c-.109-.03-.175.016-.195.045-.22.312-.412.644-.573.99-.014.031-.021.11.059.19l.815.806c.411.406.562.957.53 1.456a4.709 4.709 0 0 0 0 .582c.032.499-.119 1.05-.53 1.456l-.815.806c-.081.08-.073.159-.059.19.162.346.353.677.573.989.02.03.085.076.195.046l1.102-.303c.56-.153 1.113-.008 1.53.27.161.107.328.204.501.29.447.222.85.629.997 1.189l.289 1.105c.029.109.101.143.137.146a6.6 6.6 0 0 0 1.142 0c.036-.003.108-.036.137-.146l.289-1.105c.147-.561.549-.967.998-1.189.173-.086.34-.183.5-.29.417-.278.97-.423 1.529-.27l1.103.303c.109.029.175-.016.195-.045.22-.313.411-.644.573-.99.014-.031.021-.11-.059-.19l-.815-.806c-.411-.406-.562-.957-.53-1.456a4.709 4.709 0 0 0 0-.582c-.032-.499.119-1.05.53-1.456l.815-.806c.081-.08.073-.159.059-.19a6.464 6.464 0 0 0-.573-.989c-.02-.03-.085-.076-.195-.046l-1.102.303c-.56.153-1.113.008-1.53-.27a4.44 4.44 0 0 0-.501-.29c-.447-.222-.85-.629-.997-1.189l-.289-1.105c-.029-.11-.101-.143-.137-.146a6.6 6.6 0 0 0-1.142 0ZM11 8a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM9.5 8a1.5 1.5 0 1 0-3.001.001A1.5 1.5 0 0 0 9.5 8Z"
        })
      },
      "24": {
        "width": 24,
        "path": /* @__PURE__ */ bn.createElement(bn.Fragment, null, /* @__PURE__ */ bn.createElement("path", {
          d: "M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0Zm-1.5 0a2.5 2.5 0 1 0-5 0 2.5 2.5 0 0 0 5 0Z"
        }), /* @__PURE__ */ bn.createElement("path", {
          d: "M12 1c.266 0 .532.009.797.028.763.055 1.345.617 1.512 1.304l.352 1.45c.019.078.09.171.225.221.247.089.49.19.728.302.13.061.246.044.315.002l1.275-.776c.603-.368 1.411-.353 1.99.147.402.349.78.726 1.128 1.129.501.578.515 1.386.147 1.99l-.776 1.274c-.042.069-.058.185.002.315.112.238.213.481.303.728.048.135.142.205.22.225l1.45.352c.687.167 1.249.749 1.303 1.512.038.531.038 1.063 0 1.594-.054.763-.616 1.345-1.303 1.512l-1.45.352c-.078.019-.171.09-.221.225-.089.248-.19.491-.302.728-.061.13-.044.246-.002.315l.776 1.275c.368.603.353 1.411-.147 1.99-.349.402-.726.78-1.129 1.128-.578.501-1.386.515-1.99.147l-1.274-.776c-.069-.042-.185-.058-.314.002a8.606 8.606 0 0 1-.729.303c-.135.048-.205.142-.225.22l-.352 1.45c-.167.687-.749 1.249-1.512 1.303-.531.038-1.063.038-1.594 0-.763-.054-1.345-.616-1.512-1.303l-.352-1.45c-.019-.078-.09-.171-.225-.221a8.138 8.138 0 0 1-.728-.302c-.13-.061-.246-.044-.315-.002l-1.275.776c-.603.368-1.411.353-1.99-.147-.402-.349-.78-.726-1.128-1.129-.501-.578-.515-1.386-.147-1.99l.776-1.274c.042-.069.058-.185-.002-.314a8.606 8.606 0 0 1-.303-.729c-.048-.135-.142-.205-.22-.225l-1.45-.352c-.687-.167-1.249-.749-1.304-1.512a11.158 11.158 0 0 1 0-1.594c.055-.763.617-1.345 1.304-1.512l1.45-.352c.078-.019.171-.09.221-.225.089-.248.19-.491.302-.728.061-.13.044-.246.002-.315l-.776-1.275c-.368-.603-.353-1.411.147-1.99.349-.402.726-.78 1.129-1.128.578-.501 1.386-.515 1.99-.147l1.274.776c.069.042.185.058.315-.002.238-.112.481-.213.728-.303.135-.048.205-.142.225-.22l.352-1.45c.167-.687.749-1.249 1.512-1.304C11.466 1.01 11.732 1 12 1Zm-.69 1.525c-.055.004-.135.05-.161.161l-.353 1.45a1.832 1.832 0 0 1-1.172 1.277 7.147 7.147 0 0 0-.6.249 1.833 1.833 0 0 1-1.734-.074l-1.274-.776c-.098-.06-.186-.036-.228 0a9.774 9.774 0 0 0-.976.976c-.036.042-.06.131 0 .228l.776 1.274c.314.529.342 1.18.074 1.734a7.147 7.147 0 0 0-.249.6 1.831 1.831 0 0 1-1.278 1.173l-1.45.351c-.11.027-.156.107-.16.162a9.63 9.63 0 0 0 0 1.38c.004.055.05.135.161.161l1.45.353a1.832 1.832 0 0 1 1.277 1.172c.074.204.157.404.249.6.268.553.24 1.204-.074 1.733l-.776 1.275c-.06.098-.036.186 0 .228.301.348.628.675.976.976.042.036.131.06.228 0l1.274-.776a1.83 1.83 0 0 1 1.734-.075c.196.093.396.176.6.25a1.831 1.831 0 0 1 1.173 1.278l.351 1.45c.027.11.107.156.162.16a9.63 9.63 0 0 0 1.38 0c.055-.004.135-.05.161-.161l.353-1.45a1.834 1.834 0 0 1 1.172-1.278 6.82 6.82 0 0 0 .6-.248 1.831 1.831 0 0 1 1.733.074l1.275.776c.098.06.186.036.228 0 .348-.301.675-.628.976-.976.036-.042.06-.131 0-.228l-.776-1.275a1.834 1.834 0 0 1-.075-1.733c.093-.196.176-.396.25-.6a1.831 1.831 0 0 1 1.278-1.173l1.45-.351c.11-.027.156-.107.16-.162a9.63 9.63 0 0 0 0-1.38c-.004-.055-.05-.135-.161-.161l-1.45-.353c-.626-.152-1.08-.625-1.278-1.172a6.576 6.576 0 0 0-.248-.6 1.833 1.833 0 0 1 .074-1.734l.776-1.274c.06-.098.036-.186 0-.228a9.774 9.774 0 0 0-.976-.976c-.042-.036-.131-.06-.228 0l-1.275.776a1.831 1.831 0 0 1-1.733.074 6.88 6.88 0 0 0-.6-.249 1.835 1.835 0 0 1-1.173-1.278l-.351-1.45c-.027-.11-.107-.156-.162-.16a9.63 9.63 0 0 0-1.38 0Z"
        }))
      }
    };
  });
  var GlobeIcon = /* @__PURE__ */ createIconComponent("GlobeIcon", "octicon octicon-globe", function() {
    return {
      "16": {
        "width": 16,
        "path": /* @__PURE__ */ bn.createElement("path", {
          d: "M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0ZM5.78 8.75a9.64 9.64 0 0 0 1.363 4.177c.255.426.542.832.857 1.215.245-.296.551-.705.857-1.215A9.64 9.64 0 0 0 10.22 8.75Zm4.44-1.5a9.64 9.64 0 0 0-1.363-4.177c-.307-.51-.612-.919-.857-1.215a9.927 9.927 0 0 0-.857 1.215A9.64 9.64 0 0 0 5.78 7.25Zm-5.944 1.5H1.543a6.507 6.507 0 0 0 4.666 5.5c-.123-.181-.24-.365-.352-.552-.715-1.192-1.437-2.874-1.581-4.948Zm-2.733-1.5h2.733c.144-2.074.866-3.756 1.58-4.948.12-.197.237-.381.353-.552a6.507 6.507 0 0 0-4.666 5.5Zm10.181 1.5c-.144 2.074-.866 3.756-1.58 4.948-.12.197-.237.381-.353.552a6.507 6.507 0 0 0 4.666-5.5Zm2.733-1.5a6.507 6.507 0 0 0-4.666-5.5c.123.181.24.365.353.552.714 1.192 1.436 2.874 1.58 4.948Z"
        })
      },
      "24": {
        "width": 24,
        "path": /* @__PURE__ */ bn.createElement("path", {
          d: "M12 1c6.075 0 11 4.925 11 11s-4.925 11-11 11S1 18.075 1 12 5.925 1 12 1Zm3.241 10.5v-.001c-.1-2.708-.992-4.904-1.89-6.452a13.919 13.919 0 0 0-1.304-1.88L12 3.11l-.047.059c-.354.425-.828 1.06-1.304 1.88-.898 1.547-1.79 3.743-1.89 6.451Zm-12.728 0h4.745c.1-3.037 1.1-5.49 2.093-7.204.39-.672.78-1.233 1.119-1.673C6.11 3.329 2.746 7 2.513 11.5Zm18.974 0C21.254 7 17.89 3.329 13.53 2.623c.339.44.729 1.001 1.119 1.673.993 1.714 1.993 4.167 2.093 7.204ZM8.787 13c.182 2.478 1.02 4.5 1.862 5.953.382.661.818 1.29 1.304 1.88l.047.057.047-.059c.354-.425.828-1.06 1.304-1.88.842-1.451 1.679-3.471 1.862-5.951Zm-1.504 0H2.552a9.505 9.505 0 0 0 7.918 8.377 15.773 15.773 0 0 1-1.119-1.673C8.413 18.085 7.47 15.807 7.283 13Zm9.434 0c-.186 2.807-1.13 5.085-2.068 6.704-.39.672-.78 1.233-1.118 1.673A9.506 9.506 0 0 0 21.447 13Z"
        })
      }
    };
  });

  // src/popup/App.tsx
  init_compat();

  // node_modules/.pnpm/swr@2.0.3_@preact+compat@17.1.2/node_modules/swr/core/dist/index.mjs
  init_compat();
  var import_shim = __toESM(require_shim(), 1);

  // node_modules/.pnpm/swr@2.0.3_@preact+compat@17.1.2/node_modules/swr/_internal/dist/index.mjs
  init_compat();
  var SWRGlobalState = /* @__PURE__ */ new WeakMap();
  var EMPTY_CACHE = {};
  var INITIAL_CACHE = {};
  var noop = () => {
  };
  var UNDEFINED = (
    /*#__NOINLINE__*/
    noop()
  );
  var OBJECT = Object;
  var isUndefined = (v3) => v3 === UNDEFINED;
  var isFunction = (v3) => typeof v3 == "function";
  var mergeObjects = (a3, b3) => ({
    ...a3,
    ...b3
  });
  var STR_UNDEFINED = "undefined";
  var isWindowDefined = typeof window != STR_UNDEFINED;
  var isDocumentDefined = typeof document != STR_UNDEFINED;
  var hasRequestAnimationFrame = () => isWindowDefined && typeof window["requestAnimationFrame"] != STR_UNDEFINED;
  var createCacheHelper = (cache2, key) => {
    const state = SWRGlobalState.get(cache2);
    return [
      // Getter
      () => cache2.get(key) || EMPTY_CACHE,
      // Setter
      (info) => {
        if (!isUndefined(key)) {
          const prev = cache2.get(key);
          if (!(key in INITIAL_CACHE)) {
            INITIAL_CACHE[key] = prev;
          }
          state[5](key, mergeObjects(prev, info), prev || EMPTY_CACHE);
        }
      },
      // Subscriber
      state[6],
      // Get server cache snapshot
      () => {
        if (!isUndefined(key)) {
          if (key in INITIAL_CACHE)
            return INITIAL_CACHE[key];
        }
        return cache2.get(key) || EMPTY_CACHE;
      }
    ];
  };
  var table = /* @__PURE__ */ new WeakMap();
  var counter = 0;
  var stableHash = (arg) => {
    const type = typeof arg;
    const constructor = arg && arg.constructor;
    const isDate = constructor == Date;
    let result;
    let index;
    if (OBJECT(arg) === arg && !isDate && constructor != RegExp) {
      result = table.get(arg);
      if (result)
        return result;
      result = ++counter + "~";
      table.set(arg, result);
      if (constructor == Array) {
        result = "@";
        for (index = 0; index < arg.length; index++) {
          result += stableHash(arg[index]) + ",";
        }
        table.set(arg, result);
      }
      if (constructor == OBJECT) {
        result = "#";
        const keys = OBJECT.keys(arg).sort();
        while (!isUndefined(index = keys.pop())) {
          if (!isUndefined(arg[index])) {
            result += index + ":" + stableHash(arg[index]) + ",";
          }
        }
        table.set(arg, result);
      }
    } else {
      result = isDate ? arg.toJSON() : type == "symbol" ? arg.toString() : type == "string" ? JSON.stringify(arg) : "" + arg;
    }
    return result;
  };
  var online = true;
  var isOnline = () => online;
  var [onWindowEvent, offWindowEvent] = isWindowDefined && window.addEventListener ? [
    window.addEventListener.bind(window),
    window.removeEventListener.bind(window)
  ] : [
    noop,
    noop
  ];
  var isVisible = () => {
    const visibilityState = isDocumentDefined && document.visibilityState;
    return isUndefined(visibilityState) || visibilityState !== "hidden";
  };
  var initFocus = (callback) => {
    if (isDocumentDefined) {
      document.addEventListener("visibilitychange", callback);
    }
    onWindowEvent("focus", callback);
    return () => {
      if (isDocumentDefined) {
        document.removeEventListener("visibilitychange", callback);
      }
      offWindowEvent("focus", callback);
    };
  };
  var initReconnect = (callback) => {
    const onOnline = () => {
      online = true;
      callback();
    };
    const onOffline = () => {
      online = false;
    };
    onWindowEvent("online", onOnline);
    onWindowEvent("offline", onOffline);
    return () => {
      offWindowEvent("online", onOnline);
      offWindowEvent("offline", onOffline);
    };
  };
  var preset = {
    isOnline,
    isVisible
  };
  var defaultConfigOptions = {
    initFocus,
    initReconnect
  };
  var IS_REACT_LEGACY = !bn.useId;
  var IS_SERVER = !isWindowDefined || "Deno" in window;
  var rAF = (f3) => hasRequestAnimationFrame() ? window["requestAnimationFrame"](f3) : setTimeout(f3, 1);
  var useIsomorphicLayoutEffect = IS_SERVER ? h2 : s2;
  var navigatorConnection = typeof navigator !== "undefined" && navigator.connection;
  var slowConnection = !IS_SERVER && navigatorConnection && ([
    "slow-2g",
    "2g"
  ].includes(navigatorConnection.effectiveType) || navigatorConnection.saveData);
  var serialize = (key) => {
    if (isFunction(key)) {
      try {
        key = key();
      } catch (err) {
        key = "";
      }
    }
    const args = key;
    key = typeof key == "string" ? key : (Array.isArray(key) ? key.length : key) ? stableHash(key) : "";
    return [
      key,
      args
    ];
  };
  var __timestamp = 0;
  var getTimestamp = () => ++__timestamp;
  var FOCUS_EVENT = 0;
  var RECONNECT_EVENT = 1;
  var MUTATE_EVENT = 2;
  var constants = {
    __proto__: null,
    FOCUS_EVENT,
    RECONNECT_EVENT,
    MUTATE_EVENT
  };
  async function internalMutate(...args) {
    const [cache2, _key, _data, _opts] = args;
    const options = mergeObjects({
      populateCache: true,
      throwOnError: true
    }, typeof _opts === "boolean" ? {
      revalidate: _opts
    } : _opts || {});
    let populateCache = options.populateCache;
    const rollbackOnErrorOption = options.rollbackOnError;
    let optimisticData = options.optimisticData;
    const revalidate = options.revalidate !== false;
    const rollbackOnError = (error) => {
      return typeof rollbackOnErrorOption === "function" ? rollbackOnErrorOption(error) : rollbackOnErrorOption !== false;
    };
    const throwOnError = options.throwOnError;
    if (isFunction(_key)) {
      const keyFilter = _key;
      const matchedKeys = [];
      const it = cache2.keys();
      for (let keyIt = it.next(); !keyIt.done; keyIt = it.next()) {
        const key = keyIt.value;
        if (
          // Skip the special useSWRInfinite keys.
          !key.startsWith("$inf$") && keyFilter(cache2.get(key)._k)
        ) {
          matchedKeys.push(key);
        }
      }
      return Promise.all(matchedKeys.map(mutateByKey));
    }
    return mutateByKey(_key);
    async function mutateByKey(_k) {
      const [key] = serialize(_k);
      if (!key)
        return;
      const [get, set] = createCacheHelper(cache2, key);
      const [EVENT_REVALIDATORS, MUTATION, FETCH] = SWRGlobalState.get(cache2);
      const revalidators = EVENT_REVALIDATORS[key];
      const startRevalidate = () => {
        if (revalidate) {
          delete FETCH[key];
          if (revalidators && revalidators[0]) {
            return revalidators[0](MUTATE_EVENT).then(() => get().data);
          }
        }
        return get().data;
      };
      if (args.length < 3) {
        return startRevalidate();
      }
      let data = _data;
      let error;
      const beforeMutationTs = getTimestamp();
      MUTATION[key] = [
        beforeMutationTs,
        0
      ];
      const hasOptimisticData = !isUndefined(optimisticData);
      const state = get();
      const displayedData = state.data;
      const currentData = state._c;
      const committedData = isUndefined(currentData) ? displayedData : currentData;
      if (hasOptimisticData) {
        optimisticData = isFunction(optimisticData) ? optimisticData(committedData) : optimisticData;
        set({
          data: optimisticData,
          _c: committedData
        });
      }
      if (isFunction(data)) {
        try {
          data = data(committedData);
        } catch (err) {
          error = err;
        }
      }
      if (data && isFunction(data.then)) {
        data = await data.catch((err) => {
          error = err;
        });
        if (beforeMutationTs !== MUTATION[key][0]) {
          if (error)
            throw error;
          return data;
        } else if (error && hasOptimisticData && rollbackOnError(error)) {
          populateCache = true;
          data = committedData;
          set({
            data,
            _c: UNDEFINED
          });
        }
      }
      if (populateCache) {
        if (!error) {
          if (isFunction(populateCache)) {
            data = populateCache(data, committedData);
          }
          set({
            data,
            _c: UNDEFINED
          });
        }
      }
      MUTATION[key][1] = getTimestamp();
      const res = await startRevalidate();
      set({
        _c: UNDEFINED
      });
      if (error) {
        if (throwOnError)
          throw error;
        return;
      }
      return populateCache ? res : data;
    }
  }
  var revalidateAllKeys = (revalidators, type) => {
    for (const key in revalidators) {
      if (revalidators[key][0])
        revalidators[key][0](type);
    }
  };
  var initCache = (provider, options) => {
    if (!SWRGlobalState.has(provider)) {
      const opts = mergeObjects(defaultConfigOptions, options);
      const EVENT_REVALIDATORS = {};
      const mutate2 = internalMutate.bind(UNDEFINED, provider);
      let unmount = noop;
      const subscriptions = {};
      const subscribe = (key, callback) => {
        const subs = subscriptions[key] || [];
        subscriptions[key] = subs;
        subs.push(callback);
        return () => subs.splice(subs.indexOf(callback), 1);
      };
      const setter = (key, value, prev) => {
        provider.set(key, value);
        const subs = subscriptions[key];
        if (subs) {
          for (let i3 = subs.length; i3--; ) {
            subs[i3](value, prev);
          }
        }
      };
      const initProvider = () => {
        if (!SWRGlobalState.has(provider)) {
          SWRGlobalState.set(provider, [
            EVENT_REVALIDATORS,
            {},
            {},
            {},
            mutate2,
            setter,
            subscribe
          ]);
          if (!IS_SERVER) {
            const releaseFocus = opts.initFocus(setTimeout.bind(UNDEFINED, revalidateAllKeys.bind(UNDEFINED, EVENT_REVALIDATORS, FOCUS_EVENT)));
            const releaseReconnect = opts.initReconnect(setTimeout.bind(UNDEFINED, revalidateAllKeys.bind(UNDEFINED, EVENT_REVALIDATORS, RECONNECT_EVENT)));
            unmount = () => {
              releaseFocus && releaseFocus();
              releaseReconnect && releaseReconnect();
              SWRGlobalState.delete(provider);
            };
          }
        }
      };
      initProvider();
      return [
        provider,
        mutate2,
        initProvider,
        unmount
      ];
    }
    return [
      provider,
      SWRGlobalState.get(provider)[4]
    ];
  };
  var onErrorRetry = (_4, __, config, revalidate, opts) => {
    const maxRetryCount = config.errorRetryCount;
    const currentRetryCount = opts.retryCount;
    const timeout = ~~((Math.random() + 0.5) * (1 << (currentRetryCount < 8 ? currentRetryCount : 8))) * config.errorRetryInterval;
    if (!isUndefined(maxRetryCount) && currentRetryCount > maxRetryCount) {
      return;
    }
    setTimeout(revalidate, timeout, opts);
  };
  var compare = (currentData, newData) => stableHash(currentData) == stableHash(newData);
  var [cache, mutate] = initCache(/* @__PURE__ */ new Map());
  var defaultConfig = mergeObjects(
    {
      // events
      onLoadingSlow: noop,
      onSuccess: noop,
      onError: noop,
      onErrorRetry,
      onDiscarded: noop,
      // switches
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      revalidateIfStale: true,
      shouldRetryOnError: true,
      // timeouts
      errorRetryInterval: slowConnection ? 1e4 : 5e3,
      focusThrottleInterval: 5 * 1e3,
      dedupingInterval: 2 * 1e3,
      loadingTimeout: slowConnection ? 5e3 : 3e3,
      // providers
      compare,
      isPaused: () => false,
      cache,
      mutate,
      fallback: {}
    },
    // use web preset by default
    preset
  );
  var mergeConfigs = (a3, b3) => {
    const v3 = mergeObjects(a3, b3);
    if (b3) {
      const { use: u1, fallback: f1 } = a3;
      const { use: u22, fallback: f22 } = b3;
      if (u1 && u22) {
        v3.use = u1.concat(u22);
      }
      if (f1 && f22) {
        v3.fallback = mergeObjects(f1, f22);
      }
    }
    return v3;
  };
  var SWRConfigContext = B({});
  var SWRConfig = (props) => {
    const { value } = props;
    const parentConfig = q2(SWRConfigContext);
    const isFunctionalConfig = isFunction(value);
    const config = F(() => isFunctionalConfig ? value(parentConfig) : value, [
      isFunctionalConfig,
      parentConfig,
      value
    ]);
    const extendedConfig = F(() => isFunctionalConfig ? config : mergeConfigs(parentConfig, config), [
      isFunctionalConfig,
      parentConfig,
      config
    ]);
    const provider = config && config.provider;
    const [cacheContext] = p2(() => provider ? initCache(provider(extendedConfig.cache || cache), config) : UNDEFINED);
    if (cacheContext) {
      extendedConfig.cache = cacheContext[0];
      extendedConfig.mutate = cacheContext[1];
    }
    useIsomorphicLayoutEffect(() => {
      if (cacheContext) {
        cacheContext[2] && cacheContext[2]();
        return cacheContext[3];
      }
    }, []);
    return h(SWRConfigContext.Provider, mergeObjects(props, {
      value: extendedConfig
    }));
  };
  var enableDevtools = isWindowDefined && window.__SWR_DEVTOOLS_USE__;
  var use = enableDevtools ? window.__SWR_DEVTOOLS_USE__ : [];
  var setupDevTools = () => {
    if (enableDevtools) {
      window.__SWR_DEVTOOLS_REACT__ = bn;
    }
  };
  var normalize = (args) => {
    return isFunction(args[1]) ? [
      args[0],
      args[1],
      args[2] || {}
    ] : [
      args[0],
      null,
      (args[1] === null ? args[2] : args[1]) || {}
    ];
  };
  var useSWRConfig = () => {
    return mergeObjects(defaultConfig, q2(SWRConfigContext));
  };
  var middleware = (useSWRNext) => (key_, fetcher_, config) => {
    const fetcher = fetcher_ && ((...args) => {
      const key = serialize(key_)[0];
      const [, , , PRELOAD] = SWRGlobalState.get(cache);
      const req = PRELOAD[key];
      if (req) {
        delete PRELOAD[key];
        return req;
      }
      return fetcher_(...args);
    });
    return useSWRNext(key_, fetcher, config);
  };
  var BUILT_IN_MIDDLEWARE = use.concat(middleware);
  var withArgs = (hook) => {
    return function useSWRArgs(...args) {
      const fallbackConfig = useSWRConfig();
      const [key, fn2, _config] = normalize(args);
      const config = mergeConfigs(fallbackConfig, _config);
      let next = hook;
      const { use: use2 } = config;
      const middleware2 = (use2 || []).concat(BUILT_IN_MIDDLEWARE);
      for (let i3 = middleware2.length; i3--; ) {
        next = middleware2[i3](next);
      }
      return next(key, fn2 || config.fetcher || null, config);
    };
  };
  var subscribeCallback = (key, callbacks, callback) => {
    const keyedRevalidators = callbacks[key] || (callbacks[key] = []);
    keyedRevalidators.push(callback);
    return () => {
      const index = keyedRevalidators.indexOf(callback);
      if (index >= 0) {
        keyedRevalidators[index] = keyedRevalidators[keyedRevalidators.length - 1];
        keyedRevalidators.pop();
      }
    };
  };
  setupDevTools();

  // node_modules/.pnpm/swr@2.0.3_@preact+compat@17.1.2/node_modules/swr/core/dist/index.mjs
  var WITH_DEDUPE = {
    dedupe: true
  };
  var useSWRHandler = (_key, fetcher, config) => {
    const { cache: cache2, compare: compare2, suspense, fallbackData, revalidateOnMount, revalidateIfStale, refreshInterval, refreshWhenHidden, refreshWhenOffline, keepPreviousData } = config;
    const [EVENT_REVALIDATORS, MUTATION, FETCH] = SWRGlobalState.get(cache2);
    const [key, fnArg] = serialize(_key);
    const initialMountedRef = _2(false);
    const unmountedRef = _2(false);
    const keyRef = _2(key);
    const fetcherRef = _2(fetcher);
    const configRef = _2(config);
    const getConfig = () => configRef.current;
    const isActive = () => getConfig().isVisible() && getConfig().isOnline();
    const [getCache, setCache, subscribeCache, getInitialCache] = createCacheHelper(cache2, key);
    const stateDependencies = _2({}).current;
    const fallback = isUndefined(fallbackData) ? config.fallback[key] : fallbackData;
    const isEqual = (prev, current) => {
      let equal = true;
      for (const _4 in stateDependencies) {
        const t3 = _4;
        if (t3 === "data") {
          if (!compare2(current[t3], prev[t3])) {
            if (isUndefined(prev[t3])) {
              if (!compare2(current[t3], returnedData)) {
                equal = false;
              }
            } else {
              equal = false;
            }
          }
        } else {
          if (current[t3] !== prev[t3]) {
            equal = false;
          }
        }
      }
      return equal;
    };
    const getSnapshot = F(() => {
      const shouldStartRequest = (() => {
        if (!key)
          return false;
        if (!fetcher)
          return false;
        if (!isUndefined(revalidateOnMount))
          return revalidateOnMount;
        if (getConfig().isPaused())
          return false;
        if (suspense)
          return false;
        if (!isUndefined(revalidateIfStale))
          return revalidateIfStale;
        return true;
      })();
      const getSelectedCache = (state) => {
        const snapshot = mergeObjects(state);
        delete snapshot._k;
        if (!shouldStartRequest) {
          return snapshot;
        }
        return {
          isValidating: true,
          isLoading: true,
          ...snapshot
        };
      };
      let memorizedSnapshot = getSelectedCache(getCache());
      const memorizedInitialSnapshot = getSelectedCache(getInitialCache());
      return [
        () => {
          const newSnapshot = getSelectedCache(getCache());
          return isEqual(newSnapshot, memorizedSnapshot) ? memorizedSnapshot : memorizedSnapshot = newSnapshot;
        },
        () => memorizedInitialSnapshot
      ];
    }, [
      cache2,
      key
    ]);
    const cached = (0, import_shim.useSyncExternalStore)(T2(
      (callback) => subscribeCache(key, (current, prev) => {
        if (!isEqual(prev, current))
          callback();
      }),
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [
        cache2,
        key
      ]
    ), getSnapshot[0], getSnapshot[1]);
    const isInitialMount = !initialMountedRef.current;
    const hasRevalidator = EVENT_REVALIDATORS[key] && EVENT_REVALIDATORS[key].length > 0;
    const cachedData = cached.data;
    const data = isUndefined(cachedData) ? fallback : cachedData;
    const error = cached.error;
    const laggyDataRef = _2(data);
    const returnedData = keepPreviousData ? isUndefined(cachedData) ? laggyDataRef.current : cachedData : data;
    const shouldDoInitialRevalidation = (() => {
      if (hasRevalidator && !isUndefined(error))
        return false;
      if (isInitialMount && !isUndefined(revalidateOnMount))
        return revalidateOnMount;
      if (getConfig().isPaused())
        return false;
      if (suspense)
        return isUndefined(data) ? false : revalidateIfStale;
      return isUndefined(data) || revalidateIfStale;
    })();
    const defaultValidatingState = !!(key && fetcher && isInitialMount && shouldDoInitialRevalidation);
    const isValidating = isUndefined(cached.isValidating) ? defaultValidatingState : cached.isValidating;
    const isLoading = isUndefined(cached.isLoading) ? defaultValidatingState : cached.isLoading;
    const revalidate = T2(
      async (revalidateOpts) => {
        const currentFetcher = fetcherRef.current;
        if (!key || !currentFetcher || unmountedRef.current || getConfig().isPaused()) {
          return false;
        }
        let newData;
        let startAt;
        let loading = true;
        const opts = revalidateOpts || {};
        const shouldStartNewRequest = !FETCH[key] || !opts.dedupe;
        const callbackSafeguard = () => {
          if (IS_REACT_LEGACY) {
            return !unmountedRef.current && key === keyRef.current && initialMountedRef.current;
          }
          return key === keyRef.current;
        };
        const finalState = {
          isValidating: false,
          isLoading: false
        };
        const finishRequestAndUpdateState = () => {
          setCache(finalState);
        };
        const cleanupState = () => {
          const requestInfo = FETCH[key];
          if (requestInfo && requestInfo[1] === startAt) {
            delete FETCH[key];
          }
        };
        const initialState = {
          isValidating: true
        };
        if (isUndefined(getCache().data)) {
          initialState.isLoading = true;
        }
        try {
          if (shouldStartNewRequest) {
            setCache(initialState);
            if (config.loadingTimeout && isUndefined(getCache().data)) {
              setTimeout(() => {
                if (loading && callbackSafeguard()) {
                  getConfig().onLoadingSlow(key, config);
                }
              }, config.loadingTimeout);
            }
            FETCH[key] = [
              currentFetcher(fnArg),
              getTimestamp()
            ];
          }
          [newData, startAt] = FETCH[key];
          newData = await newData;
          if (shouldStartNewRequest) {
            setTimeout(cleanupState, config.dedupingInterval);
          }
          if (!FETCH[key] || FETCH[key][1] !== startAt) {
            if (shouldStartNewRequest) {
              if (callbackSafeguard()) {
                getConfig().onDiscarded(key);
              }
            }
            return false;
          }
          finalState.error = UNDEFINED;
          const mutationInfo = MUTATION[key];
          if (!isUndefined(mutationInfo) && // case 1
          (startAt <= mutationInfo[0] || // case 2
          startAt <= mutationInfo[1] || // case 3
          mutationInfo[1] === 0)) {
            finishRequestAndUpdateState();
            if (shouldStartNewRequest) {
              if (callbackSafeguard()) {
                getConfig().onDiscarded(key);
              }
            }
            return false;
          }
          const cacheData = getCache().data;
          finalState.data = compare2(cacheData, newData) ? cacheData : newData;
          if (shouldStartNewRequest) {
            if (callbackSafeguard()) {
              getConfig().onSuccess(newData, key, config);
            }
          }
        } catch (err) {
          cleanupState();
          const currentConfig = getConfig();
          const { shouldRetryOnError } = currentConfig;
          if (!currentConfig.isPaused()) {
            finalState.error = err;
            if (shouldStartNewRequest && callbackSafeguard()) {
              currentConfig.onError(err, key, currentConfig);
              if (shouldRetryOnError === true || isFunction(shouldRetryOnError) && shouldRetryOnError(err)) {
                if (isActive()) {
                  currentConfig.onErrorRetry(err, key, currentConfig, revalidate, {
                    retryCount: (opts.retryCount || 0) + 1,
                    dedupe: true
                  });
                }
              }
            }
          }
        }
        loading = false;
        finishRequestAndUpdateState();
        return true;
      },
      // `setState` is immutable, and `eventsCallback`, `fnArg`, and
      // `keyValidating` are depending on `key`, so we can exclude them from
      // the deps array.
      //
      // FIXME:
      // `fn` and `config` might be changed during the lifecycle,
      // but they might be changed every render like this.
      // `useSWR('key', () => fetch('/api/'), { suspense: true })`
      // So we omit the values from the deps array
      // even though it might cause unexpected behaviors.
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [
        key,
        cache2
      ]
    );
    const boundMutate = T2(
      // Use callback to make sure `keyRef.current` returns latest result every time
      (...args) => {
        return internalMutate(cache2, keyRef.current, ...args);
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      []
    );
    useIsomorphicLayoutEffect(() => {
      fetcherRef.current = fetcher;
      configRef.current = config;
      if (!isUndefined(cachedData)) {
        laggyDataRef.current = cachedData;
      }
    });
    useIsomorphicLayoutEffect(() => {
      if (!key)
        return;
      const softRevalidate = revalidate.bind(UNDEFINED, WITH_DEDUPE);
      let nextFocusRevalidatedAt = 0;
      const onRevalidate = (type) => {
        if (type == constants.FOCUS_EVENT) {
          const now = Date.now();
          if (getConfig().revalidateOnFocus && now > nextFocusRevalidatedAt && isActive()) {
            nextFocusRevalidatedAt = now + getConfig().focusThrottleInterval;
            softRevalidate();
          }
        } else if (type == constants.RECONNECT_EVENT) {
          if (getConfig().revalidateOnReconnect && isActive()) {
            softRevalidate();
          }
        } else if (type == constants.MUTATE_EVENT) {
          return revalidate();
        }
        return;
      };
      const unsubEvents = subscribeCallback(key, EVENT_REVALIDATORS, onRevalidate);
      unmountedRef.current = false;
      keyRef.current = key;
      initialMountedRef.current = true;
      setCache({
        _k: fnArg
      });
      if (shouldDoInitialRevalidation) {
        if (isUndefined(data) || IS_SERVER) {
          softRevalidate();
        } else {
          rAF(softRevalidate);
        }
      }
      return () => {
        unmountedRef.current = true;
        unsubEvents();
      };
    }, [
      key
    ]);
    useIsomorphicLayoutEffect(() => {
      let timer;
      function next() {
        const interval = isFunction(refreshInterval) ? refreshInterval(data) : refreshInterval;
        if (interval && timer !== -1) {
          timer = setTimeout(execute, interval);
        }
      }
      function execute() {
        if (!getCache().error && (refreshWhenHidden || getConfig().isVisible()) && (refreshWhenOffline || getConfig().isOnline())) {
          revalidate(WITH_DEDUPE).then(next);
        } else {
          next();
        }
      }
      next();
      return () => {
        if (timer) {
          clearTimeout(timer);
          timer = -1;
        }
      };
    }, [
      refreshInterval,
      refreshWhenHidden,
      refreshWhenOffline,
      key
    ]);
    x2(returnedData);
    if (suspense && isUndefined(data) && key) {
      if (!IS_REACT_LEGACY && IS_SERVER) {
        throw new Error("Fallback data is required when using suspense in SSR.");
      }
      fetcherRef.current = fetcher;
      configRef.current = config;
      unmountedRef.current = false;
      throw isUndefined(error) ? revalidate(WITH_DEDUPE) : error;
    }
    return {
      mutate: boundMutate,
      get data() {
        stateDependencies.data = true;
        return returnedData;
      },
      get error() {
        stateDependencies.error = true;
        return error;
      },
      get isValidating() {
        stateDependencies.isValidating = true;
        return isValidating;
      },
      get isLoading() {
        stateDependencies.isLoading = true;
        return isLoading;
      }
    };
  };
  var SWRConfig2 = OBJECT.defineProperty(SWRConfig, "defaultValue", {
    value: defaultConfig
  });
  var useSWR = withArgs(useSWRHandler);

  // src/popup/App.tsx
  var import_webextension_polyfill = __toESM(require_browser_polyfill());

  // src/logo.png
  var logo_default = "data:image/png;base64,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";

  // node_modules/.pnpm/preact@10.11.3/node_modules/preact/jsx-runtime/dist/jsxRuntime.module.js
  init_preact_module();
  init_preact_module();
  var _3 = 0;
  function o3(o4, e3, n2, t3, f3) {
    var l3, s3, u3 = {};
    for (s3 in e3)
      "ref" == s3 ? l3 = e3[s3] : u3[s3] = e3[s3];
    var a3 = { type: o4, props: u3, key: n2, ref: l3, __k: null, __: null, __b: 0, __e: null, __d: void 0, __c: null, __h: null, constructor: void 0, __v: --_3, __source: f3, __self: t3 };
    if ("function" == typeof o4 && (l3 = o4.defaultProps))
      for (s3 in l3)
        void 0 === u3[s3] && (u3[s3] = l3[s3]);
    return l.vnode && l.vnode(a3), a3;
  }

  // src/popup/App.tsx
  var isChrome = /chrome/i.test(navigator.userAgent);
  function App() {
    const accessTokenQuery = useSWR(
      "accessToken",
      () => import_webextension_polyfill.default.runtime.sendMessage({ type: "GET_ACCESS_TOKEN" }),
      { shouldRetryOnError: false }
    );
    const hideShortcutsTipQuery = useSWR("hideShortcutsTip", async () => {
      const { hideShortcutsTip } = await import_webextension_polyfill.default.storage.local.get("hideShortcutsTip");
      return !!hideShortcutsTip;
    });
    const openOptionsPage = T2(() => {
      import_webextension_polyfill.default.runtime.sendMessage({ type: "OPEN_OPTIONS_PAGE" });
    }, []);
    const openShortcutsPage = T2(() => {
      import_webextension_polyfill.default.storage.local.set({ hideShortcutsTip: true });
      import_webextension_polyfill.default.tabs.create({ url: "chrome://extensions/shortcuts" });
    }, []);
    return /* @__PURE__ */ o3("div", { className: "glarity--flex glarity--flex-col glarity--h-full", children: [
      /* @__PURE__ */ o3("div", { className: "glarity--mb-2 glarity--flex glarity--flex-row glarity--items-center glarity--px-1", children: [
        /* @__PURE__ */ o3("img", { src: logo_default, className: "glarity--w-5 glarity--h-5 glarity--rounded-sm" }),
        /* @__PURE__ */ o3("p", { className: "glarity--text-sm glarity--font-semibold glarity--m-0 glarity--ml-1", children: "Glarity" }),
        /* @__PURE__ */ o3("div", { className: "glarity--grow" }),
        /* @__PURE__ */ o3("span", { className: "glarity--cursor-pointer glarity--leading-[0]", onClick: openOptionsPage, children: /* @__PURE__ */ o3(GearIcon, { size: 16 }) })
      ] }),
      isChrome && !hideShortcutsTipQuery.isLoading && !hideShortcutsTipQuery.data && /* @__PURE__ */ o3("p", { className: "glarity--m-0 glarity--mb-2", children: [
        "Tip:",
        " ",
        /* @__PURE__ */ o3("a", { onClick: openShortcutsPage, className: "glarity--underline glarity--cursor-pointer", children: "setup shortcuts" }),
        " ",
        "for faster access."
      ] }),
      (() => {
        if (accessTokenQuery.isLoading) {
          return /* @__PURE__ */ o3("div", { className: "glarity--grow glarity--justify-center glarity--items-center glarity--flex glarity--animate-bounce", children: /* @__PURE__ */ o3(GlobeIcon, { size: 24 }) });
        }
        if (accessTokenQuery.data) {
          return /* @__PURE__ */ o3("iframe", { src: "https://chat.openai.com", className: "glarity--grow glarity--border-none" });
        }
        return /* @__PURE__ */ o3("div", { className: "glarity--grow glarity--flex glarity--flex-col glarity--justify-center", children: /* @__PURE__ */ o3("p", { className: "glarity--text-base glarity--px-2 glarity--text-center", children: [
          "Please login and pass Cloudflare check at",
          " ",
          /* @__PURE__ */ o3("a", { href: "https://chat.openai.com", target: "_blank", rel: "noreferrer", children: "chat.openai.com" })
        ] }) });
      })()
    ] });
  }
  var App_default = App;

  // src/popup/index.tsx
  P(/* @__PURE__ */ o3(App_default, {}), document.getElementById("app"));
})();
