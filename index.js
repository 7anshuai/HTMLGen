'use strict';

;(function() {

  // Establish the root object, `window` in the browser, or `exports` on the server.
  let root = this;

  class HTMLGen {
    constructor(options={}) {
      let {title, tags, pretty} = options;
      this._title = title || 'Default title';
      this.pretty = pretty || false;

      // initialize tags
      this.tags = {};
      if (tags && typeof tags === 'object') {
        for (let tag in tags) {
          this.tags[tag] = tags[tag] || '';
        }
      }

      for (let tag of ['head', 'body', 'header', 'footer']) {
        if (!this.tags[tag]) this.tags[tag] = '';
      }

      // A trap for getting a property value
      // like __noSuchMethod__ in firefox
      // like method_missing in ruby
      const handler = {
        get (target, key) {
          return key in target ? target[key] : function methodMissing(attrhash, content) {
            if (typeof attrhash === 'string' || typeof attrhash === 'function') {
              content = content ? content : attrhash;
              attrhash = {};
            }
            if (typeof content === 'string') {
              content = content;
            } else if (typeof content === 'function') {
              content = content() && content().toString() ? content().toString() : null;
            } else {
              content = null;
            }
            return this.gentag(key, attrhash, content);
          }
        }
      }

      return new Proxy(this, handler);
    }

    gentag(m, attrhash={}, content) {
      let origm, html;
      m = m.toString();
      if (this.shorttags[m]) {
        origm = m;
        m = this.shorttags[m]['tag'];
        attrhash = Object.assign(attrhash, this.shorttags[origm]);
        delete attrhash['tag'];
        if (attrhash['!append']) {
          content += attrhash['!append'];
          delete attrhash['!append'];
        }
      }

      let nl = this.newlinetags.includes(m) && this.pretty ? '\n' : '';
      let attribs = '';
      let single = this.singletags.includes(m);

      if (Object.keys(attrhash).length != 0) {
        for (let k in attrhash) {
          let v = attrhash[k];
          if (v) attribs += ` ${k}="${this.entities(v.toString())}"`;
        }
      }

      if (single) {
        html = `<${m}${attribs}>` + nl;
      } else if (!single && content) {
        if (content[-1] != 10) content += nl;
        if (content[0] != 10) content = nl + content;
        html = `<${m}${attribs}>` + content + `</${m}>`;
      } else {
        html = `<${m}${attribs}></${m}>` + nl;
      }

      return html;
    }

    list(l) {
      return this.ul(() => {

      });
    }

    entities(s) {
      return escape(s);
    }

    unentities(s) {
      return unescape(s);
    }

    urlencode(s) {
      return encodeURIComponent(s);
    }

    urldecode(s) {
      return decodeURIComponent(s);
    }

    getTitle () {
      return this._title;
    }

    setTitle(t) {
      return this._title = t;
    }

    append (content, tag='head') {
      let tags = this.tags;
      if (typeof content === 'string') return tags[tag] += content;
      if (typeof content === 'function') return tags[tag] += content() ? content() : '';
    }

    page(content='') {
      return typeof content === 'string' || typeof content === 'function' ?
        '<!DOCTYPE html>' +
          this.html(() => {
            return this.head(() => {
              return this.meta({charset: 'utf-8'}) +
                this.title(`${this.entities(this._title)}`) +
                this.meta({content: 'width=device-width, initial-scale=1, maximum-scale=1', name: 'viewport'}) +
                this.meta({content: 'index', name: 'robots'}) +
                this.tags.head || '';
              }) +
              this.body(() => {
                return this.div({class: 'container'}, () => {
                  return this.tags.header + this.section({id: 'content'}, typeof content === 'string' ? content : content()) + this.tags.footer;
                }) + this.tags.body;
              });
          }) :
        '';
    }
  }

  HTMLGen.prototype.newlinetags = 'html body div br ul hr title link head fieldset label legend option table li select td tr meta'.split(' ');

  HTMLGen.prototype.singletags = 'base meta link br hr img input'.split(' ');

  HTMLGen.prototype.shorttags = {
    'css': {tag: 'link', rel: 'stylesheet'},
    'js': {tag: 'script'},
    'text': {tag: 'input', type: 'text'},
    'password': {tag: 'input', type: 'password'},
    'file': {tag: 'input', type: 'file'},
    'hidden': {tag: 'input', type: 'hidden'},
    'button': {tag: 'input', type: 'button'},
    'submit': {tag: 'input', type: 'submit'},
    'checkbox': {tag: 'input', type: 'checkbox'},
    'radio': {tag: 'input', type: 'radio'}
  }

  // Invert the keys and values of an object. The values must be serializable.
  function invert(obj) {
    let result = {};
    let keys = Object.keys(obj);
    for (let i = 0, length = keys.length; i < length; i++) {
      result[obj[keys[i]]] = keys[i];
    }
    return result;
  };

  // List of HTML entities for escaping.
  let escapeMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '`': '&#x60;'
  };
  let unescapeMap = invert(escapeMap);

  // Functions for escaping and unescaping strings to/from HTML interpolation.
  function createEscaper(map) {
    let escaper = function(match) {
      return map[match];
    };
    // Regexes for identifying a key that needs to be escaped
    let source = '(?:' + Object.keys(map).join('|') + ')';
    let testRegexp = RegExp(source);
    let replaceRegexp = RegExp(source, 'g');
    return function(string) {
      string = string == null ? '' : '' + string;
      return testRegexp.test(string) ? string.replace(replaceRegexp, escaper) : string;
    };
  };

  let escape = createEscaper(escapeMap);
  let unescape = createEscaper(unescapeMap);

  // Export the HTMLGen class for **Node.js**, with
  // backwards-compatibility for the old `require()` API. If we're in
  // the browser, add `HTMLGen` as a global object.
  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = HTMLGen;
    }
    exports.HTMLGen = HTMLGen;
  } else if (typeof define === 'function' && define.amd) {
    define(function() {
      return HTMLGen;
    });
  } else {
    root.HTMLGen = HTMLGen;
  }

}.call(this));