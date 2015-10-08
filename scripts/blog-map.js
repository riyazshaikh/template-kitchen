var BlogMapUrl = '/blog';

Y.use(['jsonp', 'squarespace-google-maps-renderer'], function (Y) {

  window.BlogMap = Singleton.create({

    TPL_INFOWINDOW: '<div class="content">' +
                      '{.main-image?}' +
                          '<figure class="loading content-fill"><img {@|image-meta} /></figure>' +
                      '{.end}' +
                      '<a href="{fullUrl}"><h2>{title}</h2></a>' +
                      '{.section location}' +
                        '<a class="location" target=_blank href="{mapUrl}">' +
                          '<div class="address">{addressLine1}<br/>{addressLine2}</div>' +
                        '</a>' +
                      '{.end}' +
                    '</div>',

    ready: function() {
      this.parentNode = Y.one(document.currentScript.parentNode);

      this.rootEl = Y.one('#blog-map');

      if (!this.rootEl) {
        this.rootEl = Y.Node.create('<div id="blog-map"></div>');

        if (this.parentNode.get('tagName') == 'HEAD') {
          Y.on('domready', function() {
            Y.one('#content').prepend(this.rootEl);
          }, this);
        } else {
          this.parentNode.prepend(this.rootEl);
        }
      }

      Y.on('domready', this.init, this);
    },

    init: function() {

      Y.Squarespace.GoogleMaps.Renderer.onReady(function() {
          this.getBlogJson(BlogMapUrl, this.renderMap);
      }, this);

    },

    getBlogJson: function(url, callback) {

      url += url.indexOf('?') > -1 ? '&' : '?';

      url += 'format=json';

      url += '&t=' + (new Date().getTime());

      var that = this;
      Y.Data.get({
        url: url,
        success: function(obj) {
          that.collection = obj;
          callback.call(that);
        }
      });

    },

    renderMap: function() {

      this.map = new Y.config.win.google.maps.Map(this.rootEl._node,{
            zoom: 10,
            center: new Y.config.win.google.maps.LatLng(40.720882,-74.000988),
            draggable: true,
            scrollwheel: false,
            disableDefaultUI: true
       });      

      var style = Y.clone(Y.Squarespace.GoogleMaps.StylesConfig[Y.Squarespace.GoogleMaps.Styles.GRAYSCALE-1]);

      this.map.setOptions({ mapTypeId: window.google.maps.MapTypeId.ROADMAP, styles: style.colors });


      var posts = this.collection.items;
      var bounds = new google.maps.LatLngBounds();

      for( var i=0; i<posts.length; i++) {
        var post = posts[i];

        if (post.location) {

          var point = new window.google.maps.LatLng(post.location.mapLat,post.location.mapLng);
          bounds.extend(point);

          this.addMarkerToMap(point, post); 
        }
        
      }

      this.map.fitBounds(bounds);

    },

    addMarkerToMap: function(point, post) {
      console.log(post);

      var marker = new window.google.maps.Marker({
          map: this.map,
          animation: window.google.maps.Animation.DROP,
          draggable: false,
          position: point,
          title: this._generateAddress(post.location),
          icon: ""
      });

      var infowindow = new google.maps.InfoWindow({
        content: this._generateInfoWindow(point, post)
      });     

      infowindow.addListener('domready', function() {
        ImageLoader.load(Y.one('.gm-style-iw .content img'));
      });

      marker.addListener('click', Y.bind(function() {
        infowindow.open(this.map, marker);
      }, this));

      marker.setIcon({
          url: "/universal/images-v6/icons/cover-pages-map-marker-pin-dark-2x.png",
          size: new window.google.maps.Size(48,64),
          scaledSize: new window.google.maps.Size(24, 32),
          anchor: new window.google.maps.Point(12,32)
      });
    },

    _generateInfoWindow: function(point, post) {
      
      post.location.mapUrl = "http://maps.google.com/maps?" + Y.QueryString.stringify({
          sll: point.toUrlValue(),
          q: this._generateAddress(post.location),
          z: this.map.getZoom()
      });     

      var content = Y.JSONTemplate.evaluateJsonTemplate(this.TPL_INFOWINDOW, post);

      return content;

    },

    _generateAddress: function(a) {
      var b;
      a.addressLine1 || a.addressLine2 ? (b = a.addressLine1 + " " + a.addressLine2,
      a.addressCountry && (b += ", " + 
      a.addressCountry)) : b = a.mapLat + "," + a.mapLng;

      return b
    }

  });
});