import React, { useState, useRef, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
import printJS from "print-js";
import {
  BiZoomIn,
  BiZoomOut,
  BiReset,
  BiFullscreen,
  BiExitFullscreen,
} from "react-icons/bi";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import ClipLoader from "react-spinners/ClipLoader";

import config from "../../../config";
import { isImage } from "../../../lib/isImage";
import FileDownloader, {
  downloadFile,
  useProgress,
} from "../../universal/FileDownloader";
import NavigationButton from "./NavigationButton";

// Configure pdfjs worker to bundle with the app for same-origin execution (avoids fake worker warning)
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

const PdfViewer = ({
  handleNavigationClick,
  img,
  fileUrl,
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
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1.25);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [pageInput, setPageInput] = useState("1");
  const viewerContainerRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const pageRefs = useRef({});

  const documentUrl = fileUrl || `${config.cloudWatchUrlBase}${img}`;
  const fileName = `${config.cloudWatchUrlBase}${img}`.split("/").pop();

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    setPageNumber(1);
    setPageInput("1");
  };

  const scrollToPage = (pageNum) => {
    const targetEl = pageRefs.current[pageNum];
    if (targetEl) {
      targetEl.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const changePage = (offset) => {
    const next = Math.min(Math.max(1, pageNumber + offset), numPages || 1);
    setPageNumber(next);
    setPageInput(String(next));
    scrollToPage(next);
  };

  const handlePageInputChange = (e) => {
    const val = e.target.value;
    setPageInput(val);
    const parsed = parseInt(val, 10);
    if (!isNaN(parsed) && parsed >= 1 && parsed <= (numPages || 1)) {
      setPageNumber(parsed);
      scrollToPage(parsed);
    }
  };

  const handlePageInputBlur = () => {
    setPageInput(String(pageNumber));
  };

  // Sync toolbar page number with the page currently visible in viewport while scrolling
  useEffect(() => {
    if (!numPages || !scrollContainerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        let bestEntry = null;
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (!bestEntry || entry.intersectionRatio > bestEntry.intersectionRatio) {
              bestEntry = entry;
            }
          }
        });

        if (bestEntry) {
          const pageNum = Number(bestEntry.target.getAttribute("data-page-number"));
          if (pageNum) {
            setPageNumber(pageNum);
            setPageInput(String(pageNum));
          }
        }
      },
      {
        root: scrollContainerRef.current,
        threshold: [0.1, 0.3, 0.5, 0.7, 0.9],
      }
    );

    Object.values(pageRefs.current).forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [numPages, scale]);

  const handleZoomIn = () => {
    setScale((prev) => Math.min(prev + 0.25, 3.0));
  };

  const handleZoomOut = () => {
    setScale((prev) => Math.max(prev - 0.25, 0.5));
  };

  const handleZoomReset = () => {
    setScale(1.25);
  };

  const toggleFullscreen = () => {
    if (!viewerContainerRef.current) return;
    if (!document.fullscreenElement) {
      viewerContainerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  return (
    <>
      <div style={{ textAlign: "center" }}>
        <span className={"topCenter"}>
          <h2 className="file-name"> {fileName}</h2>
        </span>
        <span className={"topRight"}>
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
                  printable: documentUrl,
                  type: isImage(img) !== "pdf" ? "image" : "pdf",
                })
              }
            >
              <NavigationButton direction="print" title="Print" />
            </button>
          </span>
          <span className={"printIcon"}>
            <button
              className={"downPrint"}
              onClick={() => downloadFile(documentUrl)}
            >
              <NavigationButton
                onClick={""}
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
                onClick={""}
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

      <div
        ref={viewerContainerRef}
        style={{
          border: "1px solid rgba(0, 0, 0, 0.3)",
          display: "flex",
          flexDirection: "column",
          height: isFullscreen ? "100vh" : "80%",
          width: isFullscreen ? "100vw" : "70%",
          backgroundColor: "#fff",
          borderRadius: "4px",
          boxShadow: "0 8px 32px rgba(0,0,0,0.35)",
          overflow: "hidden",
          zIndex: 1,
        }}
      >
        {/* PDF Toolbar */}
        <div
          style={{
            alignItems: "center",
            backgroundColor: "#eeeeee",
            borderBottom: "1px solid rgba(0, 0, 0, 0.15)",
            display: "flex",
            padding: "6px 12px",
            gap: "10px",
            color: "#333",
            fontSize: "14px",
            flexWrap: "wrap",
          }}
        >
          {/* Fullscreen Button */}
          <button
            onClick={toggleFullscreen}
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "4px",
              display: "flex",
              alignItems: "center",
              color: "#333",
            }}
          >
            {isFullscreen ? (
              <BiExitFullscreen size={20} />
            ) : (
              <BiFullscreen size={20} />
            )}
          </button>

          {/* Zoom Controls */}
          <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <button
              onClick={handleZoomOut}
              title="Zoom Out"
              disabled={scale <= 0.5}
              style={{
                background: "none",
                border: "1px solid #ccc",
                borderRadius: "3px",
                cursor: scale <= 0.5 ? "not-allowed" : "pointer",
                padding: "2px 6px",
                display: "flex",
                alignItems: "center",
                color: scale <= 0.5 ? "#aaa" : "#333",
              }}
            >
              <BiZoomOut size={18} />
            </button>
            <button
              onClick={handleZoomReset}
              title="Reset Zoom"
              style={{
                background: "none",
                border: "1px solid #ccc",
                borderRadius: "3px",
                cursor: "pointer",
                padding: "2px 8px",
                fontSize: "13px",
                minWidth: "54px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "2px",
                color: "#333",
              }}
            >
              <BiReset size={16} />
              {Math.round(scale * 100)}%
            </button>
            <button
              onClick={handleZoomIn}
              title="Zoom In"
              disabled={scale >= 3.0}
              style={{
                background: "none",
                border: "1px solid #ccc",
                borderRadius: "3px",
                cursor: scale >= 3.0 ? "not-allowed" : "pointer",
                padding: "2px 6px",
                display: "flex",
                alignItems: "center",
                color: scale >= 3.0 ? "#aaa" : "#333",
              }}
            >
              <BiZoomIn size={18} />
            </button>
          </div>

          {/* Page Navigation Controls */}
          <div
            style={{
              marginLeft: "auto",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <button
              onClick={() => changePage(-1)}
              disabled={pageNumber <= 1}
              title="Previous Page"
              style={{
                background: "none",
                border: "1px solid #ccc",
                borderRadius: "3px",
                cursor: pageNumber <= 1 ? "not-allowed" : "pointer",
                padding: "3px 6px",
                display: "flex",
                alignItems: "center",
                color: pageNumber <= 1 ? "#aaa" : "#333",
              }}
            >
              <FaChevronLeft size={12} />
            </button>

            <input
              type="text"
              value={pageInput}
              onChange={handlePageInputChange}
              onBlur={handlePageInputBlur}
              title="Current Page"
              style={{
                width: "42px",
                textAlign: "center",
                border: "1px solid #ccc",
                borderRadius: "3px",
                padding: "2px 4px",
                fontSize: "13px",
              }}
            />

            <span style={{ color: "#333" }}>/ {numPages || "--"}</span>

            <button
              onClick={() => changePage(1)}
              disabled={!numPages || pageNumber >= numPages}
              title="Next Page"
              style={{
                background: "none",
                border: "1px solid #ccc",
                borderRadius: "3px",
                cursor:
                  !numPages || pageNumber >= numPages
                    ? "not-allowed"
                    : "pointer",
                padding: "3px 6px",
                display: "flex",
                alignItems: "center",
                color:
                  !numPages || pageNumber >= numPages ? "#aaa" : "#333",
              }}
            >
              <FaChevronRight size={12} />
            </button>
          </div>
        </div>

        {/* PDF Document Canvas Viewport */}
        <div
          ref={scrollContainerRef}
          style={{
            flex: 1,
            overflow: "auto",
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-start",
            padding: "20px",
            backgroundColor: "#525659",
          }}
        >
          <Document
            file={documentUrl}
            onLoadSuccess={onDocumentLoadSuccess}
            loading={
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "200px",
                  color: "#fff",
                  gap: "10px",
                }}
              >
                <ClipLoader color="#ffffff" size={32} />
                <span>Loading PDF document...</span>
              </div>
            }
            error={
              <div
                style={{
                  color: "#ff8b8b",
                  padding: "20px",
                  textAlign: "center",
                }}
              >
                Failed to load PDF document. Please verify the file path or network access.
              </div>
            }
          >
            {numPages && (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                {Array.from(new Array(numPages), (_, index) => {
                  const page = index + 1;
                  return (
                    <div
                      key={`page_${page}`}
                      id={`pdf-page-${page}`}
                      ref={(el) => (pageRefs.current[page] = el)}
                      data-page-number={page}
                      style={{
                        marginBottom: index === numPages - 1 ? 0 : "20px",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
                        backgroundColor: "#fff",
                      }}
                    >
                      <Page
                        pageNumber={page}
                        scale={scale}
                        renderTextLayer={true}
                        renderAnnotationLayer={true}
                      />
                    </div>
                  );
                })}
              </div>
            )}
          </Document>
        </div>
      </div>
    </>
  );
};

export default PdfViewer;
