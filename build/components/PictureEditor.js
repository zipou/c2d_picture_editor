"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DEFAULT_ZOOM = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _AvatarEditor = require("../libs/AvatarEditor.js");

var _AvatarEditor2 = _interopRequireDefault(_AvatarEditor);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// import {MIN_ZOOM, MAX_ZOOM} from "../index.js";

var DEFAULT_ZOOM = exports.DEFAULT_ZOOM = 1;

var PictureEditor = function (_React$Component) {
  _inherits(PictureEditor, _React$Component);

  function PictureEditor(props) {
    _classCallCheck(this, PictureEditor);

    var _this = _possibleConstructorReturn(this, (PictureEditor.__proto__ || Object.getPrototypeOf(PictureEditor)).call(this, props));

    var scale = props.scale,
        uri = props.uri,
        x = props.x,
        y = props.y;

    _this.state = {
      scale: scale,
      uri: uri,
      x: x,
      y: y
    };
    return _this;
  }

  _createClass(PictureEditor, [{
    key: "componentWillReceiveProps",
    value: function componentWillReceiveProps(newprops) {
      var scale = newprops.scale,
          token = newprops.token,
          x = newprops.x,
          y = newprops.y,
          uri = newprops.uri;

      this.setState({
        scale: scale,
        uri: uri,
        x: x,
        y: y
      });
    }
  }, {
    key: "_updateState",
    value: function _updateState(x, y, crop) {
      if (this.props.onChange) {
        this.props.onChange(x, y, crop);
      }
    }
  }, {
    key: "_onUpdate",
    value: function _onUpdate(coords) {
      this._updateState(coords.x, coords.y, coords.crop);
    }
  }, {
    key: "_onDone",
    value: function _onDone() {
      var onDone = this.props.onDone;

      if (onDone) {
        onDone();
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _props = this.props,
          scale = _props.scale,
          width = _props.width,
          height = _props.height,
          min = _props.min,
          max = _props.max,
          border = _props.border,
          minZoom = _props.minZoom,
          maxZoom = _props.maxZoom;
      var _state = this.state,
          uri = _state.uri,
          x = _state.x,
          y = _state.y;

      var zoom = scale ? scale / (max / maxZoom) + 1 - (min - minZoom) : DEFAULT_ZOOM;
      return _react2.default.createElement(_AvatarEditor2.default, {
        ref: "avatareditor",
        image: uri,
        x: x,
        y: y,
        scale: zoom,
        border: border,
        width: width,
        height: height,
        onMouseUp: this._onDone.bind(this),
        onImageChange: this._onUpdate.bind(this)
      });
    }
  }]);

  return PictureEditor;
}(_react2.default.Component);

PictureEditor.propTypes = {
  minZoom: _react2.default.PropTypes.number.isRequired,
  maxZoom: _react2.default.PropTypes.number.isRequired,
  scale: _react2.default.PropTypes.number.isRequired,
  width: _react2.default.PropTypes.number.isRequired,
  height: _react2.default.PropTypes.number.isRequired,
  min: _react2.default.PropTypes.number.isRequired,
  max: _react2.default.PropTypes.number.isRequired,
  border: _react2.default.PropTypes.number.isRequired,
  uri: _react2.default.PropTypes.string,
  x: _react2.default.PropTypes.number.isRequired,
  y: _react2.default.PropTypes.number.isRequired,
  onChange: _react2.default.PropTypes.func,
  onDone: _react2.default.PropTypes.func
};
exports.default = PictureEditor;