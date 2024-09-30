# GHRC-Prepublication
**GHRC Prepublication** is a web-based application for seamless access to unauthenticated BROWSE images and supporting documents related to NASA datasets. The application provides functionalities like image and document downloads, multi-select capability, printing options, and an interactive viewer equipped with search functionality.

## Setup Instructions

To set up the **GHRC Prepublication** application locally, follow these steps:

1. **Clone the Repository:**
   Open a terminal and run the following command to clone the repository:
   ```
   git clone https://github.com/ghrcdaac/prepublication.git
   ```

2. **Navigate to the Project Directory:**
   After cloning the repository, navigate to the project folder:
   ```
   cd prepublication
   ```

3. **Install Dependencies:**
   Ensure you have Node.js installed on your system. Then, run the following command to install the necessary dependencies:
   ```
   npm install
   ```

4. **Run the Application:**
   After installing the dependencies, you can run the application locally with the following command:
   ```
   npm start
   ```

5. **Access the Application:**
   Open your browser and navigate to `http://localhost:3000` to view the application running locally.

## Features

- **Search Functionality**: Quickly find specific datasets using the search bar on the home page.
- **Directory Navigation**: Organized directory structure for easy browsing:
  - `Dataset_version_name -> Browse -> Files`
  - `Dataset_version_name -> Docs -> Files`
- **File Operations**: Users can:
  - Download multiple images or documents.
  - Access URLs for selected files.
  - View images and documents directly within the application.
  - Print files or download them for offline use.

## Application Overview

### Home Page
The homepage displays the available datasets, a search bar, and navigation tools. Users can select datasets to view corresponding images or documentation.

### Browse Directory
The `browse` directory contains all images related to a dataset. Users can:
- View image details (name, type, modified date, and size).
- Select and download files.
- Access URLs for images (source URLs for citation and dashboard URLs to view within the app).
  
### Docs Directory
The `docs` directory contains user guides, information notes, and documentation related to the dataset. Similar to the `browse` directory, users can:
- View, print, and download files.
- Use navigation tools to explore the content.

### Image and Document Viewing
Images and documents can be viewed in a dedicated window with the following tools:
- **Zoom In/Out**: Adjust the view of images and documents.
- **Navigation Arrows**: View the next or previous file.
- **Download & Print**: Options to download or print the viewed file.

## Usage Instructions

1. Select a dataset from the homepage.
2. Browse images in the `browse` directory or documentation in the `docs` directory.
3. Select files individually or in bulk.
4. Use the buttons provided to download, print, or access URLs.

## Technology Stack

- **Frontend**: ReactJS
- **Backend**: S3 List API for structured directory management.

## Access

The application can be accessed at:  
[GHRC Cloud Browse](https://ghrc.earthdata.nasa.gov/prepub)

## License

This project is licensed under the Apache License 2.0.
