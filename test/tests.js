const should = require('should');
const H5 = require('../index');

describe('HTML5 Generator', () => {
  // body...
  const h5 = new H5({
    tags: {
      head: '<link href="/favicon.ico" rel="shortcut icon">'
    }
  });
  const noop = () => {};

  it('get title', () => {
    const title = h5.getTitle()
    title.should.equal('Default title');
  });

  it('set title', function() {
    const title = h5.setTitle('Test');
    title.should.equal('Test');
  });

  it('should get head tags', () => {
    h5.tags.head.should.equal('<link href="/favicon.ico" rel="shortcut icon">')
  });

  it('should append tags to body', () => {
    h5.append(() => {
      return h5.script({src: '//code.jquery.com/jquery.js'}, '');
    }, 'body');
  });

  it('should gen a empty meta tag', () => {
    const meta = h5.meta();
    meta.should.equal('<meta>');
  });

  it('should gen a meta tag with attrhash', () => {
    const meta = h5.meta({charset: 'utf-8'});
    meta.should.equal('<meta charset="utf-8">');
  });

  it('should gen a script tag without attrhash', () => {
    const script = h5.script('');
    script.should.equal('<script></script>');
  });

  it('should gen a script tag with content', () => {
    const script = h5.script('', 'var a;');
    script.should.equal('<script>var a;</script>');
  });

  it('should gen a script tag with ""', () => {
    const script = h5.script({src: '/js/app.js'}, '');
    script.should.equal('<script src="/js/app.js"></script>');
  });

  it('should gen a script tag with noop function', () => {
    const script = h5.script({src: '/js/app.js'}, noop);
    script.should.equal('<script src="/js/app.js"></script>');
  });

  it('should gen a script tag using short tags', () => {
    const script = h5.js({src: '/js/app.js'}, '');
    script.should.equal('<script src="/js/app.js"></script>');
  });

  it('should gen a ul', () => {
    const ul = h5.list();
    ul.should.equal('<ul></ul>');
  });

  it('should gen a default page', () => {
    const page = h5.page('');
    page.should.equal('<!DOCTYPE html><html><head><meta charset="utf-8"><title>Test</title><meta content="width=device-width, initial-scale=1, maximum-scale=1" name="viewport"><meta content="index" name="robots"><link href="/favicon.ico" rel="shortcut icon"></head><body><div class="container"><section id="content"></section></div><script src="//code.jquery.com/jquery.js"></script></body></html>');
  });

  it('should gen a header', () => {
    h5.append(h5.header(''), 'header');
    const page = h5.page('');
    page.should.equal('<!DOCTYPE html><html><head><meta charset="utf-8"><title>Test</title><meta content="width=device-width, initial-scale=1, maximum-scale=1" name="viewport"><meta content="index" name="robots"><link href="/favicon.ico" rel="shortcut icon"></head><body><div class="container"><header></header><section id="content"></section></div><script src="//code.jquery.com/jquery.js"></script></body></html>');
  });

  it('should gen a footer', () => {
    h5.append(h5.footer(''), 'footer');
    const page = h5.page('');
    page.should.equal('<!DOCTYPE html><html><head><meta charset="utf-8"><title>Test</title><meta content="width=device-width, initial-scale=1, maximum-scale=1" name="viewport"><meta content="index" name="robots"><link href="/favicon.ico" rel="shortcut icon"></head><body><div class="container"><header></header><section id="content"></section><footer></footer></div><script src="//code.jquery.com/jquery.js"></script></body></html>');

  });
});