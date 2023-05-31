"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const client_node_1 = require("@kubernetes/client-node");
const differenceInDays_1 = __importDefault(require("date-fns/differenceInDays"));
const app = (0, express_1.default)();
const port = 2000;
// Body parser middleware
app.use(express_1.default.json());
// Load the Kubernetes configuration
const kubeConfig = new client_node_1.KubeConfig();
kubeConfig.loadFromDefault();
// Create the Kubernetes API client
const coreV1Api = kubeConfig.makeApiClient(client_node_1.CoreV1Api);
// API endpoint to create a pod
app.post('/api/pods', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Extract pod details from the request body
        const { name, image } = req.body;
        // Define the pod manifest
        const podManifest = {
            apiVersion: 'v1',
            kind: 'Pod',
            metadata: {
                name,
            },
            spec: {
                containers: [
                    {
                        name: 'my-container',
                        image,
                    },
                ],
            },
        };
        // Create the pod
        const createPodResponse = yield coreV1Api.createNamespacedPod('default', podManifest);
        // Return the created pod
        res.status(201).json(createPodResponse.body);
    }
    catch (err) {
        console.error('Error creating pod:', err);
        res.status(500).json({ error: 'Failed to create pod' });
    }
}));
app.delete('/api/pods/:name', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const podName = req.params.name;
        // Delete the pod
        const deletePodResponse = yield coreV1Api.deleteNamespacedPod(podName, 'default');
        // Return success message
        res.status(200).json({ message: `Pod '${podName}' deleted successfully` });
    }
    catch (err) {
        console.error('Error deleting pod:', err);
        res.status(500).json({ error: 'Failed to delete pod' });
    }
}));
app.post('/api/namespaces', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name } = req.body;
        // Define the namespace manifest
        const namespaceManifest = {
            apiVersion: 'v1',
            kind: 'Namespace',
            metadata: {
                name,
            },
        };
        // Create the namespace
        const createNamespaceResponse = yield coreV1Api.createNamespace(namespaceManifest);
        console.log(req.body);
        // Return the created namespace
        res.status(201).json(createNamespaceResponse.body);
    }
    catch (err) {
        console.error('Error creating namespace:', err);
        res.status(500).json({ error: 'Failed to create namespace' });
    }
}));
// API endpoint to delete a namespace
app.delete('/api/namespaces/:name', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const namespaceName = req.params.name;
        // Delete the namespace
        const deleteNamespaceResponse = yield coreV1Api.deleteNamespace(namespaceName);
        // Return success message
        res.status(200).json({ message: `Namespace '${namespaceName}' deleted successfully` });
    }
    catch (err) {
        console.error('Error deleting namespace:', err);
        res.status(500).json({ error: 'Failed to delete namespace' });
    }
}));
app.get('/api/namespaces/:name', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const namespaceName = req.params.name;
        // Retrieve namespace information
        const getNamespaceResponse = yield coreV1Api.readNamespace(namespaceName);
        // Return the namespace information
        res.status(200).json(getNamespaceResponse.body);
        const now = Date.now();
        const date = (_a = getNamespaceResponse.body.metadata) === null || _a === void 0 ? void 0 : _a.creationTimestamp;
        const upTime = date && (0, differenceInDays_1.default)(now, date);
        console.log(upTime);
    }
    catch (err) {
        console.error('Error retrieving namespace information:', err);
        res.status(500).json({ error: 'Failed to retrieve namespace information' });
    }
}));
// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
