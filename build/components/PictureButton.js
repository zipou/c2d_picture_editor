"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _PictureButton$propTy;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _reactDom = require("react-dom");

var _reactDom2 = _interopRequireDefault(_reactDom);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var PictureButton = function (_React$Component) {
  _inherits(PictureButton, _React$Component);

  function PictureButton(props) {
    _classCallCheck(this, PictureButton);

    var _this = _possibleConstructorReturn(this, (PictureButton.__proto__ || Object.getPrototypeOf(PictureButton)).call(this, props));

    _this.state = {
      value: ""
    };
    return _this;
  }

  _createClass(PictureButton, [{
    key: "_handleFileInput",
    value: function _handleFileInput(event) {
      this.setState({
        value: event.target.value
      });
      var self = this;
      var reader = new FileReader();
      var file = event.target.files[0];
      var _props = this.props,
          onUpload = _props.onUpload,
          uploadImage = _props.uploadImage;

      reader.onload = function (upload) {
        if (onUpload) {
          uploadImage(upload.target.result).then(function (data) {
            onUpload(data.token);
          });
        }
      };
      if (file) {
        var type = file.type.split("/")[0];
        if (type === "image") {
          this._handleLoading(true);
          reader.readAsDataURL(file);
        }
      }
    }
  }, {
    key: "_handleLoading",
    value: function _handleLoading(loading) {
      this.props.setLoading(loading);
    }
  }, {
    key: "_handleButtonClic",
    value: function _handleButtonClic(event) {
      this.refs.image_input.click(event);
    }
  }, {
    key: "render",
    value: function render() {
      var label = this.props.label;
      var value = this.state.value;

      return _react2.default.createElement(
        "div",
        null,
        _react2.default.createElement(
          "a",
          { className: "btn btn--noir ajouter-article__btnmodifierphoto", onClick: this._handleButtonClic.bind(this) },
          label
        ),
        _react2.default.createElement("input", { style: { display: "none" }, value: value, ref: "image_input", type: "file", accept: "image/*", onChange: this._handleFileInput.bind(this) })
      );
    }
  }]);

  return PictureButton;
}(_react2.default.Component);

PictureButton.propTypes = (_PictureButton$propTy = {
  label: _react2.default.PropTypes.string,
  uploadImage: _react2.default.PropTypes.func.isRequired,
  setLoading: _react2.default.PropTypes.func.isRequired
}, _defineProperty(_PictureButton$propTy, "uploadImage", _react2.default.PropTypes.func.isRequired), _defineProperty(_PictureButton$propTy, "onUpload", _react2.default.PropTypes.func.isRequired), _PictureButton$propTy);
exports.default = PictureButton;