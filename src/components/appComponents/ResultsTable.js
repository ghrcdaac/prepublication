import { DataGrid, gridClasses } from "@mui/x-data-grid";
import React, { useEffect, useState, useRef, useCallback } from "react";
import { useGetGranSearchQuery } from "../../feature/api/apiSlice";
import { useDispatch, useSelector } from "react-redux";
import { XMLParser } from "fast-xml-parser";
import { setSelectedList } from "../../feature/selectedListSlice";
import { setDelim } from "../../feature/delimSlice";
import { setSearch } from "../../feature/searchSlice";
import { setCrumb } from "../../feature/crumbSlice";
import { isImage } from "../../lib/isImage";
import { alpha, Backdrop } from "@mui/material";
import config from "../../config";
import { useHref } from "react-router-dom";
import "../../App.css";
import TextFileViewer from "./fileViewer/TextFileViewer";
import ImageViewer from "./fileViewer/ImageViewer";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import PdfViewer from "./fileViewer/PdfViewer";
import MiscDocsViewer from "./fileViewer/MiscDocsViewer";
import GetTableColumnDefinitions from "./TableUtils";
import {
  updateProgress,
  subscribeProgress,
  unsubscribeProgress,
  cancelDownload,
} from "../universal/FileDownloader";
import { Line } from "rc-progress";
import { FaTimes } from "react-icons/fa";
import Mp4Viewer from "./fileViewer/Mp4Viewer";

//**********variable and class delarations**********/
const parser = new XMLParser();

