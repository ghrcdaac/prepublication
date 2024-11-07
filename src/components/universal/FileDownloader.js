import config from "../../config";
import { useState, useEffect } from "react";

let cancelFlag = false;

export const cancelDownload = () => {
  cancelFlag = true;
};

// progress.js
let progress = 0;
let subscribers = [];

export const updateProgress = (value) => {
  progress = value;
  subscribers.forEach((subscriber) => subscriber(progress));
};

export const subscribeProgress = (callback) => {
  subscribers.push(callback);
};

export const unsubscribeProgress = (callback) => {
  subscribers = subscribers.filter((subscriber) => subscriber !== callback);
};

export const getProgress = () => {
  return progress;
};

export const useProgress = () => {
  const [progressValue, setProgressValue] = useState(getProgress());

  const handleProgressUpdate = (value) => {
    setProgressValue(value);
  };

  useEffect(() => {
    subscribeProgress(handleProgressUpdate);
    return () => {
      unsubscribeProgress(handleProgressUpdate);
    };
  }, []);

  return progressValue;
};

// Function to open each link in a new tab
const openLinksInNewTabs = (linkList) => {
  let delay = 0;

  // Open each link in a new tab with a slight delay between them to avoid blocking
  linkList.forEach((link) => {
    if (link && link.Key) {
      const url = `${config.sourceIMGUrl}${link.Key}`;
      
      setTimeout(() => {
        window.open(url, '_blank');
      }, delay);
      
      delay += 1000; // Increase delay for each link to avoid opening too many tabs at once
    }
  });
};

// Main function to handle download on button click
const downloader = (linkList, setShow, setProgress) => {
  if (cancelFlag) {
    updateProgress(100);
    setProgress(100);
    return;
  }

  if (linkList && linkList.length > 0) {
    openLinksInNewTabs(linkList);
  } else {
    console.log("No files to download.");
    if (typeof setShow === "function") setShow(true);
  }
};

// Single file download function for backward compatibility
export const downloadFile = (fileUrl) => {
  // Open a single link in a new tab
  window.open(fileUrl, '_blank');
};

export default downloader;





// import config from "../../config";
// import { saveAs } from "file-saver";
// import JSZip from "jszip";
// import { useState, useEffect } from "react";

// let cancelFlag = false;

// export const cancelDownload = () => {
//   cancelFlag = true;
// };

// // progress.js
// let progress = 0;
// let subscribers = [];

// export const updateProgress = (value) => {
//   progress = value;
//   subscribers.forEach((subscriber) => subscriber(progress));
// };

// export const subscribeProgress = (callback) => {
//   subscribers.push(callback);
// };

// export const unsubscribeProgress = (callback) => {
//   subscribers = subscribers.filter((subscriber) => subscriber !== callback);
// };

// export const getProgress = () => {
//   return progress;
// };

// export const useProgress = () => {
//   const [progressValue, setProgressValue] = useState(getProgress());

//   const handleProgressUpdate = (value) => {
//     setProgressValue(value);
//   };

//   useEffect(() => {
//     subscribeProgress(handleProgressUpdate);
//     return () => {
//       unsubscribeProgress(handleProgressUpdate);
//     };
//   }, []);

//   return progressValue;
// };

// // Function to download file with handling for login redirects
// const fetchFileWithLoginHandling = async (url) => {
//   const cacheBuster = new Date().getTime() + Math.random();
//   const response = await fetch(`${url}?cache=${cacheBuster}`, {
//     method: 'GET',
//     credentials: 'include' // Ensure cookies are included for login sessions
//   });

//   // Check if the response was redirected to a login page
//   if (response.redirected) {
//     // Open the login page in a new tab
//     const loginWindow = window.open(response.url, '_blank');
//     await new Promise((resolve) => {
//       const checkLogin = setInterval(() => {
//         if (loginWindow.closed) {
//           clearInterval(checkLogin);
//           resolve();
//         }
//       }, 1000);
//     });

//     // Retry fetching the file after login
//     return await fetch(`${url}?cache=${cacheBuster}`, { credentials: 'include' });
//   }

//   return response;
// };

// const downloader = async (linkList, setShow, setProgress, zipFlag) => {
//   try {
//     const zip = new JSZip();
//     const maxFileSizeToZip = 200;
//     let counter = 1;

//     for (const link of linkList) {
//       if (cancelFlag) {
//         updateProgress(100);
//         setProgress(100);
//         break;
//       }

//       if (link && link.Size) {
//         const url = `${config.sourceIMGUrl}${link["Key"]}`;
//         try {
//           const res = await fetchFileWithLoginHandling(url);

//           if (!res.ok) {
//             console.error("Error fetching file:", res.statusText);
//             continue;
//           }

//           const blob = await res.blob();
//           const fileSizeMB = blob.size / (1024 * 1024);
//           const fileName = link["Key"].split("/").pop();

//           const counterValue = (counter / linkList.length) * 100;
//           if (typeof setProgress === "function") {
//             updateProgress(counterValue);
//             setProgress(counterValue);
//           }
//           counter += 1;

//           if (fileSizeMB <= maxFileSizeToZip && !zipFlag) {
//             zip.file(fileName, blob);
//           } else {
//             saveAs(blob, fileName);
//           }
//         } catch (error) {
//           console.error("Error downloading file:", error);
//         }
//       } else {
//         if (typeof setShow === "function") setShow(true);
//       }
//     }

//     if (Object.keys(zip.files).length > 0) {
//       const zipBlob = await zip.generateAsync({ type: "blob" });
//       const zipFileName = linkList[0] && linkList[0].Key
//         ? linkList[0].Key.split('/')[1] + '_' + linkList[0].Key.split('/')[2] + '.zip'
//         : 'download.zip';
//       saveAs(zipBlob, zipFileName);
//       updateProgress(100);
//     } else {
//       console.log("No files to download.");
//     }
//   } catch (error) {
//     console.error("Error during download:", error);
//   } finally {
//     cancelFlag = false;
//   }
// };

// export const downloadFile = async (fileUrl) => {
//   try {
//     const res = await fetchFileWithLoginHandling(fileUrl);
//     const blob = await res.blob();
//     const fileName = fileUrl.split("/").pop();
//     saveAs(blob, fileName);
//   } catch (error) {
//     console.error("Error downloading file:", error);
//   }
// };

// export default downloader;
