import React from "react";
import ReactDOM from "react-dom";
import Draggable from "react-draggable";

export default class PictureSlider extends React.Component {

  static propsTypes = {
    position : React.propTypes.number,
    min : React.propTypes.number,
    max : React.propTypes.number,
    onDone : React.propTypes.func,
    onChange: React.propTypes.func
  }

  constructor(props) {
    super(props);
    this.state={
      max: props.max,
      min: props.min,
      maxLeft:-6,
      position: props.position,
    }
  }

  componentDidMount() {
    let maxRight = (ReactDOM.findDOMNode(this.refs.ajouter_article_slidercontainer).offsetWidth - 35);
    this.setState({
      left: Math.floor(maxRight / 2),
      maxRight: maxRight
    });
  }

  componentWillReceiveProps(props) {
    let {maxLeft, maxRight, max} = this.state;
    let {position} = props;
    this.setState({
      position: position,
      left : Math.floor((position * maxRight /  max )+maxLeft)
    })
  }

  _handleDrag(event, data) {
    let {x} = data;
    let {maxLeft, maxRight, max, min} = this.state;
    let position = Math.floor(((x-maxLeft) * max) / maxRight);
    if (position >= min &&  position <= max) {
      this.setState({
        left: x,
        position: position
      });
      if (this.props.onChange) {
        this.props.onChange(position);
      }
    }
  }

  _handleStop(event) {
    let {onDone} = this.props;
    if (onDone) {
      onDone();
    }
  }


  render() {
    let {left, maxRight, maxLeft} = this.state;

    return(
        <div ref="ajouter_article_slidercontainer" className="ajouter-article__lignerose" style={{textAlign:"left"}}>
          <div className="ajouter-article__lignerose__loupe"></div>
          <Draggable axis="x" bounds={{left: maxLeft, right: maxRight}} onStop={this._handleStop.bind(this)} onDrag={this._handleDrag.bind(this)} position={{ x:left, y : 0}}>
            <span className="icon icon-coeur-dressing-35" style={{cursor:"pointer", textAlign:"center", paddingTop: 5}}></span>
          </Draggable>
        </div>
    )

  }

}
