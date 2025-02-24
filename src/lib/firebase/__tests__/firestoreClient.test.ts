import { listDocuments, addDocument, getDocument, updateDocument, deleteDocument, list_collections } from '../firestoreClient';

describe('Firebase Client', () => {
  const collectionName = '';
  const documentId = 'testid';


//  it('should add a document', async () => {
//    const result = await addDocument(collectionName, documentData);
//    console.log(result.content[0].text);
//  });

  it('should list collections', async () => {
    const result = await list_collections();
    console.log(result.content[0].text);
  });

  it('should list documents', async () => {
    const date = new Date('2025-02-20T00:00:00.000Z');
    const jstDate = new Date(date.toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' }));
    const result = await listDocuments(collectionName, [{ field: 'lastAccessTime', operator: '>=', value: jstDate.toISOString() }]);
    const jsonData = JSON.parse(result.content[0].text);
    const logobj:{totalCount:number,documents:{id:string,url:string}[]} = {totalCount:0,documents:[]};
    logobj.totalCount = jsonData.totalCount;
    for(const doc of jsonData.documents) {
        logobj.documents.push({id:doc.id,url:doc.url});
    }
    console.log(logobj);
  });

  it('should get a document', async () => {
    const result = await getDocument(collectionName, documentId);
    console.log(result.content[0].text);
  });

//  it('should update a document', async () => {
//    const updatedData = { field1: 'updatedValue' };
//    const result = await updateDocument(collectionName, documentId, updatedData);
//    console.log(result.content[0].text);
//  });
//
//  it('should delete a document', async () => {
//    const result = await deleteDocument(collectionName, documentId);
//    console.log(result.content[0].text);
//  });
});
