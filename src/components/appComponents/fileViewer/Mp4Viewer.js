import React from 'react'
import { useState, useEffect } from 'react';
import config from "../../../config";
import printJS from "print-js";
import { isImage } from "../../../lib/isImage";
import FileDownloader, {
  downloadFile,
  useProgress,
} from "../../universal/FileDownloader";
import NavigationButton from "./NavigationButton";

const Mp4Viewer = ({
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
                    printable: `${config.cloudWatchUrlBase}${img}`,
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
        <div>
            <video key={filePath} controls width="800">
                <source src={filePath} type="video/mp4" />
                <source src={filePath} type="video/quicktime" />
                <source src={filePath} type="video/x-msvideo" />
                Your browser does not support the video tag.
            </video>
        </div>
    </>
  )
}

export default Mp4Viewer