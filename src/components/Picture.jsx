import React from "react";

import PictureSlider from "./PictureSlider";
import PictureButton from "./PictureButton";
import PictureEditor from "./PictureEditor";

export class Picture extends React.Component {

  static propTypes= {
    buttonLabel : React.PropTypes.string.isRequired,
    loadingLabel : React.PropTypes.string,
    height : React.PropTypes.number.isRequired,
    width : React.PropTypes.number.isRequired,
    maxRange : React.PropTypes.number.isRequired,
    minRange : React.PropTypes.number.isRequired,
    minZoom : React.PropTypes.number.isRequired,
    maxZoom : React.PropTypes.number.isRequired,
    uploadImage: React.PropTypes.func.isRequired,
    update: React.PropTypes.func.isRequired,
    load: React.PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    this.state={
      loading: false,
      uri: null,
      token: props.token,
      scale : 1,
      x: 1,
      y: 1
    }
  }

  componentDidMount() {
    let {token} = this.props;
    if (token) {
      this._loadFromToken(token);
    }
  }

  componentWillReceiveProps(props) {
    let oldToken = this.state.token
    if (props.token && oldToken != props.token) {
      this._loadFromToken(props.token);
    }
  }

  _loadFromToken(token) {
    this.setState({loading : true});
    this.props.load(token)
    .then((image) => {
      this.setState({
        token: token,
        uri: image.full,
        x: image.x,
        y: image.y,
        scale : image.zoom
      });
      if(this.props.onChange){
        this.props.onChange(token);
      }
      this.setState({loading : false});
    })
    .catch(error=>{
      this.setState({loading : false});
    });
  }

  _handleUpload(token) {
    this._loadFromToken(token);
  }

  _handleSlider(event) {
    this._setScaleValue(event.target.value);
  }

  _setScaleValue(value) {
    let {maxRange, minRange} = this.props;
    if (value <= maxRange && value >= minRange ) {
      this.setState({scale: value});
    }
  }

  _handleWheel(event) {
    return;
  //   let {deltaY, deltaX} = event;
  //   let {scale} = this.state;
  //   event.preventDefault();
  //   this._setScaleValue(scale + ((deltaY<0) ? 1 : -1))
  }

  _handleEditorChange(x, y, crop) {
    let {scale, token} = this.state;
    if (!isNaN(x) && !isNaN(y)) {
      this.setState({
        token: token,
        scale: scale,
        x: x,
        y, y,
        crop: crop
      })
    }
  }

  _setLoading(loading) {
    this.setState({
      loading: loading
    })
  }

  _triggerUpdate() {
    let {token, scale, x, y, crop} = this.state;
    this.props.update({
      scale: scale,
      x: x,
      y, y,
      crop: crop
    }, token);
  }

  render() {
    let {uri, x, y, scale, upload, loading} = this.state;
    let {buttonLabel, height, width, uploadImage, loadingLabel, minRange, maxRange, minZoom, maxZoom} = this.props;
    return(
      <div>
          {loading && <span>{loadingLabel}</span>}
          <PictureButton
            setLoading={this._setLoading.bind(this)}
            uploadImage={uploadImage.bind(this)}
            onUpload={this._handleUpload.bind(this)}
            label={buttonLabel}
          />
          <div className="ajouter-article__photoarticle" style={{height: height}} onWheel={this._handleWheel.bind(this)}>
            <PictureEditor
              onDone={this._triggerUpdate.bind(this)}
              onChange={this._handleEditorChange.bind(this)}
              uri={uri}
              scale={scale}
              x={x}
              y={y}
              min={minRange}
              max={maxRange}
              minZoom={minZoom}
              maxZoom={maxZoom}
              width={width}
              height={height}
              border={0}
            />
          </div>
          <PictureSlider
            position={scale}
            min={minRange}
            max={maxRange}
            onDone={this._triggerUpdate.bind(this)}
            onChange={this._setScaleValue.bind(this)}
          />
      </div>
    )
  }
}
