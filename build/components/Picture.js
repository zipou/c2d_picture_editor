"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Picture = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _PictureSlider = require("./PictureSlider");

var _PictureSlider2 = _interopRequireDefault(_PictureSlider);

var _PictureButton = require("./PictureButton");

var _PictureButton2 = _interopRequireDefault(_PictureButton);

var _PictureEditor = require("./PictureEditor");

var _PictureEditor2 = _interopRequireDefault(_PictureEditor);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Picture = exports.Picture = function (_React$Component) {
  _inherits(Picture, _React$Component);

  function Picture(props) {
    _classCallCheck(this, Picture);

    var _this = _possibleConstructorReturn(this, (Picture.__proto__ || Object.getPrototypeOf(Picture)).call(this, props));

    var token = _this.props.token;

    _this.state = {
      loading: false,
      uri: null,
      token: token ? token : null,
      scale: 1,
      x: 1,
      y: 1
    };
    return _this;
  }

  _createClass(Picture, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var token = this.props.token;

      if (token) {
        this._loadFromToken(token);
      }
    }
  }, {
    key: "componentWillReceiveProps",
    value: function componentWillReceiveProps(props) {
      var oldToken = this.state.token;
      var token = props.token;

      if (oldToken == null && token && oldToken != token) {
        this._loadFromToken(token);
      }
    }
  }, {
    key: "_loadFromToken",
    value: function _loadFromToken(token) {
      var _this2 = this;

      this.setState({ loading: true });
      this.props.load(token).then(function (image) {
        _this2.setState({
          token: token,
          uri: image.full,
          x: image.x,
          y: image.y,
          scale: image.zoom
        });
        if (_this2.props.onChange) {
          _this2.props.onChange(token);
        }
        _this2.setState({ loading: false });
      }).catch(function (error) {
        _this2.setState({ loading: false });
      });
    }
  }, {
    key: "_handleUpload",
    value: function _handleUpload(token) {
      this._loadFromToken(token);
    }
  }, {
    key: "_handleSlider",
    value: function _handleSlider(event) {
      this._setScaleValue(event.target.value);
    }
  }, {
    key: "_setScaleValue",
    value: function _setScaleValue(value) {
      var _props = this.props,
          maxRange = _props.maxRange,
          minRange = _props.minRange;

      if (value <= maxRange && value >= minRange) {
        this.setState({ scale: value });
      }
    }
  }, {
    key: "_handleWheel",
    value: function _handleWheel(event) {
      return;
    }
  }, {
    key: "_handleEditorChange",
    value: function _handleEditorChange(x, y, crop) {
      var _state = this.state,
          scale = _state.scale,
          token = _state.token;

      if (!isNaN(x) && !isNaN(y)) {
        var _setState;

        this.setState((_setState = {
          token: token,
          scale: scale,
          x: x,
          y: y }, _defineProperty(_setState, "y", y), _defineProperty(_setState, "crop", crop), _setState));
      }
    }
  }, {
    key: "_setLoading",
    value: function _setLoading(loading) {
      this.setState({
        loading: loading
      });
    }
  }, {
    key: "_triggerUpdate",
    value: function _triggerUpdate() {
      var _props$update;

      var _state2 = this.state,
          token = _state2.token,
          scale = _state2.scale,
          x = _state2.x,
          y = _state2.y,
          crop = _state2.crop;

      this.props.update((_props$update = {
        scale: scale,
        x: x,
        y: y }, _defineProperty(_props$update, "y", y), _defineProperty(_props$update, "crop", crop), _props$update), token);
    }
  }, {
    key: "render",
    value: function render() {
      var _state3 = this.state,
          uri = _state3.uri,
          x = _state3.x,
          y = _state3.y,
          scale = _state3.scale,
          upload = _state3.upload,
          loading = _state3.loading;
      var _props2 = this.props,
          buttonLabel = _props2.buttonLabel,
          height = _props2.height,
          width = _props2.width,
          uploadImage = _props2.uploadImage,
          loadingLabel = _props2.loadingLabel,
          minRange = _props2.minRange,
          maxRange = _props2.maxRange,
          minZoom = _props2.minZoom,
          maxZoom = _props2.maxZoom,
          border = _props2.border;

      return _react2.default.createElement(
        "div",
        null,
        loading && _react2.default.createElement(
          "span",
          null,
          loadingLabel
        ),
        _react2.default.createElement(_PictureButton2.default, {
          setLoading: this._setLoading.bind(this),
          uploadImage: uploadImage.bind(this),
          onUpload: this._handleUpload.bind(this),
          label: buttonLabel
        }),
        _react2.default.createElement(
          "div",
          { className: "ajouter-article__photoarticle", style: { height: height, width: width, border: border ? border : "", overflow: "hidden" }, onWheel: this._handleWheel.bind(this) },
          _react2.default.createElement(_PictureEditor2.default, {
            onDone: this._triggerUpdate.bind(this),
            onChange: this._handleEditorChange.bind(this),
            uri: uri,
            scale: scale,
            x: x,
            y: y,
            min: minRange,
            max: maxRange,
            minZoom: minZoom,
            maxZoom: maxZoom,
            width: width,
            height: height,
            border: 0
          })
        ),
        _react2.default.createElement(_PictureSlider2.default, {
          position: scale,
          min: minRange,
          max: maxRange,
          onDone: this._triggerUpdate.bind(this),
          onChange: this._setScaleValue.bind(this)
        })
      );
    }
  }]);

  return Picture;
}(_react2.default.Component);

Picture.propTypes = {
  buttonLabel: _react2.default.PropTypes.string.isRequired,
  loadingLabel: _react2.default.PropTypes.string,
  border: _react2.default.PropTypes.string,
  height: _react2.default.PropTypes.number.isRequired,
  width: _react2.default.PropTypes.number.isRequired,
  maxRange: _react2.default.PropTypes.number.isRequired,
  minRange: _react2.default.PropTypes.number.isRequired,
  minZoom: _react2.default.PropTypes.number.isRequired,
  maxZoom: _react2.default.PropTypes.number.isRequired,
  uploadImage: _react2.default.PropTypes.func.isRequired,
  update: _react2.default.PropTypes.func.isRequired,
  load: _react2.default.PropTypes.func.isRequired
};