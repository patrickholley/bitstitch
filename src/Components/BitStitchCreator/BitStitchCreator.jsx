import React, { Component } from 'react';
import './BitStitchCreator.scss';
import ImageUploader from '../ImageUploader';
import ImageFrame from '../ImageFrame';
import CrossStitchPattern from '../CrossStitchPattern/CrossStitchPattern';

class BitStitchCreator extends Component {
  constructor(props) {
    super(props);

    this.state = {
      columnCount: 50,
      image: null,
      rowCount: 100,
    }
  }

  onDrop = (event) => {
    event.preventDefault();
    const imageFile = event.dataTransfer.files[0];
    const reader = new FileReader();

    reader.onload = (file) => {
      const image = new Image();
      image.onload = () => {
        this.setState({ image }, () => { this.onImageLoad(); });
      };
      image.src = file.target.result;
    };

    reader.readAsDataURL(imageFile);
  };

  onImageLoad = () => {
    const { columnCount, image, rowCount } = this.state;
    const canvas = document.createElement('canvas');
    const { width, height } = image;
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext('2d');
    context.drawImage(image, 0, 0);
    const imageData = context.getImageData(0, 0, width, height).data;
    // scale the height and width to the number of rows and columns respectively
    // when scaled, is the image disproportionately taller or wider?
    const dimensionDifference = (height / rowCount) - (width / columnCount);
    const largerDimension = dimensionDifference > 0 ? height : width;
    const smallerCount = dimensionDifference > 0 ? rowCount : columnCount;
    const buffer = new Uint8ClampedArray(rowCount * columnCount * 400);

    for (let i = 0; i < rowCount; i++) {
      for (let j = 0; j < columnCount; j++) {
        // divide the larger dimension by rowCount or columnCount, whichever is smaller
        // keeps proper image scale
        const x = Math.round(((largerDimension/smallerCount) * i));
        const y = Math.round(((largerDimension/smallerCount) * j));

        for (let k = 0; k < 10; k++) {
          for (let l = 0; l < 10; l++) {
            const bufferIndex = ((columnCount * 10 * ((i * 10) + k)) + (j * 10) + l) * 4;
            if (k === 9 || l === 9 || (i === 0 && k === 0) || (j === 0 && l === 0)) {
              buffer[bufferIndex] = 63;
              buffer[bufferIndex + 1] = 63;
              buffer[bufferIndex + 2] = 63;
              buffer[bufferIndex + 3] = 255;
            }
            else if (this.outOfBounds(x, y, width, height)) {
              buffer[bufferIndex] = 255;
              buffer[bufferIndex + 1] = 255;
              buffer[bufferIndex + 2] = 255;
              buffer[bufferIndex + 3] = 255;
            } else {
              const imageIndex = ((width * x) + y) * 4;
              buffer[bufferIndex] = imageData[imageIndex];
              buffer[bufferIndex + 1] = imageData[imageIndex + 1];
              buffer[bufferIndex + 2] = imageData[imageIndex + 2];
              buffer[bufferIndex + 3] = imageData[imageIndex + 3];
            }
          }
        }
      }
    }

    canvas.width = columnCount * 10;
    canvas.height = rowCount * 10;
    const bufferData = context.createImageData(canvas.width, canvas.height);
    bufferData.data.set(buffer);
    context.putImageData(bufferData, 0, 0);
    const bufferImage = canvas.toDataURL();

    this.setState({ image: bufferImage });
  };

  outOfBounds = (x, y, width, height) => x < 0 || x >= height || y < 0 || y >= width;

  render() {
    return (
      <>
        <ImageUploader onDrop={this.onDrop} />
        <img alt="uploaded cross-stitch pattern" src={this.state.image} />
        {/*<CrossStitchPattern
          columnCount={this.state.columnCount}
          rowCount={this.state.rowCount}
        />*/}
      </>
    )
  }
}

export default BitStitchCreator;