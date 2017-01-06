import React from "react";
import AvatarEditor from "../libs/AvatarEditor.js";

// import {MIN_ZOOM, MAX_ZOOM} from "../index.js";

export const DEFAULT_ZOOM = 1;

export default class PictureEditor extends React.Component {

  static propTypes= {
    minZoom : React.PropTypes.number.isRequired,
    maxZoom : React.PropTypes.number.isRequired,
    scale : React.PropTypes.number.isRequired,
    width : React.PropTypes.number.isRequired,
    height : React.PropTypes.number.isRequired,
    min : React.PropTypes.number.isRequired,
    max : React.PropTypes.number.isRequired,
    border : React.PropTypes.number.isRequired,
    uri : React.PropTypes.number.string,
    x : React.PropTypes.number.isRequired,
    y : React.PropTypes.number.isRequired,
    onChange: React.PropTypes.func,
    onDone: React.PropTypes.func
  }

  constructor(props) {
    super(props);
    let {scale, uri, x, y} = props;
    this.state={
      scale: scale,
      uri: uri,
      x,
      y
    }
  }

  componentWillReceiveProps(newprops) {
    let {scale, token, x, y, uri} = newprops;
    this.setState({
      scale: scale,
      uri: uri,
      x : x,
      y: y
    });
  }

  _updateState(x, y, crop) {
    if(this.props.onChange) {
      this.props.onChange(x, y, crop);
    }
  }

  _onUpdate(coords) {
    this._updateState(coords.x, coords.y, coords.crop)
  }

  _onDone() {
    let {onDone} = this.props;
    if (onDone) {
      onDone();
    }
  }

  render() {
    let {scale, width, height, min, max, border, minZoom, maxZoom } = this.props;
    let {uri, x, y}= this.state;
    let zoom = (scale) ? ((scale/(max/maxZoom)+1)-(min-minZoom)) : DEFAULT_ZOOM;
    return(
      <AvatarEditor
        ref="avatareditor"
        image={uri}
        x={x}
        y={y}
        scale={zoom}
        border={border}
        width={width}
        height={height}
        onMouseUp={this._onDone.bind(this)}
        onImageChange={this._onUpdate.bind(this)}
      />
    )
  }
}
