'use strict';

const _ = require('underscore');

class HTMLGen {
  constructor(options={}) {

    this.headtags = options.headtags || '';
    this.foottags = options.foottags || '';
    this.title = options.title || 'Default title';

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

    let nl = this.newlinetags.includes(m) ? '\n' : '';
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

  append (content, tag='head') {
    let tags = tag === 'body' ? 'foottags' : 'headtags';
    if (typeof content === 'string') return this[tags] = content;
    if (typeof content === 'function') return this[tags] = content() ? content() : '';
    this[tags] = this[tags] || '';
  }

  page(content) {
    return typeof content === 'string' || typeof content === 'function' ?
      '<!DOCTYPE html>' +
        this.html(() => {
          return this.head(() => {
            return this.meta({charset: 'utf-8'}) +
              `<title>${this.entities(this.title)}</title>` +
              this.meta({content: 'width=device-width, initial-scale=1, maximum-scale=1', name: 'viewport'}) +
              this.meta({content: 'index', name: 'robots'}) +
              this.headtags || ''
            }) +
            this.body(() => {
              return this.div({class: 'container'}, () => {
                return _header() + this.div({id: 'content'}, typeof content === 'string' ? content : content()) + _footer();
              }) + this.foottags;
            })
        }) :
      '';
  }
}

function _header() {
  return typeof applicationHeader === 'function' ? applicationHeader() : '';
}

function _footer() {
  return typeof applicationFooter === 'function' ? applicationFooter() : '';
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