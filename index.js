'use strict';

const _ = require('underscore');

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

    let nl = this.newlinetags.includes(m) && this.pretty ? '\n' : '';
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

  page(content) {
    return typeof content === 'string' || typeof content === 'function' ?
      '<!DOCTYPE html>' +
        this.html(() => {
          return this.head(() => {
            return this.meta({charset: 'utf-8'}) +
              this.title(`${this.entities(this._title)}`) +
              this.meta({content: 'width=device-width, initial-scale=1, maximum-scale=1', name: 'viewport'}) +
              this.meta({content: 'index', name: 'robots'}) +
              this.tags.head || ''
            }) +
            this.body(() => {
              return this.div({class: 'container'}, () => {
                return this.tags.header + this.section({id: 'content'}, typeof content === 'string' ? content : content()) + this.tags.footer;
              }) + this.tags.body;
            })
        }) :
      '';
  }
}

HTMLGen.prototype.newlinetags = 'html body div br ul hr title link head fieldset label legend option table li select td tr meta'.split(' ');

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