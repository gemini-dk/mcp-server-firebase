import { listDirectoryFiles, getFileInfo } from '../storageClient';

const testPath = '';
const testFilePath = 'testpath';

describe('listFiles', () => {
  it('should return a list of files in the specified path', async () => {
    const result = await listDirectoryFiles(testPath);
    console.log(result);
  });
});

describe('getFileInfo', () => {
  it('should return file metadata and download URL for the specified file', async () => {
    const result = await getFileInfo(testFilePath);
    console.log(result);
  });
});
