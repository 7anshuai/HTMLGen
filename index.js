'use strict';

const _ = require('underscore');

class HTMLGen {
  constructor() {
    this.title = 'Default title';

    // like method_missing in ruby
    const handler = {
      get (target, key) {
        if (Reflect.has(target, key)) {
          return Reflect.get(target, key);
        }
        return function methodMissing(attrhash, content) {
          if (typeof attrhash === 'string' || typeof attrhash === 'function') {
            content = content ? content : attrhash;
            attrhash = {};
          }
          if (typeof content === 'string') {
            content = content;
          } else if (typeof content === 'function'){
           content = content() && content().toString() ? content().toString() : '';
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
    if (this.metatags[m]) {
      origm = m;
      m = this.metatags[m]['tag'];
      attrhash = Object.assign(this.metatags[origm], attrhash);
      delete attrhash['tag'];
      if (attrhash['!append']) {
        content += attrhash['!append'];
        delete attrhash['!append'];
      }
    }

    let nl = _.include(this.newlinetags, m) ? '\n' : '';
    let attribs = '';

    if (Object.keys(attrhash).length != 0) {
      for (let k in attrhash) {
        let v = attrhash[k];
        if (v) attribs += ` ${k}="${this.entities(v.toString())}"`;
      }
    }

    if (content || content === '') {
      if (content[-1] != 10) content += nl;
      if (content[0] != 10) content = nl + content;
      html = `<${m}${attribs}>` + content + `</${m}>`;
    } else {
      html = `<${m}${attribs}>` + nl
    }

    return html;
  }

  list(l) {
    return this.ul(() => {

    })
    
  }

  entities(s) {
    return _.escape(s);
  }

  unentities(s) {
    return _.unescape(s);
  }

  urlencode(s) {
    return encodeURIComponent(s);
  }

  urldecode(s) {
    return decodeURIComponent(s);
  }

  setTitle(t) {
    this.title = t;
  }
}

HTMLGen.prototype.newlinetags = 'html body div br ul hr title link head fieldset label legend option table li select td tr meta'.split('');

HTMLGen.prototype.metatags = {
  'js': {'tag': 'script'},
  'inputtext': {'tag': 'input', 'type': 'text'},
  'inputpass': {'tag': 'input', 'type': 'password'},
  'inputfile': {'tag': 'input', 'type': 'file'},
  'inputhidden': {'tag': 'input', 'type': 'hidden'},
  'button': {'tag': 'input', 'type': 'button'},
  'submit': {'tag': 'input', 'type': 'submit'},
  'checkbox': {'tag': 'input', 'type': 'checkbox'},
  'radio': {'tag': 'input', 'type': 'radio'}
}


module.exports =  HTMLGen;