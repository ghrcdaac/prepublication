import config from "../../../config";
import { isImage } from "../../../lib/isImage";
import FileDownloader, {
  downloadFile,
  useProgress,
} from "../../universal/FileDownloader";
import React from "react";
import NavigationButton from "./NavigationButton";

const MiscDocsViewer = ({
  addFile,
  rowData,
  handleNavigationClick,
  handleClose,
  isExist,
  setProgress,
  urls,
  img,
  showArrowLeft,
  showArrowRight,
}) => {
  const folderUrl = img.split("/").filter(Boolean);
  const folderName = folderUrl[folderUrl.length - 1];

  return (
    <div style={{ textAlign: "center", top: "50%", left: "50%" }}>
      <h2 className="file-name">
        {" "}
        {`${config.sourceIMGUrl}${img}`.split("/").pop()}
        <span /*style={{ float: 'right' }}*/>
          <span className={"printIcon"}>
            {isImage(img) ? (
              <button
                className={"downPrint"}
                onClick={() =>
                  downloadFile(`${config.sourceIMGUrl}${img}`)
                }
              >
                <NavigationButton
                  onClick={''}
                  direction="download"
                  title="Download"
                />
              </button>
            ) : folderName ? (
              "Folder: " + folderName
            ) : (
              ""
            )}
          </span>
        </span>
      </h2>
      <span /*style={{ float: 'right' }}*/ className={"topRight"}>
        <span className={!showArrowLeft ? "disabled-icon" : ""}>
          <NavigationButton
            onClick={() => handleNavigationClick(rowData, "left")}
            title={"prev"}
            direction="prev"
          />
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
  );
};

export default MiscDocsViewer;
