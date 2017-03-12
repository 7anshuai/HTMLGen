var should = require('should');
var H = require('../index');

describe('HTMLGen', () => {
  // body...
  const h = new H;
  const noop = () => {};
  it('set title', function() {
    h.setTitle('Test');
    h.title.should.equal('Test');
  });

  it('should gen meta tag', () => {
    const meta = h.meta({charset: 'utf-8'});
    meta.should.equal('<meta charset="utf-8">');
  })

  it('should gen script without attrhash', () => {
    const script = h.script('');
    script.should.equal('<script></script>');
  })

  it('should gen script with content', () => {
    const script = h.script('', 'var a;');
    script.should.equal('<script>var a;</script>');
  })

  it('should gen script tag with ""', () => {
    const script = h.script({src: '/js/app.js'}, '');
    script.should.equal('<script src="/js/app.js"></script>');
  })

  it('should gen script tag with noop function', () => {
    const script = h.script({src: '/js/app.js'}, noop);
    script.should.equal('<script src="/js/app.js"></script>');
  })

  it('should gen a ul', () => {
    const ul = h.list();
    ul.should.equal('<ul></ul>');
  })
})