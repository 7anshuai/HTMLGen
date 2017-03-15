const should = require('should');
const H = require('../index');

describe('HTMLGen', () => {
  // body...
  const h = new H({
    headtags: '<link href="/favicon.ico" rel="shortcut icon">'
  });
  const noop = () => {};

  it('get title', () => {
    const title = h.title
    title.should.equal('Default title');
  });

  it('set title', function() {
    h.setTitle('Test');
    h.title.should.equal('Test');
  });

  it('should get head tags', () => {
    h.headtags.should.equal('<link href="/favicon.ico" rel="shortcut icon">')
  });

  it('should append tags to body', () => {
    h.append(() => {
      return h.script({src: '//code.jquery.com/jquery.js'}, '');
    }, 'body');
  });

  it('should gen a empty meta tag', () => {
    const meta = h.meta();
    meta.should.equal('<meta>');
  });

  it('should gen a meta tag with attrhash', () => {
    const meta = h.meta({charset: 'utf-8'});
    meta.should.equal('<meta charset="utf-8">');
  });

  it('should gen a script tag without attrhash', () => {
    const script = h.script('');
    script.should.equal('<script></script>');
  });

  it('should gen a script tag with content', () => {
    const script = h.script('', 'var a;');
    script.should.equal('<script>var a;</script>');
  });

  it('should gen a script tag with ""', () => {
    const script = h.script({src: '/js/app.js'}, '');
    script.should.equal('<script src="/js/app.js"></script>');
  });

  it('should gen a script tag with noop function', () => {
    const script = h.script({src: '/js/app.js'}, noop);
    script.should.equal('<script src="/js/app.js"></script>');
  });

  it('should gen a ul', () => {
    const ul = h.list();
    ul.should.equal('<ul></ul>');
  });

  it('should gen a default page', () => {
    const header = h.page('');
    header.should.equal('<!DOCTYPE html><html><head><meta charset="utf-8"><title>Test</title><meta content="width=device-width, initial-scale=1, maximum-scale=1" name="viewport"><meta content="index" name="robots"><link href="/favicon.ico" rel="shortcut icon"></head><body><div class="container"><div id="content"></div></div><script src="//code.jquery.com/jquery.js"></script></body></html>');
  })
});