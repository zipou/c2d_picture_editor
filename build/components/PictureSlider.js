"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _reactDom = require("react-dom");

var _reactDom2 = _interopRequireDefault(_reactDom);

var _reactDraggable = require("react-draggable");

var _reactDraggable2 = _interopRequireDefault(_reactDraggable);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var PictureSlider = function (_React$Component) {
  _inherits(PictureSlider, _React$Component);

  function PictureSlider(props) {
    _classCallCheck(this, PictureSlider);

    var _this = _possibleConstructorReturn(this, (PictureSlider.__proto__ || Object.getPrototypeOf(PictureSlider)).call(this, props));

    _this.state = {
      max: props.max,
      min: props.min,
      maxLeft: -6,
      position: props.position
    };
    return _this;
  }

  _createClass(PictureSlider, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var maxRight = _reactDom2.default.findDOMNode(this.refs.ajouter_article_slidercontainer).offsetWidth - 35;
      this.setState({
        left: Math.floor(maxRight / 2),
        maxRight: maxRight
      });
    }
  }, {
    key: "componentWillReceiveProps",
    value: function componentWillReceiveProps(props) {
      var _state = this.state,
          maxLeft = _state.maxLeft,
          maxRight = _state.maxRight,
          max = _state.max;
      var position = props.position;

      this.setState({
        position: position,
        left: Math.floor(position * maxRight / max + maxLeft)
      });
    }
  }, {
    key: "_handleDrag",
    value: function _handleDrag(event, data) {
      var x = data.x;
      var _state2 = this.state,
          maxLeft = _state2.maxLeft,
          maxRight = _state2.maxRight,
          max = _state2.max,
          min = _state2.min;

      var position = Math.floor((x - maxLeft) * max / maxRight);
      if (position >= min && position <= max) {
        this.setState({
          left: x,
          position: position
        });
        if (this.props.onChange) {
          this.props.onChange(position);
        }
      }
    }
  }, {
    key: "_handleStop",
    value: function _handleStop(event) {
      var onDone = this.props.onDone;

      if (onDone) {
        onDone();
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _state3 = this.state,
          left = _state3.left,
          maxRight = _state3.maxRight,
          maxLeft = _state3.maxLeft;


      return _react2.default.createElement(
        "div",
        { ref: "ajouter_article_slidercontainer", className: "ajouter-article__lignerose", style: { textAlign: "left" } },
        _react2.default.createElement("div", { className: "ajouter-article__lignerose__loupe" }),
        _react2.default.createElement(
          _reactDraggable2.default,
          { axis: "x", bounds: { left: maxLeft, right: maxRight }, onStop: this._handleStop.bind(this), onDrag: this._handleDrag.bind(this), position: { x: left, y: 0 } },
          _react2.default.createElement("span", { className: "icon icon-coeur-dressing-35", style: { cursor: "pointer", textAlign: "center", paddingTop: 5 } })
        )
      );
    }
  }]);

  return PictureSlider;
}(_react2.default.Component);

PictureSlider.propsTypes = {
  position: _react2.default.propTypes.number,
  min: _react2.default.propTypes.number,
  max: _react2.default.propTypes.number,
  onDone: _react2.default.propTypes.func,
  onChange: _react2.default.propTypes.func
};
exports.default = PictureSlider;