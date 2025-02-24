# Firebase MCP Server

## Overview
This is a Firebase MCP (Model Context Protocol) server that provides a unified interface to interact with various Firebase services including Authentication, Firestore, and Storage.

## Setup
1. Clone and build the project:
   ```bash
   git clone https://github.com/gemini-dk/mcp-server-firebase
   cd mcp-server-firebase
   npm install
   npm run build
   ```

2. Get Firebase service account key:
   - Go to Firebase Console > Project Settings > Service accounts
   - Click "Generate new private key"
   - Save the JSON file to your project directory

3. Configure `mcp_settings.json`:
   ```json
   {
     "firebase-mcp": {
       "command": "node",
       "args": [
         "/path/to/mcp-server-firebase/dist/index.js"
       ],
       "env": {
         "SERVICE_ACCOUNT_KEY_PATH": "/path/to/serviceAccountKey.json"
       }
     }
   }
   ```
   Replace `/path/to/mcp-server-firebase` with the actual path where you cloned the repository.
   Replace `/path/to/serviceAccountKey.json` with the path to your service account key file.

## Available APIs
### Authentication
- Get user by ID or email

### Firestore
- Add/update/delete documents
- List collections/documents

### Storage
- List files in a directory
- Get File metadata and Download URL

## License
- MIT License
