exports.config =
  # See docs at http://brunch.readthedocs.org/en/latest/config.html.
  paths:
    watched: ['app','vendor']
  paths:
    public: '_public'
  files:
    javascripts:
      joinTo:
        'js/app.js': /^app/
        'js/vendor.js': /^vendor/
      order:
        before: [
          'vendor/requirejs/require.js'
          'vendor/console-polyfill/index.js'
          'vendor/threejs/index.js'
          'vendor/jquery/jquery.js'
          'vendor/jquery/jquery.mousewheel.js'
        ]

    stylesheets:
      joinTo:
        'css/app.css' : /^(app|vendor)/

    templates:
      joinTo:
        'js/templates.js': /.+\.jade$/

  plugins:
    coffeelint:
      pattern: /^app\/.*\.coffee$/
      options:
        max_line_length:
          value: 80
          level: "ignore"

    jade:
      options:
        pretty: yes # Adds pretty-indentation whitespaces to output (false by default)

    bower:
      extend:
        "bootstrap" : 'vendor/bootstrap/docs/assets/js/bootstrap.js'
        "angular-mocks": []
        "styles": []
      asserts:
        "img" : /bootstrap(\\|\/)img/
        "font": /font-awesome(\\|\/)font/