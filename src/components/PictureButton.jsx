import React from "react";
import ReactDOM from "react-dom";

export default class PictureButton extends React.Component {

  static propTypes= {
    label : React.PropTypes.string,
    uploadImage : React.PropTypes.func.isRequired,
    setLoading : React.PropTypes.func.isRequired,
    uploadImage : React.PropTypes.func.isRequired,
    onUpload : React.PropTypes.func.isRequired
  }

  constructor(props) {
    super(props);
    this.state={
      value : ""
    }
  }

  _handleFileInput(event) {
    this.setState({
      value : event.target.value
    })
    let self = this;
    let reader = new FileReader();
    let file = event.target.files[0];
    let {onUpload, uploadImage} = this.props;
    reader.onload = (upload) => {
      if (onUpload) {
        uploadImage(upload.target.result)
        .then((data)=> {
            onUpload(data.token);
        });
      }
    }
    if (file) {
      let type = file.type.split("/")[0];
      if (type === "image") {
        this._handleLoading(true);
        reader.readAsDataURL(file);
      }
    }
  }

  _handleLoading(loading) {
    this.props.setLoading(loading);
  }

  _handleButtonClic(event) {
    this.refs.image_input.click(event);
  }

  render() {
    let {label} = this.props;
    let {value} = this.state;
    return(
      <div>
        <a className="btn btn--noir ajouter-article__btnmodifierphoto" onClick={this._handleButtonClic.bind(this)}>{label}</a>
        <input style={{display: "none"}} value={value} ref='image_input' type="file" accept="image/*" onChange={this._handleFileInput.bind(this)}/>
      </div>
    )
  }
}
