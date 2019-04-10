import React, { Component } from 'react';
import logo from './logo.svg';
import Image from 'react-image-resizer';
import Button from 'react-bootstrap/Button';
import Annotation from  'react-image-annotation';
import './App.css';


class App extends Component {
  constructor(props)
  {
    super(props);
    this.state = {
        height: "",
        width: "",
        selectedFile: null,
        resize:false,
        annotations: [],
        annotation: {}
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.fileChangedHandler= this.fileChangedHandler.bind(this);
  }
  handleChange(event)
  {
    const {name, value} = event.target;
    this.setState({ [name]: value });
    console.log(this.state.height);
    console.log(this.state.width);
  }
  handleSubmit(event)
  {
    event.preventDefault();
    
    this.setState({resize: true})
    console.log(this.state.resize)
  }

  fileChangedHandler = event => {
    console.log(event.target.files[0] );
    this.setState({ selectedFile: event.target.files[0] });
    const formData = new FormData();
    formData.append(
      'myFile',
      event.target.files[0],
      event.target.files[0].name,
    );
  }

    onChange = (annotation) => {
      this.setState({ annotation })
    }

    onSubmit = (annotation) => {
      const { geometry, data } = annotation
   
      this.setState({
        annotation: {},
        annotations: this.state.annotations.concat({
          geometry,
          data: {
            ...data,
            id: Math.random()
          }
        })
      })
      console.log(this.state.annotations)
      console.log(this.state.annotation)
    }

  
  render() {
    return (
      <div className="container">
      <br/><br/>
      <form method="post" onSubmit={this.handleSubmit} >
      <input type="file" name="imageToResize" id="imageToResize" className="btn btn-lg photo-upload-btn" onChange={this.handleChange} className="btn btn-lg photo-upload-btn" />
      <div className="form-group">
      <label htmlFor="image"><strong>Upload a file </strong></label><br />
      </div>
      <Button variant="primary">Upload</Button>
      <div className="form-group" style={{width : 200, marginLeft:600}}>
      Height: <input type="text" className="form-control"  name="height" value={this.state.height} onChange={this.handleChange} placeholder="Height" />
      </div>
      <div className="form-group" style={{width : 200,  marginLeft:600}}>
      Width : <input type="text" className="form-control"  name="width"  value={this.state.width} onChange={this.handleChange}  placeholder="Width" />
      </div>
      <Button variant="primary" style={{width : 200, marginLeft:0}} onClick={this.handleSubmit}>Resize</Button>
          <Image
          src="https://www.android.com/static/2016/img/devices/phones/htc-u11/htc-u11_1x.png"  
          height={400} width={300}/>


      </form>
      </div>
    );
  }
}

export default App;

