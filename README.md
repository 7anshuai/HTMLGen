# html5-gen [![Build Status](https://travis-ci.org/7anshuai/html5-gen.svg?branch=master)](https://travis-ci.org/7anshuai/html5-gen)

[![NPM](https://nodei.co/npm/html5-gen.png?downloads=true)](https://nodei.co/npm/html5-gen/)


I have run a site [jsernews](https://jsernews.com) using [lamernews](https://github.com/antirez/lamernews) source code for a long time.

I've plan to hack on jsernews with Node.js/Express/Redis/jQuery in my free time for a long time too. The goal is to have a implementation of the Lamer News style news website written using Node.js, Express, Redis and jQuery.

This project was created in order to generate HTML5 tags like lamernews [HTMLGen class](https://github.com/antirez/lamernews/blob/master/page.rb) (ruby version), is free for everybody to use, fork, and have fun with.

## Installation

### NPM

```
npm install html5-gen
```

## Usage

### Node.js

```
  const HTMLGen = require('html5-gen');
  const h5 = new HTMLGen();

  h5.script({src: '/js/app.js'}, ''); // <script src="/js/app.js"></script>
  h5.script(''); // <script></script>

  // maybe it should be more smart
  h5.script(); // <script> 
  // but it works with single tags
  h5.meta({charset: 'utf8'}); // <meta charset="utf-8">

  // pass a anonymous function expression like ruby block
  h5.div({class: 'container'}, () => {
    // do something and return html...
    return h5.span('Hello World!');
  }); // <div class="container"><span>Hello World!</span></div>
```

## Testing

```
npm test
```

## License

[MIT](/LICENSE)


