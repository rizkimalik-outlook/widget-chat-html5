var rooc_embed_init = (function () {

  'use strict';

  var _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };



  var DEFAULT_CONFIG = {	
	  primary_color: 'yellow',
    secondary_color: '#f7c101',
    icon_image_url: 'dist/img/chat.png',
    embed_url: 'login.html',
    icon_size: '60px',
    embed_height: '520px',
    embed_width: '380px',
    minimized: true,
  }



  var VENDOR_PREFIX = 'rooc_embed_';
  var DEBUG = true;
  var DEBOUNCE_TIMING = 15;
  var state = void 0;
  var STATE_MIN = 'minimized';
  var STATE_MAX = 'maximized';



  function log(msg) {
    if (DEBUG) {
      console.log('[EMBED] ' + msg);
    }
  }



  function updateView() {
    if (state === null || Date.now() - state.lastUpdate < DEBOUNCE_TIMING) {
      return;
    }

    var topOffset = $(state.elements.embed).height() - $(state.elements.iconEmbed).height() - 20;
    var leftOffset = $(state.elements.embed).width() - $(state.elements.iconEmbed).width() - 20;

    if (state.status === STATE_MIN) {
      state.elements.fullEmbed.style.display = 'none';
      state.elements.iconEmbed.style.display = 'block';
      state.elements.embed.style.borderRadius = '50%';
      state.elements.embed.style.marginTop = topOffset + 'px';
      state.elements.embed.style.marginLeft = leftOffset + 'px';
    } 
    else {
      state.elements.fullEmbed.style.display = 'block';
      state.elements.iconEmbed.style.display = 'none';

      state.elements.embed.style.borderRadius = '5px';
      state.elements.embed.style.marginTop = topOffset + 'px';
      state.elements.embed.style.marginLeft = leftOffset + 'px';
    }

    state.lastUpdate = Date.now();
  }



  function minimizeEmbed() {
    log('Minimizing Embed');
    state = _extends({}, state, {
      status: STATE_MIN
    });

    updateView();
  }



  function maximizeEmbed() {
    log('Maximizing Embed');
    state = _extends({}, state, {
      status: STATE_MAX
    });

    updateView();
  }



  function init(config = DEFAULT_CONFIG) {
    config = _extends({}, DEFAULT_CONFIG, config);

    var root = document.body;

	//button widget chat 
    var embed = document.createElement('div');
    embed.className = "mainchatbot";
    embed.style.position = 'fixed';
    embed.style.overflow = 'hidden';
    embed.style.borderRadius = '5px';
    embed.style.backgroundColor = '#fcda32';
    embed.style.boxShadow = '0px 3px 16px 0px rgba(0, 0, 0, 0.6), 0 3px 1px -2px rgba(0, 0, 0, 0.2), 0 1px 5px 0 rgba(0, 0, 0, 0.12)';
    embed.style.zIndex = 9999;
	

    /**
     * Full Embed Elements
     */

    var fullEmbed = document.createElement('div');
    embed.appendChild(fullEmbed);



    var toolbar = document.createElement('div');
    toolbar.style.width = '100%';
    toolbar.style.height = '10px';
    toolbar.style.cursor = 'move';
    toolbar.style.position = 'absolute';
    fullEmbed.appendChild(toolbar);

    var btnClose = document.createElement('button');
    btnClose.textContent = '\u002D'; //unicode caracters
    btnClose.style.fontSize = '15px';
    btnClose.style.fontWeight = 'bold';
    btnClose.style.cssFloat = 'right';
    btnClose.style.width = '30px';
    btnClose.style.height = '30px';
    btnClose.style.textAlign = 'center';
    btnClose.style.padding = '0';
    btnClose.style.cursor = 'pointer';
    btnClose.style.border = 'none';
    btnClose.style.color = '#00008c';
    btnClose.style.borderRadius = '50%';
    btnClose.style.backgroundColor = 'transparent';

    btnClose.onmouseover = function () {
      btnClose.style.backgroundColor = '#00008c';
      btnClose.style.color = 'white';

    }
    btnClose.onmouseleave = function () {
      btnClose.style.backgroundColor = 'transparent';
      btnClose.style.color = '#00008c';
    }
    btnClose.onclick = minimizeEmbed;
    
    toolbar.appendChild(btnClose);


    var btnicon = document.createElement('span');
    btnicon.className = 'icon';
    btnicon.background = 'url(imgs/icon.png) no-repeat';
    btnicon.float = 'left';
    btnicon.width = '10px';
    btnicon.height = '40px';
    btnClose.appendChild(btnicon);


    var iframe = document.createElement('iframe');
    iframe.id = 'iframe_chat';
    iframe.src = config.embed_url;
    iframe.style.border = '0';
    iframe.style.height = config.embed_height;
    iframe.style.width = config.embed_width;
    iframe.style.zIndex = 9999;

    fullEmbed.appendChild(iframe);

    root.appendChild(embed);


    /**
     * Icon Embed Elements
     */

    var iconEmbed = document.createElement('div');
    iconEmbed.style.width = config.icon_size;
    iconEmbed.style.height = config.icon_size;
    iconEmbed.style.margin = '0';
    iconEmbed.style.background = config.secondary_color;

    if (config.icon_image_url !== '') {
      iconEmbed.style.backgroundImage = 'url("' + config.icon_image_url + '")';
      iconEmbed.style.backgroundSize = 'cover';
    }

    iconEmbed.style.cursor = 'pointer';
    iconEmbed.onclick = maximizeEmbed;
    embed.appendChild(iconEmbed);

    var status = STATE_MAX;
    // var status = STATE_MIN;

    if(config.minimized){
      status = STATE_MIN;
    }

    state = {
      status: status,
      elements: {
        embed: embed,
        fullEmbed: fullEmbed,
        iconEmbed: iconEmbed
      },

      lastUpdate: -1,
      config: config
    };


    // TODO: Remove jQuery UI dependency
    $(state.elements.embed).draggable({
      containment: "document"
    });

    // TODO: Remove jQUery dependency
    embed.style.top = $(window).height() - $(embed).height() + 'px';
    embed.style.left = $(window).width() - $(embed).width() + 'px';
    updateView();
  }

  return init;
})();

rooc_embed_init();