//**********React component**********
const ResultsTable = ({ skip, setSkipTrue, setSkipFalse }) => {
  //**********State Variables**********
  const search = useSelector((state) => state.search.value);
  const delim = useSelector((state) => state.delim.value);
  const dispatch = useDispatch();
  const [response, setResponse] = useState([]);
  const [open, setOpen] = useState(false);
  const [img, setImg] = useState("");
  const [filePath, setFilePath] = useState();
  const [sortedData, setSortedData] = useState([]);
  const [showArrowLeft, setShowArrowLeft] = useState(true);
  const [showArrowRight, setShowArrowRight] = useState(true);
  const [sortOrder, setSortOrder] = useState("asc");
  const [scale, setScale] = useState(1);
  const [urls, setUrls] = useState([]);
  const [rowData, setRowData] = useState();
  const [selectionModel, setSelectionModel] = useState([]);
  const [divHeight, setDivHeight] = useState(window.innerHeight - 225);
  const granColumns = GetTableColumnDefinitions(search);
  const [progress, setProgress] = useState(0);
  const [rows, setRows] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  //**************Table Layout Functions*************** */

  const convertToList = (data) => {
    // XML parser may return a object on single occurence, this captures the edge case
    if (!Array.isArray(data)) {
      return [data];
    }
    return data;
  };
  const isFolder = (path) => {
    return path.endsWith("/");
  };

  //**********State Functions**********
  const processResp = (resp) => {
    //process the response from the api call into an array of objects
    //for use in the data grid
    const json = parser.parse(resp);
    var responseFolder;
    var responseObject;
    var processedResp = [];

    // console.log(json['ListBucketResult']['Prefix'])
    if (json["ListBucketResult"]["CommonPrefixes"]) {
      responseFolder = convertToList(
        json["ListBucketResult"]["CommonPrefixes"]
      );

      responseFolder.forEach((element) => {
        if (element["Prefix"] === json["ListBucketResult"]["Prefix"]) {
          // Ignore this folder, as it is the root folder
          processedResp.push({ Key: element["Prefix"] });
        } else if (isFolder(element["Prefix"])) {
          // console.log(element['Prefix'].split('/').reverse()[1])
          // console.log(folderName)
          processedResp.push({ Key: element["Prefix"] });
        } else {
          // console.log(element['Prefix'])
        }
      });
    }

    if (json["ListBucketResult"]["Contents"]) {
      // console.log('here')
      responseObject = convertToList(json["ListBucketResult"]["Contents"]);

      responseObject.forEach((element) => {
        // console.log(element['Key'])
        // processedResp.push({Key: element['Key'], Size: element['Size'], LastModified: element['LastModified']})
        if (element["Size"] === 0) {
          // Ignore this folder, as it is the root folder
          // console.log(element['Key'])
        } else if (isFolder(element["Key"])) {
          // console.log('folder')
          processedResp.push({ Key: element["Key"] });
        } else {
          // console.log('found')
          processedResp.push({
            Key: element["Key"],
            Size: element["Size"],
            LastModified: element["LastModified"],
          });
        }
      });
    }

    if (sortOrder === "asc") {
      setResponse(
        [...processedResp].sort((a, b) => a["Key"].localeCompare(b["Key"]))
      );

      setRows(
        [...processedResp].sort((a, b) => a["Key"].localeCompare(b["Key"]))
      );

      setSearchTerm('')
    } else {
      setResponse(
        [...processedResp]
          .sort((a, b) => a["Key"].localeCompare(b["Key"]))
          .reverse()
      );

      setRows(
        [...processedResp]
          .sort((a, b) => a["Key"].localeCompare(b["Key"]))
          .reverse()
      );
    }

    setSkipTrue();
  };

  useEffect(() => {
    const handleProgressUpdate = (value) => {
      setProgress(value);
    };

    subscribeProgress(handleProgressUpdate);

    return () => {
      unsubscribeProgress(handleProgressUpdate);
    };
  }, [progress]);

  const updateBrowserURL = (id) => {
    // Modify the URL
    var newUrl = "prepub/#" + id;
    // Change the URL without reloading the page
    window.history.pushState({ path: newUrl }, "", newUrl);
  };

  const handleCellDoubleClick = (rows) => {
    const currentImageIndex = response.findIndex(
      (row2) => row2.Key === rows.id
    );

    setShowArrowLeft(currentImageIndex !== 0);
    setShowArrowRight(currentImageIndex !== response.length - 1);

    let id = rows["id"];
    //To set the next image to original size
    setScale(1);
    // File preview
    setFilePath(`${config.cloudWatchUrlBase}${id}`, () => {
      setImg(id);
      setRowData(rows.row);
      setOpen(true);
    });

    // console.log('id: '+id);
    //handles double click of a columb and queries a file
    //if the double clicked columb is a file
    if (id.slice(-1) === "/") {
      // console.log(id.slice(-1));
      setSkipFalse();
      dispatch(setDelim("/"));
      dispatch(setSearch(id));
      dispatch(setCrumb(id));
    } else if (isImage(id)) {
      setImg(id);
      setRowData(rows.row);
      setOpen(true);
      // handleToggle()
    }
    updateBrowserURL(id);
  };

  const handleNavigationClick = (row, direction) => {
    const currentImageIndex = response.findIndex(
      (row2) => row2.Key === row.Key
    );
    const isLeftDirection = direction === "left";
    const isRightDirection = direction === "right";
    const isLeftEnd = currentImageIndex === 1 && isLeftDirection;
    const isRightEnd =
      currentImageIndex === response.length - 2 && isRightDirection;

    setShowArrowLeft(!isLeftEnd);
    setShowArrowRight(!isRightEnd);

    if (isLeftDirection && currentImageIndex > 0) {
      const id = response[currentImageIndex - 1].Key;
      setFilePath(`${config.cloudWatchUrlBase}${id}`);
      setRowData(response[currentImageIndex - 1]);
      setImg(id);
      updateBrowserURL(id);
      setOpen(true);
    } else if (isRightDirection && response.length > currentImageIndex + 1) {
      const id = response[currentImageIndex + 1].Key;
      setFilePath(`${config.cloudWatchUrlBase}${id}`);
      setRowData(response[currentImageIndex + 1]);
      setImg(id);
      updateBrowserURL(id);
      setOpen(true);
    }

    //To set the next image to original size
    setScale(1);
  };

  const handleClose = (rowData) => {
    let img = rowData.Key;
    //To set the next image to original size
    setScale(1);
    const desiredPath = img.substring(0, img.lastIndexOf("/") + 1);
    updateBrowserURL(desiredPath);
    setOpen(false);
    setImg("");
  };

  useEffect(()=>{
    const url = window.location.href
    if (url.indexOf(".") !== -1 && url.indexOf('#') !== -1){ //run only if '.' and '#' is present in the url
      const id = url.split("#")[1]
      const url_split = url.split(".")
      const url_last_element = url_split[url_split.length - 1]

      if(isImage(url_last_element)){ //only run if the extension is one of the ones list on the isImage.js file
        setFilePath(`${config.cloudWatchUrlBase}${id}`)
        setImg(id);
        setRowData(response[0]);
        setOpen(true);
      }
    }
  }, [response])

  //**********Api Logic**********
  const {
    data: resp,
    isSuccess,
    isError,
    error,
  } = useGetGranSearchQuery(
    { search, delim },
    { refetchOnMountOrArgChange: false, skip: skip }
  );

  useEffect(() => {
    //low level handling of api response
    if (isSuccess) {
      processResp(resp);
    } else if (isError) {
      if (error.includes("404")) {
        href("/404");
      }
    }
    // eslint-disable-next-line
  }, [resp]);

  const useMyHref = (to) => {
    useHref(to);
  };
  const href = useMyHref;

  //**********data table styling
  const ODD_OPACITY = 0.2;

  const checkFormat =
    isImage(img) === "jpeg" || isImage(img) === "png" || isImage(img) === "gif";
  const checkPdf = isImage(img) === "pdf";

  useEffect(() => {
    if (sortedData && sortedData.length > 0) {
      //setResponse(sortedData);
      setRows(sortedData)
    }
  }, [sortedData]);

  useEffect(() => {
    const handleResize = () => {
      setDivHeight(window.innerHeight - 225);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleSortModelChange = (model) => {
    if (model[0]) {
      const order = model[0].sort;
      let local = [...rows];
      if (order === "asc") {
        local.sort((a, b) => a["Key"].localeCompare(b["Key"]));
        setSortOrder("asc");
      } else {
        setSortOrder("desc");
        local.sort((a, b) => a["Key"].localeCompare(b["Key"])).reverse();
      }
      setSortedData(local);
    }
  };

  const isExist = (targetItem) => {
    if (targetItem)
      return urls.some(
        (item) => item.Key === targetItem.Key && item.Size === targetItem.Size
      );
  };

  useEffect(() => {
    const idArray = urls.map((row) => row.Key);
    setSelectionModel(idArray);
    dispatch(setSelectedList(urls));
  }, [urls]);

  const addFile = (row) => {
    if (!urls.includes(row)) setUrls([...urls, row]);
    else {
      const newArray = urls.filter((item) => item !== row);
      setUrls(newArray);
    }
  };

  const cancelDownloadCallback = useCallback(() => {
    cancelDownload();
  }, []);

  const fileUrl = `${config.cloudWatchUrlBase}${img}`;

  let ViewerComponent;

  if (checkFormat) {
    ViewerComponent = ImageViewer;
  } else if (checkPdf) {
    ViewerComponent = PdfViewer;
  } else if (isImage(img) === "text") {
    ViewerComponent = TextFileViewer;
  }else if(isImage(img) === "mp4" || isImage(img) === "mov"|| isImage(img) === "avi"){
    ViewerComponent = Mp4Viewer
  } else {
    ViewerComponent = MiscDocsViewer;
  }

  if (progress === 100) {
    updateProgress(0);
  }

  const handleSearch = (event) => {
    const value = event.target.value;
    setSearchTerm(value);

    const filteredRows = response.filter((row) =>
      row.Key.toLowerCase().includes(value.toLowerCase())
    );

    setRows(filteredRows);
  };

  granColumns[0].renderHeader = () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr' }}>
      <span style={{ fontWeight: 'bold' }}>Name</span>
      <span style={{ marginLeft: '15px' }}>
        <input
          type="text"
          placeholder="Search by Name"
          title="Search by Name"
          className={'search-input'}
          value={searchTerm}
          onChange={handleSearch}
          onClick={(e) => e.stopPropagation()}
        />
      </span>
    </div>
  )

  //**********jsx html**********
  return (
    <div style={{ height: `${divHeight}px`, width: "90%" }}>
      {progress !== 0 && (
        <div className="container">
          <div className="progress-container">
            <div className="progress-bar">
              <Line
                percent={progress}
                gapPosition={"top"}
                strokeWidth={1}
                strokeColor="#1976d2"
              />
            </div>
            <div>
              <button
                onClick={cancelDownloadCallback}
                className="cancel-button"
              >
                <FaTimes size={20} title="Cancel Download Zip" />
              </button>
            </div>
          </div>
          <div className="progress-text">
            Download Progress: {progress.toFixed(0)}%
          </div>
        </div>
      )}
      <DataGrid
        sx={{
          "& .MuiDataGrid-cell:hover": { cursor: "pointer" },
          [`& .${gridClasses.row}.even`]: {
            backgroundColor: "#e3e3e3",
            "&:hover, &.Mui-hovered": {
              backgroundColor: alpha("#c1d5f7", ODD_OPACITY),
            },
            "&.Mui-selected": {
              backgroundColor: alpha("#7ca7f7", ODD_OPACITY),
              "&:hover, &.Mui-hovered": {
                backgroundColor: alpha("#c1d5f7", ODD_OPACITY),
              },
            },
          },
          borderRadius: 2,
        }}
        rows={rows}
        columns={granColumns}
        disableColumnMenu={true}
        rowsPerPageOptions={[10, 25, 50, 100]}
        checkboxSelection={true}
        disableSelectionOnClick
        getRowId={(row) => row.Key}
        selectionModel={selectionModel}
        onSelectionModelChange={(id) => {
          // eslint-disable-next-line
          {
            /*handles the selction of rows*/
          }
          const selectedIDs = new Set(id);
          const selectedRowData = response.filter((row) =>
            selectedIDs.has(row.Key)
          );
          //setSelectionModel(array)
          setUrls(selectedRowData);
          dispatch(setSelectedList(selectedRowData));
        }}
        onRowClick={(row) => {
          handleCellDoubleClick(row);
        }}
        // onCellClick   onCellDoubleClick  onRowClick
        getRowClassName={(params) =>
          params.indexRelativeToCurrentPage % 2 === 0 ? "even" : "odd"
        }
        onSortModelChange={handleSortModelChange}
      />

      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={open}
      >
        <ViewerComponent
          handleNavigationClick={handleNavigationClick}
          addFile={addFile}
          isExist={isExist}
          handleClose={handleClose}
          fileUrl={fileUrl}
          urls={urls}
          rowData={rowData}
          img={img}
          response={response}
          filePath={filePath}
          setProgress={setProgress}
          showArrowRight={showArrowRight}
          showArrowLeft={showArrowLeft}
        />
      </Backdrop>
    </div>
  );
};

//**********React component return**********
export default ResultsTable;
