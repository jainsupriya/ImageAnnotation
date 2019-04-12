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
    marginLeft: 40
  },
};

const axios = require('axios');
var imagesToUpload=[];
class App extends Component {
  constructor(props)
  {
    super(props);
    this.state = {
        height: "",
        width: "",
        resize:false,
        annotations: [],
        annotation: {},
        uploaded:false,
        multiple:false,
        imagePreview:'',
        image:'',
        imageNumber :0,
        annotationData :[],
        resizedImage:'',
        geometryData:[],
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

          if(event.target.files.length>1)
            this.setState({multiple:true})

          for(let i=0;i<event.target.files.length;i++)
              imagesToUpload.push(event.target.files[i]);

          var imageToResize = target.files[0];

          var data = new FormData();
          for(let i=0;i<imagesToUpload.length;i++)
            data.append('images', imagesToUpload[i]);

          axios.defaults.withCredentials = true;
          axios.post('/upload-image', data)
        .then(res => {
          if (res.status === 200) {
            this.setState({uploaded:true})
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

  handlePrevious= ()=>{
    console.log(this.state.imageNumber)
    console.log(this.state.imagesToUpload)
    if(this.state.imageNumber >0)
    {
      let imageno = this.state.imageNumber-1;
      this.setState({imageNumber: imageno});
      var imageToResize = imagesToUpload[this.state.imageNumber];
      console.log(imageToResize);
      axios.post('/download-image/' +imageToResize.name)
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
  }

  handleNext= ()=>{
    console.log(this.state.imagesToUpload)
    if(this.state.imageNumber < 4)
    {
      let imageno = this.state.imageNumber+1;
      this.setState({imageNumber: imageno});
      var imageToResize = imagesToUpload[this.state.imageNumber];
      console.log(imageToResize);
      axios.post('/download-image/' +imageToResize.name)
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
    var tdata= {
      label: data,
      geometry: geometry
    }
    let tempdata = [...this.state.annotationData, tdata];
    this.setState({ annotationData: tempdata});

    var json = {
      "image": this.state.image,
      "annotations": this.state.annotationData,

    }
    axios.post('/annotation' , json)
    .then(res => {
    console.log(res.data);
    }).catch((err) =>{
    if(err){
    this.setState({
    errorRedirect: true
    })
    }
    });
    console.log(this.state.annotations)
    console.log(this.state.annotation)
  }

  
  render() {
    const { classes } = this.props;
    let imageToDisplay = <img src=""  />
    let resizedImage = <Image src= ""  height="" width=""/>
    if (this.state.imagePreview) {
      imageToDisplay = <img src={this.state.imagePreview} alt="logo"/>
      resizedImage = <Image src= {this.state.imagePreview}  height={this.state.height} width={this.state.width} />
    }

    return (
    
      <div  className={classes.root}>
      <br/><br/>
        <Typography variant="title" style={{color: "#094D98"}} >
        1. Upload an image
        </Typography>
        <input type="file" multiple name="imageToResize" id="imageToResize" className="btn btn-lg photo-upload-btn" onChange={this.handleChange} className="btn btn-lg photo-upload-btn"  />
        <div className="form-group">
        <label htmlFor="image"><strong>Upload a file </strong></label><br />
        </div>  
        <Annotation
        src={this.state.imagePreview} 
        annotations={this.state.annotations}
        type={this.state.type}
        height={this.state.height}
        width={this.state.width}
        value={this.state.annotation}
        onChange={this.onChange}
        onSubmit={this.onSubmit}
        />
        {this.state.uploaded &&  this.state.multiple && 
          <Button variant="secondary" style={{ marginLeft:0}} onClick={this.handlePrevious}>Previous</Button> }
        {this.state.uploaded &&  this.state.multiple && 
          <Button variant="secondary" style={{marginLeft:1200}} onClick={this.handleNext}>Next</Button> }
        <br/><br/>
        <Typography variant="title" style={{color: "#094D98"}} >
        3. Resize your image
        </Typography>
        <div className="form-group" style={{width : 200}}>
        Enter Height: <input type="text" className="form-control"  name="height" value={this.state.height} onChange={this.handleChange} placeholder="Height" />
        </div>
        <div className="form-group" style={{width : 200}}>
        Enter Width : <input type="text" className="form-control"  name="width"  value={this.state.width} onChange={this.handleChange}  placeholder="Width" />
        </div>
        <Button variant="primary" style={{width : 200, marginLeft:0}} onClick={this.handleSubmit}>Resize</Button>
    
        {this.state.resize && <a href= {this.state.imagePreview} download> Download Image
        <Image src= {this.state.imagePreview}  height={this.state.height} width={this.state.width} />
        </a>}
      </div>
    );
  }
}
App.propTypes = {
  classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(App);

//    {this.state.resize &&<Image src= {this.state.imagePreview}  height={this.state.height} width={this.state.width} />}