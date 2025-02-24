import { admin, getProjectId } from './firebaseConfig';

//const storage = admin.storage().bucket();

/**
 * List files in a given path in Firebase Storage.
 * @param {string} [path] - The optional path to list files from. If not provided, the root is used.
 * @returns {Promise<{ content: { type: string , text: string }[] }>} - A promise that resolves to an object containing file names.
 */
export async function listDirectoryFiles(path?: string, pageSize: number = 10, pageToken?: string): Promise<{ content: { type: string , text: string }[] }> {
  const prefix = path ? (path === '' ? '' : (path.endsWith('/') ? path : `${path}/`)) : '';
  const [files, , apiResponse] = await admin.storage().bucket().getFiles({ 
    prefix, 
    delimiter: '/', 
    maxResults: pageSize,
    pageToken
  });
  const nextPageToken = apiResponse.nextPageToken as string || undefined;

  const fileNames = await Promise.all(files.map(async (file) => {
    const [signedUrl] = await file.getSignedUrl({
      action: 'read',
      expires: Date.now() + 1000 * 60 * 60 // 1 hour
    });
    return { type: "file", name: file.name, downloadURL: signedUrl };
  }));

  const projectId = getProjectId();
  const bucketName = admin.storage().bucket().name;
  const directoryNames = (apiResponse.prefixes || []).map((prefix:string) => {    
    //const encodedPrefix = encodeURIComponent(prefix).replace(/'/g, '%27').replace(/%20/g, '+');
    const tmpPrefix = prefix.replace(/\/$/, '');
    const encodedPrefix = `~2F${tmpPrefix.replace(/\//g, '~2F')}`;
    const consoleUrl = `https://console.firebase.google.com/project/${projectId}/storage/${bucketName}/files/${encodedPrefix}`;
    return { type: "directory", name: prefix, url: consoleUrl };
  });

    const result = { 
      nextPageToken: nextPageToken, 
      files: [...fileNames, ...directoryNames],
      hasMore: nextPageToken !== undefined
    };
  return {
    content:[
      {
        type: "text",
        text: JSON.stringify(result,null,2)
      }
    ]
  }
}

/**
 * Get file information including metadata and download URL.
 * @param {string} filePath - The path of the file to get information for.
 * @returns {Promise<{ content: object }>} - A promise that resolves to an object containing file metadata and download URL.
 */
export async function getFileInfo(filePath: string): Promise<{ content: { type: string , text: string }[] }> {
  const file = admin.storage().bucket().file(filePath);
  const [metadata] = await file.getMetadata();
  const [url] = await file.getSignedUrl({
    action: 'read',
    expires: Date.now() + 1000 * 60 * 60 // 1 hour
  });
  const result = { metadata, downloadUrl:url };
  return {
    content: [
      { type:'text', text: JSON.stringify(result,null,2) }
    ]
  };
}
