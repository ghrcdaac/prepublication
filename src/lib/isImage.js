

export const isImage = (gran) =>{
    // console.log('gran.split(\'.\').pop()',gran.split('.').pop())
    switch (gran.split('.').pop()) {
        case 'jpg':
            return 'jpeg'
        case 'jfif':
            return 'jpeg'    
        case 'png':
            return 'png'
        case 'gif':
            return 'gif'
        case 'pdf':
            return 'pdf'
        case 'tif':
            return 'tiff'
        case 'txt':
            return 'text'
        case 'json':
            return 'json'
        case 'doc':
            return 'doc'
        case 'nc':
            return 'nc'
        case 'tar':
            return 'tar'
        case 'gz':
            return 'gz'
        case 'ps':
            return 'ps'
        case 'md5':
            return 'md5'
        case 'tgz':
            return 'tgz'
        case 'mp4':
            return 'mp4'
        case 'mov':
            return 'mov'
        case 'avi':
            return 'avi'
        default:
            return false
    }

}
