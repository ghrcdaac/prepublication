import { Viewer, Worker } from "@react-pdf-viewer/core";
import config from "../../../config";
import React from "react";
import * as pdfjs from "pdfjs-dist";
import { toolbarPlugin } from "@react-pdf-viewer/toolbar";
import printJS from "print-js";
import { isImage } from "../../../lib/isImage";
import FileDownloader, {
  downloadFile,
  useProgress,
} from "../../universal/FileDownloader";
import NavigationButton from "./NavigationButton";

const PdfViewer = ({
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
  const workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
  const toolbarPluginInstance = toolbarPlugin();
  const { Toolbar } = toolbarPluginInstance;
  // console.log("pdfViewer....")
  // console.log(rowData)
  return (
    <>
      <div style={{ textAlign: "center" }}>
        <span className={"topCenter"}>
          <h2 className="file-name">
            {" "}
            {`${config.cloudWatchUrlBase}${img}`.split("/").pop()}
          </h2>
        </span>
        <span /*style={{ float: 'right' }}*/ className={"topRight"}>
          <span className={!showArrowLeft ? "disabled-icon" : ""}>
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
      </div>
      <Worker workerUrl={workerSrc}>
        {" "}
        <div
          className="rpv-core__viewer"
          style={{
            border: "1px solid rgba(0, 0, 0, 0.3)",
            display: "flex",
            flexDirection: "column",
            height: "80%",
            width: "70%",
          }}
        >
          <div
            style={{
              alignItems: "center",
              backgroundColor: "#eeeeee",
              borderBottom: "1px solid rgba(0, 0, 0, 0.1)",
              display: "flex",
              padding: "4px",
            }}
          >
            <Toolbar>
              {(props) => {
                const {
                  CurrentPageInput,
                  EnterFullScreen,
                  GoToNextPage,
                  GoToPreviousPage,
                  NumberOfPages,
                  ShowSearchPopover,
                  Zoom,
                  ZoomIn,
                  ZoomOut,
                } = props;
                return (
                  <>
                    <div style={{ padding: "0px 2px" }}>
                      <ShowSearchPopover />
                    </div>
                    <div style={{ padding: "0px 2px", marginLeft: "auto" }}>
                      <EnterFullScreen />
                    </div>
                    <div style={{ padding: "0px 2px" }}>
                      <ZoomOut />
                    </div>

                    <div style={{ padding: "0px 2px" }}>
                      <Zoom />
                    </div>
                    <div style={{ padding: "0px 2px" }}>
                      <ZoomIn />
                    </div>
                    <div style={{ padding: "0px 2px", marginLeft: "auto" }}>
                      <GoToPreviousPage />
                    </div>
                    <div style={{ padding: "0px 2px", width: "4rem" }}>
                      <CurrentPageInput />
                    </div>
                    <div style={{ padding: "0px 2px", color: "black" }}>
                      / <NumberOfPages />
                    </div>
                    <div style={{ padding: "0px 2px" }}>
                      <GoToNextPage />
                    </div>
                  </>
                );
              }}
            </Toolbar>
          </div>
          <div
            style={{
              flex: 1,
              overflow: "hidden",
            }}
          >
            <Viewer
              fileUrl={`${config.sourceIMGUrl}${img}`}
              plugins={[toolbarPluginInstance]}
              defaultScale={1.25}
            />
          </div>
        </div>
      </Worker>
    </>
  );
};

export default PdfViewer;
