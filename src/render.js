import React, { Component } from "react";
import xslx from "xlsx";

import FileSaver from "file-saver";

export class Render extends Component {
  constructor(props) {
    super(props);
    this.state = {
      file: null,
      imagePreviewUrl: null,
      canvasHeight: 0,
      canvasWidth: 0
    };
  }

  downloadExcel = async datas => {
    let { file } = this.state;
    let wb = xslx.utils.book_new();
    wb.Props = {
      Title: "SheetJS Tutorial",
      Subject: "Test",
      Author: "Red Stapler",
      CreatedDate: new Date(2017, 12, 19)
    };
    wb.SheetNames.push("Test Sheet");
    var ws_data = [];

    let pushData = [];

    await datas.map((data, index) => {
      pushData.push(data.toString());
      if ((index + 1) % 4 === 0) {
        ws_data.push(pushData);
        pushData = [];
      }
    });

    var ws = xslx.utils.aoa_to_sheet(ws_data);
    wb.Sheets["Test Sheet"] = ws;
    var wbout = xslx.write(wb, { bookType: "xlsx", type: "binary" });

    function s2ab(s) {
      var buf = new ArrayBuffer(s.length); //convert s to arrayBuffer
      var view = new Uint8Array(buf); //create uint8array as viewer
      for (var i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xff; //convert to octet
      return buf;
    }
    FileSaver(
      new Blob([s2ab(wbout)], { type: "application/octet-stream" }),
      `${file.name}.xlsx`
    );
  };

  handleSubmit(e) {
    e.preventDefault();
    // TODO: do something with -> this.state.file
    this.renderCanvas();
  }

  renderCanvas = async () => {
    let c = document.getElementById("myCanvas");
    let ctx = c.getContext("2d");
    const myImage = document.getElementById("myImage");

    if (myImage) {
      const { height, width } = myImage;

      await this.setState(
        {
          canvasHeight: height * 10,
          canvasWidth: width * 10
        },
        () => {
          ctx.fillStyle = "white";
          ctx.fillRect(0, 0, width, height);
          ctx.drawImage(myImage, 0, 0);
        }
      );

      let c2 = document.getElementById("secondCanvas");
      let ctx2 = c2.getContext("2d");

      var imgData = ctx.getImageData(0, 0, width, height);
      ctx2.putImageData(imgData, 0, 0);

      this.downloadExcel(imgData.data);
    }
  };

  handleImageChange(e) {
    e.preventDefault();
    let reader = new FileReader();

    let file = e.target.files[0];

    reader.onloadend = () => {
      this.setState({
        file: file,
        imagePreviewUrl: reader.result
      });
    };

    reader.readAsDataURL(file);
    // const { files } = e.target;

    // for (let i = 0; i < files.length; i++) {
    //   if (i === 2) {
    //     break;
    //   }
    //   let reader = new FileReader();

    //   reader.onloadend = () => {
    //     this.setState(
    //       {
    //         file: files[i],
    //         imagePreviewUrl: reader.result
    //       },
    //       () => {
    //         this.renderCanvas();
    //       }
    //     );
    //   };

    //   reader.readAsDataURL(files[i]);
    // }

    // file.map((singleFile, index) => {
    //   reader.onloadend = () => {
    //     this.setState({
    //       file: singleFile,
    //       imagePreviewUrl: reader.result
    //     });
    //   };

    //   reader.readAsDataURL(singleFile);
    //   if (index === 2) {
    //     break;
    //   }
    // });
  }

  componentDidMount() {
    this.renderCanvas();
  }

  render() {
    let { imagePreviewUrl, canvasHeight, canvasWidth } = this.state;
    let imagePreview = null;
    if (imagePreviewUrl) {
      imagePreview = <img id="myImage" src={imagePreviewUrl} />;
    } else {
      imagePreview = (
        <div className="previewText">Please select an Image for Preview</div>
      );
    }

    return (
      <div className="previewComponent">
        <form onSubmit={e => this.handleSubmit(e)}>
          <input
            className="fileInput"
            type="file"
            onChange={e => this.handleImageChange(e)}
            multiple
          />
          <button
            className="submitButton"
            type="submit"
            onClick={e => this.handleSubmit(e)}
          >
            Upload Image
          </button>
        </form>
        <div className="imgPreview">{imagePreview}</div>
        <canvas
          id="myCanvas"
          style={{
            width: canvasWidth,
            height: canvasHeight,
            display: "none"
          }}
        ></canvas>
        <br></br>

        <canvas
          id="secondCanvas"
          style={{
            width: canvasWidth,
            height: canvasHeight,
            display: "none"
          }}
        ></canvas>
      </div>
    );
  }
}

export default Render;
