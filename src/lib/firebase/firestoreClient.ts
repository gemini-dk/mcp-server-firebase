import { Query, Timestamp } from 'firebase-admin/firestore';
import {db, getProjectId} from './firebaseConfig';
import fs from 'fs';
import path from 'path';

export async function list_collections(documentPath?: string, limit: number = 20, pageToken?: string) {
  try {
    let collections;
    if (documentPath) {
      const docRef = db.doc(documentPath);
      collections = await docRef.listCollections();
    } else {
      collections = await db.listCollections();
    }
    
    // Sort collections by name
    collections.sort((a, b) => a.id.localeCompare(b.id));
    
    // Find start index
    const startIndex = pageToken ? collections.findIndex(c => c.id === pageToken) + 1 : 0;
    
    // Apply limit
    const paginatedCollections = collections.slice(startIndex, startIndex + limit);
    
    const projectId = getProjectId();
    const collectionData = paginatedCollections.map((collection) => {
      const collectionUrl = `https://console.firebase.google.com/project/${projectId}/firestore/data/${documentPath}/${collection.id}`;
      return { name: collection.id, url: collectionUrl };
    });
    
    return { 
      content: [{
        type: 'text', 
        text: JSON.stringify({
          collections: collectionData,
          nextPageToken: collections.length > startIndex + limit ? 
            paginatedCollections[paginatedCollections.length - 1].id : null,
          hasMore: collections.length > startIndex + limit
        })
      }]
    };
  } catch (error) {
    return { content: [{ type: 'text', text: `Error listing collections: ${(error as Error).message}` }], isError: true };
  }
}

function convertTimestampsToISO(data: any) {
  for (const key in data) {
    if (data[key] instanceof Timestamp) {
      data[key] = data[key].toDate().toISOString();
    }
  }
  return data;
}


export async function listDocuments(collection: string, filters: Array<{ field: string, operator: FirebaseFirestore.WhereFilterOp, value: any }> = [], limit: number = 20, pageToken?: string) {
  const projectId = getProjectId();
  try {
    const collectionRef = db.collection(collection);
    let filteredQuery: Query = collectionRef;
    for (const filter of filters) {
      let filterValue = filter.value;
      if (typeof filterValue === 'string' && !isNaN(Date.parse(filterValue))) {
        filterValue = Timestamp.fromDate(new Date(filterValue));
      }
      filteredQuery = filteredQuery.where(filter.field, filter.operator, filterValue);
    }
    
    // Apply pageToken if provided
    if (pageToken) {
      const startAfterDoc = await collectionRef.doc(pageToken).get();
      filteredQuery = filteredQuery.startAfter(startAfterDoc);
    }

    // Get total count of documents matching the filter
    const countSnapshot = await filteredQuery.get();
    const totalCount = countSnapshot.size;

    // Get the first 'limit' documents
    const limitedQuery = filteredQuery.limit(limit);
    const snapshot = await limitedQuery.get();

    if (snapshot.empty) {
      return { content: [{ type: 'text', text: 'No matching documents found' }], isError: true };
    }
    
    const documents = snapshot.docs.map((doc: any) => {
      const data = doc.data();
      convertTimestampsToISO(data);
      const consoleUrl = `https://console.firebase.google.com/project/${projectId}/firestore/data/${collection}/${doc.id}`;
      return { id: doc.id, url: consoleUrl, document: data };
    });
    
    return { 
      content: [{
        type: 'text', 
        text: JSON.stringify({
          totalCount,
          documents,
          pageToken: documents.length > 0 ? documents[documents.length - 1].id : null,
          hasMore: totalCount > limit
        })
      }]
    };
  } catch (error) {
    return { content: [{ type: 'text', text: `Error listing documents: ${(error as Error).message}` }], isError: true };
  }
}

export async function addDocument(collection: string, data: any) {
  try {
    const docRef = await db.collection(collection).add(data);
    const projectId = getProjectId();
    convertTimestampsToISO(data);
    const consoleUrl = `https://console.firebase.google.com/project/${projectId}/firestore/data/${collection}/${docRef.id}`;
    return { content: [{ type: 'text', text: JSON.stringify({ id: docRef.id, url: consoleUrl, document: data }) }] };
  } catch (error) {
    return { content: [{ type: 'text', text: `Error adding document: ${(error as Error).message}` }], isError: true };
  }
}

export async function getDocument(collection: string, id: string) {
  try {
    const doc = await db.collection(collection).doc(id).get();
    if (!doc.exists) {
      return { content: [{ type: 'text', text: 'Document not found' }], isError: true };
    }
    const projectId = getProjectId();
    const data = doc.data();
    convertTimestampsToISO(data);
    const consoleUrl = `https://console.firebase.google.com/project/${projectId}/firestore/data/${collection}/${id}`;
    return { content: [{ type: 'text', text: JSON.stringify({ id, url: consoleUrl, document: data }) }] };
  } catch (error) {
    return { content: [{ type: 'text', text: `Error getting document: ${(error as Error).message}` }], isError: true };
  }
}

export async function updateDocument(collection: string, id: string, data: any) {
  try {
    await db.collection(collection).doc(id).update(data);
    const projectId = getProjectId();
    convertTimestampsToISO(data);
    const consoleUrl = `https://console.firebase.google.com/project/${projectId}/firestore/data/${collection}/${id}`;
    return { content: [{ type: 'text', text: JSON.stringify({ id, url: consoleUrl, document: data }) }] };
  } catch (error) {
    return { content: [{ type: 'text', text: `Error updating document: ${(error as Error).message}` }], isError: true };
  }
}

export async function deleteDocument(collection: string, id: string) {
  try {
    await db.collection(collection).doc(id).delete();
    return { content: [{ type: 'text', text: 'Document deleted successfully' }] };
  } catch (error) {
    return { content: [{ type: 'text', text: `Error deleting document: ${(error as Error).message}` }], isError: true };
  }
}
