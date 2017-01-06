'use strict';

(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['exports', 'react', 'react-dom'], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require('react'), require('react-dom'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.react, global.reactDom);
    global.index = mod.exports;
  }
})(undefined, function (exports, _react, _reactDom) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _react2 = _interopRequireDefault(_react);

  var _reactDom2 = _interopRequireDefault(_reactDom);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

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

  var isTouchDevice = !!(typeof window !== 'undefined' && typeof navigator !== 'undefined' && ('ontouchstart' in window || navigator.msMaxTouchPoints > 0));

  var draggableEvents = {
    touch: {
      react: {
        down: 'onTouchStart',
        mouseDown: 'onMouseDown',
        drag: 'onTouchMove',
        drop: 'onTouchEnd',
        move: 'onTouchMove',
        mouseMove: 'onMouseMove',
        up: 'onTouchEnd',
        mouseUp: 'onMouseUp'
      },
      native: {
        down: 'touchstart',
        mouseDown: 'mousedown',
        drag: 'touchmove',
        drop: 'touchend',
        move: 'touchmove',
        mouseMove: 'mousemove',
        up: 'touchend',
        mouseUp: 'mouseup'
      }
    },
    desktop: {
      react: {
        down: 'onMouseDown',
        drag: 'onDragOver',
        drop: 'onDrop',
        move: 'onMouseMove',
        up: 'onMouseUp'
      },
      native: {
        down: 'mousedown',
        drag: 'dragStart',
        drop: 'drop',
        move: 'mousemove',
        up: 'mouseup'
      }
    }
  };
  var deviceEvents = isTouchDevice ? draggableEvents.touch : draggableEvents.desktop;

  // Draws a rounded rectangle on a 2D context.
  var drawRoundedRect = function drawRoundedRect(context, x, y, width, height, borderRadius) {
    if (borderRadius === 0) {
      context.rect(x, y, width, height);
    } else {
      var widthMinusRad = width - borderRadius;
      var heightMinusRad = height - borderRadius;
      context.translate(x, y);
      context.arc(borderRadius, borderRadius, borderRadius, Math.PI, Math.PI * 1.5);
      context.lineTo(widthMinusRad, 0);
      context.arc(widthMinusRad, borderRadius, borderRadius, Math.PI * 1.5, Math.PI * 2);
      context.lineTo(width, heightMinusRad);
      context.arc(widthMinusRad, heightMinusRad, borderRadius, Math.PI * 2, Math.PI * 0.5);
      context.lineTo(borderRadius, height);
      context.arc(borderRadius, heightMinusRad, borderRadius, Math.PI * 0.5, Math.PI);
      context.translate(-x, -y);
    }
  };

  // Define global variables for standard.js
  /* global Image, FileReader */
  var AvatarEditor = _react2.default.createClass({
    displayName: 'AvatarEditor',

    propTypes: {
      scale: _react2.default.PropTypes.number,
      image: _react2.default.PropTypes.string,
      border: _react2.default.PropTypes.number,
      borderRadius: _react2.default.PropTypes.number,
      width: _react2.default.PropTypes.number,
      height: _react2.default.PropTypes.number,
      color: _react2.default.PropTypes.arrayOf(_react2.default.PropTypes.number),
      style: _react2.default.PropTypes.object,

      onDropFile: _react2.default.PropTypes.func,
      onLoadFailure: _react2.default.PropTypes.func,
      onLoadSuccess: _react2.default.PropTypes.func,
      onImageReady: _react2.default.PropTypes.func,
      onImageChange: _react2.default.PropTypes.func,
      onMouseUp: _react2.default.PropTypes.func,
      onMouseMove: _react2.default.PropTypes.func
    },

    getDefaultProps: function getDefaultProps() {
      return {
        scale: 1,
        border: 25,
        borderRadius: 0,
        width: 200,
        height: 200,
        color: [0, 0, 0, 0.5],
        style: {},
        onDropFile: function onDropFile() {},
        onLoadFailure: function onLoadFailure() {},
        onLoadSuccess: function onLoadSuccess() {},
        onImageReady: function onImageReady() {},
        onImageChange: function onImageChange() {},
        onMouseUp: function onMouseUp() {},
        onMouseMove: function onMouseMove() {}
      };
    },
    getInitialState: function getInitialState() {
      return {
        drag: false,
        my: null,
        mx: null,
        image: {
          x: 0,
          y: 0
        }
      };
    },
    getDimensions: function getDimensions() {
      return {
        width: this.props.width,
        height: this.props.height,
        border: this.props.border,
        canvas: {
          width: this.props.width + this.props.border * 2,
          height: this.props.height + this.props.border * 2
        }
      };
    },
    getImage: function getImage() {
      // get relative coordinates (0 to 1)
      var cropRect = this.getCroppingRect();
      var image = this.state.image;

      // get actual pixel coordinates
      cropRect.x *= image.resource.width;
      cropRect.y *= image.resource.height;
      cropRect.width *= image.resource.width;
      cropRect.height *= image.resource.height;

      // create a canvas with the correct dimensions
      var canvas = document.createElement('canvas');
      canvas.width = cropRect.width;
      canvas.height = cropRect.height;

      // draw the full-size image at the correct position,
      // the image gets truncated to the size of the canvas.
      canvas.getContext('2d').drawImage(image.resource, -cropRect.x, -cropRect.y);

      return canvas;
    },
    getImageScaledToCanvas: function getImageScaledToCanvas() {
      var _getDimensions = this.getDimensions();

      var width = _getDimensions.width;
      var height = _getDimensions.height;

      var canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;

      // don't paint a border here, as it is the resulting image
      this.paintImage(canvas.getContext('2d'), this.state.image, 0);

      return canvas;
    },
    getCroppingRect: function getCroppingRect() {
      var dim = this.getDimensions();
      var frameRect = { x: dim.border, y: dim.border, width: dim.width, height: dim.height };
      var imageRect = this.calculatePosition(this.state.image, dim.border);
      return {
        x: (frameRect.x - imageRect.x) / imageRect.width,
        y: (frameRect.y - imageRect.y) / imageRect.height,
        width: frameRect.width / imageRect.width,
        height: frameRect.height / imageRect.height
      };
    },
    isDataURL: function isDataURL(str) {
      if (str === null) {
        return false;
      }
      var regex = /^\s*data:([a-z]+\/[a-z]+(;[a-z\-]+=[a-z\-]+)?)?(;base64)?,[a-z0-9!$&',()*+;=\-._~:@\/?%\s]*\s*$/i;
      return !!str.match(regex);
    },
    loadImage: function loadImage(imageURL) {
      var x = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      var y = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

      var imageObj = new Image();
      imageObj.onload = this.handleImageReady.bind(this, imageObj, x, y);
      imageObj.onerror = this.props.onLoadFailure;
      if (!this.isDataURL(imageURL)) imageObj.crossOrigin = 'anonymous';
      imageObj.src = imageURL;
    },
    componentDidMount: function componentDidMount() {
      var context = _reactDom2.default.findDOMNode(this.refs.canvas).getContext('2d');
      if (this.props.image) {
        this.loadImage(this.props.image);
      }
      this.paint(context);
      if (document) {
        var nativeEvents = deviceEvents.native;
        document.addEventListener(nativeEvents.move, this.handleMouseMove, false);
        document.addEventListener(nativeEvents.up, this.handleMouseUp, false);
        if (isTouchDevice) {
          document.addEventListener(nativeEvents.mouseMove, this.handleMouseMove, false);
          document.addEventListener(nativeEvents.mouseUp, this.handleMouseUp, false);
        }
      }
    },
    componentWillUnmount: function componentWillUnmount() {
      if (document) {
        var nativeEvents = deviceEvents.native;
        document.removeEventListener(nativeEvents.move, this.handleMouseMove, false);
        document.removeEventListener(nativeEvents.up, this.handleMouseUp, false);
        if (isTouchDevice) {
          document.removeEventListener(nativeEvents.mouseMove, this.handleMouseMove, false);
          document.removeEventListener(nativeEvents.mouseUp, this.handleMouseUp, false);
        }
      }
    },
    componentDidUpdate: function componentDidUpdate(prevProps, prevState) {
      var context = _reactDom2.default.findDOMNode(this.refs.canvas).getContext('2d');
      context.clearRect(0, 0, this.getDimensions().canvas.width, this.getDimensions().canvas.height);
      this.paint(context);
      this.paintImage(context, this.state.image, this.props.border);

      if (prevProps.image !== this.props.image || prevProps.scale !== this.props.scale || prevState.my !== this.state.my || prevState.mx !== this.state.mx || prevState.image.x !== this.state.image.x || prevState.image.y !== this.state.image.y) {
        this.props.onImageChange({ y: this.state.image.y, x: this.state.image.x, crop: this.getCroppingRect() });
      }
    },
    handleImageReady: function handleImageReady(image, x, y) {
      var imageState = this.getInitialSize(image.width, image.height);
      imageState.resource = image;
      imageState.x = x;
      imageState.y = y;
      this.setState({ drag: false, image: imageState }, this.props.onImageReady);
      this.props.onLoadSuccess(imageState);
    },
    getInitialSize: function getInitialSize(width, height) {
      var newHeight = void 0;
      var newWidth = void 0;

      var dimensions = this.getDimensions();
      var canvasRatio = dimensions.height / dimensions.width;
      var imageRatio = height / width;

      if (canvasRatio > imageRatio) {
        newHeight = this.getDimensions().height;
        newWidth = width * (newHeight / height);
      } else {
        newWidth = this.getDimensions().width;
        newHeight = height * (newWidth / width);
      }

      return {
        height: newHeight,
        width: newWidth
      };
    },
    componentWillReceiveProps: function componentWillReceiveProps(newProps) {
      if (newProps.image && this.props.image !== newProps.image) {
        var x = newProps.x,
            y = newProps.y,
            image = newProps.image;

        this.loadImage(image, x, y);
      }
      if (this.props.scale !== newProps.scale || this.props.height !== newProps.height || this.props.width !== newProps.width || this.props.border !== newProps.border) {
        this.squeeze(newProps);
      }
    },
    paintImage: function paintImage(context, image, border) {
      if (image.resource) {
        var position = this.calculatePosition(image, border);
        context.save();
        context.globalCompositeOperation = 'destination-over';
        context.drawImage(image.resource, position.x, position.y, position.width, position.height);
        context.restore();
      }
    },
    calculatePosition: function calculatePosition(image, border) {
      image = image || this.state.image;
      var dimensions = this.getDimensions();
      var width = image.width * this.props.scale;
      var height = image.height * this.props.scale;

      var widthDiff = (width - dimensions.width) / 2;
      var heightDiff = (height - dimensions.height) / 2;
      var x = image.x * this.props.scale - widthDiff + border;
      var y = image.y * this.props.scale - heightDiff + border;

      return {
        x: x,
        y: y,
        height: height,
        width: width
      };
    },
    paint: function paint(context) {
      context.save();
      context.translate(0, 0);
      context.fillStyle = 'rgba(' + this.props.color.slice(0, 4).join(',') + ')';

      var borderRadius = this.props.borderRadius;
      var dimensions = this.getDimensions();
      var borderSize = dimensions.border;
      var height = dimensions.canvas.height;
      var width = dimensions.canvas.width;

      // clamp border radius between zero (perfect rectangle) and half the size without borders (perfect circle or "pill")
      borderRadius = Math.max(borderRadius, 0);
      borderRadius = Math.min(borderRadius, width / 2 - borderSize, height / 2 - borderSize);

      context.beginPath();
      drawRoundedRect(context, borderSize, borderSize, width - borderSize * 2, height - borderSize * 2, borderRadius); // inner rect, possibly rounded
      context.rect(width, 0, -width, height); // outer rect, drawn "counterclockwise"
      context.fill('evenodd');

      context.restore();
    },
    handleMouseDown: function handleMouseDown(e) {
      e = e || window.event;
      // if e is a touch event, preventDefault keeps
      // corresponding mouse events from also being fired
      // later.
      e.preventDefault();
      this.setState({
        drag: true,
        mx: null,
        my: null
      });
    },
    handleMouseUp: function handleMouseUp() {
      if (this.state.drag) {
        this.setState({ drag: false });
        this.props.onMouseUp();
      }
    },
    handleMouseMove: function handleMouseMove(e) {
      e = e || window.event;
      if (this.state.drag === false) {
        return;
      }

      var imageState = this.state.image;
      var lastX = imageState.x;
      var lastY = imageState.y;

      var mousePositionX = e.targetTouches ? e.targetTouches[0].pageX : e.clientX;
      var mousePositionY = e.targetTouches ? e.targetTouches[0].pageY : e.clientY;

      var newState = { mx: mousePositionX, my: mousePositionY, image: imageState };

      if (this.state.mx && this.state.my) {
        var xDiff = (this.state.mx - mousePositionX) / this.props.scale;
        var yDiff = (this.state.my - mousePositionY) / this.props.scale;

        imageState.y = this.getBoundedY(lastY - yDiff, this.props.scale);
        imageState.x = this.getBoundedX(lastX - xDiff, this.props.scale);
      }

      this.setState(newState);
      this.props.onMouseMove();
    },
    squeeze: function squeeze(props) {
      var imageState = this.state.image;
      imageState.y = this.getBoundedY(imageState.y, props.scale);
      imageState.x = this.getBoundedX(imageState.x, props.scale);
      this.setState({ image: imageState });
    },
    getBoundedX: function getBoundedX(x, scale) {
      var image = this.state.image;
      var dimensions = this.getDimensions();
      var widthDiff = Math.floor((image.width - dimensions.width / scale) / 2);
      widthDiff = Math.max(0, widthDiff);

      return Math.max(-widthDiff, Math.min(x, widthDiff));
    },
    getBoundedY: function getBoundedY(y, scale) {
      var image = this.state.image;
      var dimensions = this.getDimensions();
      var heightDiff = Math.floor((image.height - dimensions.height / scale) / 2);
      heightDiff = Math.max(0, heightDiff);

      return Math.max(-heightDiff, Math.min(y, heightDiff));
    },
    handleDragOver: function handleDragOver(e) {
      e = e || window.event;
      e.preventDefault();
    },
    handleDrop: function handleDrop(e) {
      var _this = this;

      e = e || window.event;
      e.stopPropagation();
      e.preventDefault();

      if (e.dataTransfer && e.dataTransfer.files.length) {
        this.props.onDropFile(e);
        var reader = new FileReader();
        var file = e.dataTransfer.files[0];
        reader.onload = function (e) {
          return _this.loadImage(e.target.result);
        };
        reader.readAsDataURL(file);
      }
    },
    render: function render() {
      var defaultStyle = {
        cursor: this.state.drag ? 'grabbing' : 'grab'
      };

      var attributes = {
        width: this.getDimensions().canvas.width,
        height: this.getDimensions().canvas.height,
        style: _extends({}, defaultStyle, this.props.style)
      };

      attributes[deviceEvents.react.down] = this.handleMouseDown;
      attributes[deviceEvents.react.drag] = this.handleDragOver;
      attributes[deviceEvents.react.drop] = this.handleDrop;
      if (isTouchDevice) attributes[deviceEvents.react.mouseDown] = this.handleMouseDown;

      return _react2.default.createElement('canvas', _extends({ ref: 'canvas' }, attributes));
    }
  });

  exports.default = AvatarEditor;
});