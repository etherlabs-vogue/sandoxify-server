


## Functions

### Create a Pod

- **Endpoint:** `POST /api/pods`
- **Description:** Creates a new pod in the Kubernetes cluster.
- **Request Body:**
  ```json
  {
    "name": "my-pod",
    "image": "my-image"
  }
  ```
- **Response:**
  - Status: 201
  - Body: The created pod object.

### Delete a Pod

- **Endpoint:** `DELETE /api/pods/:name`
- **Description:** Deletes the specified pod from the Kubernetes cluster.
- **Parameters:**
  - `name`: Name of the pod to delete.
- **Response:**
  - Status: 200
  - Body: A success message.

### Create a Namespace

- **Endpoint:** `POST /api/namespaces`
- **Description:** Creates a new namespace in the Kubernetes cluster.
- **Request Body:**
  ```json
  {
    "name": "my-namespace"
  }
  ```
- **Response:**
  - Status: 201
  - Body: The created namespace object.

### Delete a Namespace

- **Endpoint:** `DELETE /api/namespaces/:name`
- **Description:** Deletes the specified namespace from the Kubernetes cluster.
- **Parameters:**
  - `name`: Name of the namespace to delete.
- **Response:**
  - Status: 200
  - Body: A success message.

### Get Namespace Information

- **Endpoint:** `GET /api/namespaces/:name`
- **Description:** Retrieves information about the specified namespace.
- **Parameters:**
  - `name`: Name of the namespace.
- **Response:**
  - Status: 200
  - Body: The namespace information.

### Create a Deployment in a Namespace

- **Endpoint:** `POST /api/namespace/:name/deployment`
- **Description:** Creates a new deployment in the specified namespace.
- **Parameters:**
  - `name`: Name of the namespace to create the deployment in.
- **Request Body:**
  ```json
  {
    "name": "my-deployment",
    "image": "my-image"
  }
  ```
- **Response:**
  - Status: 200
  - Body: A success message.

### Delete a Deployment in a Namespace

- **Endpoint:** `DELETE /api/namespace/:namespace/deployment/:deployment`
- **Description:** Deletes the specified deployment from the specified namespace.
- **Parameters:**
  - `namespace`: Name of the namespace.
  - `deployment`: Name of the deployment to delete.
- **Response:**
  - Status: 200
  - Body: A success message.

### Create Lab for Object Storage

- **Endpoint:**

 `POST /api/labs/objectstoage`
- **Description:** Creates a lab deployment for object storage.
- **Request Body:**
  ```json
  {
    "accessKey": "my-access-key",
    "secretKey": "my-secret-key",
    "namespaceName": "my-namespace"
  }
  ```
- **Response:**
  - Status: 200
  - Body: A success message.




 fs.rm("./tempfile.yaml", { recursive: true }, (err) => { 
      if (err) { 
        console.error(err);
      } 
      else { 
        console.log("Non Recursive: Directory Deleted!"); 
      } 
    })