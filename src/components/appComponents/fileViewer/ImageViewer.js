import printJS from "print-js";
import config from "../../../config";
import { isImage } from "../../../lib/isImage";
import FileDownloader, {
  downloadFile,
  useProgress,
} from "../../universal/FileDownloader";
import { BiZoomIn, BiZoomOut } from "react-icons/bi";
import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";
import { TbZoomReset } from "react-icons/tb";
import React, { useRef, useState } from "react";
import NavigationButton from "./NavigationButton";

const ImageViewer = ({
  handleNavigationClick,
  img,
  addFile,
  isExist,
  setProgress,
  handleClose,
  filePath,
  urls,
  rowData,
  showArrowRight,
  showArrowLeft,
}) => {
  //**********State Variables**********

  const transformComponentRef = useRef(null);
  const [scale, setScale] = useState(1);

  const handleZoomIn = () => {
    const { current: transformComponent } = transformComponentRef;
    if (transformComponent) {
      setScale((prevScale) => prevScale + 2);
    }
  };

  const handleZoomOut = () => {
    const { current: transformComponent } = transformComponentRef;
    if (transformComponent) {
      setScale((prevScale) => prevScale - 2);
    }
  };

  const handleZoomReset = () => {
    const { current: transformComponent } = transformComponentRef;
    if (transformComponent) {
      const { resetTransform } = transformComponent;
      resetTransform();
      setScale(1);
    }
    //setScale(1);
  };

  return (
    <div style={{ height: "100%", width: "100%", textAlign: "center" }}>
      <span /*style={{ float: 'right' }}*/ className={"topRight"}>
        <span className={!showArrowLeft ? "disabled-icon" : ""}>
          {" "}
          <NavigationButton
            onClick={() => handleNavigationClick(rowData, "left")}
            title={"prev"}
            direction="prev"
          />
        </span>
        <span className={"printIcon"}>
          <button
            className={"downPrint"}
            onClick={() =>
              printJS({
                printable: `${config.sourceIMGUrl}${img}`,
                type: isImage(img) !== "pdf" ? "image" : "pdf",
              })
            }
          >
          <NavigationButton
            onClick={''}
            direction="print"
            title="Print"
          />
          </button>
        </span>
        <span className={"printIcon"}>
          <button
            className={"downPrint"}
            onClick={() => downloadFile(`${config.sourceIMGUrl}${img}`)}
          >
            <NavigationButton
              onClick={''}
              direction="download"
              title="Download"
            />
          </button>
        </span>
        <span className={"printIcon"}>
          <button className={"downPrint"} onClick={() => addFile(rowData)}>
            <NavigationButton
              isExist={isExist(rowData)}
              direction="check"
              title="Select"
            />
          </button>
        </span>
        <span className={"printIcon"}>
          <button
            className={
              "downPrint" + (useProgress() !== 0 ? " disabled-icon" : "")
            }
            onClick={() => FileDownloader(urls, false, setProgress, false)}
          >
          <NavigationButton
            onClick={''}
            direction="Download as zip"
            title="Download as zip"
          />
          </button>
        </span>
        <NavigationButton
          onClick={() => handleClose(rowData)}
          title={"Close"}
          direction="Close"
        />
        <span className={!showArrowRight ? "disabled-icon" : ""}>
          <NavigationButton
            onClick={() => handleNavigationClick(rowData, "right")}
            title={"next"}
            direction="next"
          />
        </span>
      </span>
      <h2 className="file-name">
        {" "}
        {`${config.sourceIMGUrl}${img}`.split("/").pop()}
      </h2>

      <div className="image-zoom">
        <div className="image-container">
          <TransformWrapper
            key={filePath}
            ref={transformComponentRef}
            options={{ limitToBounds: false, wheel: false, pinch: false }}
          >
            <TransformComponent>
              <img
                key={filePath}
                src={filePath}
                alt={"Zoomable Image" + filePath}
                style={{height:`${70+scale}vh`, width:`${80+scale}vw`}}
                // style={{ transform: `scale(${scale})` }}
              />
            </TransformComponent>
          </TransformWrapper>
        </div>
        <div className={"container"}>
          <div className="zoom-buttons">
            <button
              className={"cursorPtr img-zoom-in-out"}
              onClick={handleZoomIn}
            >
              <BiZoomIn size={40} />
            </button>
            <button
              className={"cursorPtr img-zoom-in-out"}
              onClick={handleZoomOut}
            >
              <BiZoomOut size={40} />
            </button>
            <button
              className={"cursorPtr img-zoom-in-out"}
              onClick={handleZoomReset}
            >
              <TbZoomReset size={40} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageViewer;
