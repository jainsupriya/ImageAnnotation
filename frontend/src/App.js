import React, { Component } from 'react';
import Image from 'react-image-resizer';
import Button from 'react-bootstrap/Button';
import Annotation from  'react-image-annotation';
import Typography from '@material-ui/core/Typography';
import './App.css';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';


const styles = {
  root: {
    width: '100%',
    maxWidth: 500,
    marginLeft: 40
  },
};

const axios = require('axios');

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
        annotation: {},
        imagePreview:'',
        image:''
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleChange(event)
  {

      const target = event.target;
      const name = target.name;
      const value = target.value;
      if (name === "imageToResize") {
          console.log(target.files);
          var imageToResize = target.files[0];
          var data = new FormData();
          data.append('photos', imageToResize);
          axios.defaults.withCredentials = true;
          axios.post('/upload-image', data)
        .then(res => {
          if (res.status === 200) {
              //Download image
            axios.post('/download-image/' + imageToResize.name)
                .then(res => {
                    let preview = 'data:image/jpg;base64, ' + res.data;
                    this.setState({
                        image: imageToResize.name,
                        imagePreview: preview
                    })
                }).catch((err) =>{
                    if(err){
                        this.setState({
                            errorRedirect: true
                        })
                    }
                });
            }
        });
      }
      else{
          const {name, value} = event.target;
          this.setState({ [name]: value });
      }
  }
  handleSubmit(event)
  {
    event.preventDefault();  
    this.setState({resize: true})
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
    const { classes } = this.props;
    let imageToDisplay = <img src=""  />
    if (this.state.imagePreview) {
      imageToDisplay = <img src={this.state.imagePreview} alt="logo"/>
  }
    return (
    
      <div  className={classes.root}>
      <br/><br/>
        <Typography variant="title" style={{color: "#094D98"}} >
        1. Upload an image
        </Typography>
        <input type="file" name="imageToResize" id="imageToResize" className="btn btn-lg photo-upload-btn" onChange={this.handleChange} className="btn btn-lg photo-upload-btn"  />
        <div className="form-group">
        <label htmlFor="image"><strong>Upload a file </strong></label><br />
        </div>
        <div className="center-content profile-heading"> {imageToDisplay} </div>
        <Typography variant="title" style={{color: "#094D98"}} >
        2. Resize your image
        </Typography>
        <div className="form-group" style={{width : 200}}>
        Enter Height: <input type="text" className="form-control"  name="height" value={this.state.height} onChange={this.handleChange} placeholder="Height" />
        </div>
        <div className="form-group" style={{width : 200}}>
        Enter Width : <input type="text" className="form-control"  name="width"  value={this.state.width} onChange={this.handleChange}  placeholder="Width" />
        </div>
        <Button variant="primary" style={{width : 200, marginLeft:0}} onClick={this.handleSubmit}>Resize</Button>
        {this.state.resize && <Image src= {this.state.imagePreview}  height={this.state.height} width={this.state.width}/>}
        {this.state.resize &&<Typography variant="title" style={{color: "#094D98"}} >
        2. Annotate Your Image
        </Typography>}
        {this.state.resize &&<Annotation
        src={this.state.imagePreview} 
        annotations={this.state.annotations}
        height="50"
        width="50"
        type={this.state.type}
        value={this.state.annotation}
        onChange={this.onChange}
        onSubmit={this.onSubmit}
        />}
      </div>
    );
  }
}
App.propTypes = {
  classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(App);

