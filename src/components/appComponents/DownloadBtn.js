import config from "../../config";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { useState, useEffect } from "react";
import LinearProgress from "@mui/material/LinearProgress"; 
import { Button, Menu, MenuItem } from "@mui/material"; 
import { MoonLoader } from "react-spinners";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux"; // Assuming you're using Redux for selectedList

const DownloadBtn = ({ setShow, setfilesCount }) => {
  const selectedList = useSelector((state) => state.selectedList.value); // Assuming selectedList is from Redux
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);


  const handleClick2 = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleShowToast = (flag) => {
    let text = flag ? "Files not zipped!" : "Files are zipped!";
    toast.info(text, {
      position: "bottom-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      style: {
        fontWeight: "bold",
      },
    });
  };

  const handleClick = async (flag) => {
    setIsLoading(true);
    setProgress(0);
    setDownloadProgress(0);

    const validSelectedList = selectedList.filter((file) => file && file.Key);

    if (validSelectedList.length === 0) {
      console.error("No valid files found for download.");
      setIsLoading(false);
      setProgress(0);
      return;
    }

    if (flag) {
      // Individual file download using config.sourceIMGUrl
      validSelectedList.forEach((file) => {
        const filePath = file.Key || "";
        const fileUrl = `${config.sourceIMGUrl.replace(/\/$/, "")}/${filePath.replace(/^\//, "")}`;
        window.open(fileUrl, "_blank");
      });
    } else {
      // Zip download using config.cloudWatchUrlBase
      const zip = new JSZip();

      for (let i = 0; i < validSelectedList.length; i++) {
        const file = validSelectedList[i];
        const filePath = file.Key || "";
        const fileUrl = `${config.cloudWatchUrlBase.replace(/\/$/, "")}/${filePath.replace(/^\//, "")}`;

        try {
          const response = await fetch(fileUrl, { credentials: "include" });

          if (!response.ok) {
            console.error(`Failed to fetch file: ${fileUrl} - Status: ${response.status}`);
            continue;
          }

          const blob = await response.blob();
          const fileName = filePath.split("/").pop();

          // Add the file to the zip
          zip.file(fileName, blob);

          // Update progress after each file is added to the zip
          const progress = Math.round(((i + 1) / validSelectedList.length) * 100);
          setDownloadProgress(progress);
        } catch (error) {
          console.error(`Error fetching file ${fileUrl}:`, error);
        }
      }

      if (Object.keys(zip.files).length > 0) {
        zip.generateAsync({ type: "blob" }).then((zipBlob) => {
          saveAs(zipBlob, "GHRC-prepub-data.zip");
        });
      } else {
        console.error("No files were added to the zip archive.");
        alert("Failed to add files to the zip archive. Check if the files are accessible.");
      }
    }

    setIsLoading(false);
    setProgress(0);
    handleShowToast(flag);
    handleClose();
  };

  return (
    <div>
          {isLoading && (
      <div className="loading-container">
        <MoonLoader color="#1976d2" size={50} />

      </div>
    )}

      <div>
        <Button
          variant="outlined"
          sx={{ ml: 13, borderRadius: 2 }}
          onClick={handleClick2}
          disabled={selectedList.length === 0}
        >
          DOWNLOAD
        </Button>
        <Menu
          id="dropdown-menu"
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <MenuItem onClick={() => handleClick(false)} disabled={isLoading}>
            Download as Zip
          </MenuItem>
          <MenuItem onClick={() => handleClick(true)} disabled={isLoading}>
            Download Files
          </MenuItem>
        </Menu>
      </div>
      <ToastContainer />
    </div>
  );
  
  
};

export default DownloadBtn;
