import express, { Request, Response, response } from 'express';
import { KubeConfig, CoreV1Api, V1Pod, V1ObjectMeta, V1Container , V1Deployment ,V1Namespace, AppsV1Api} from '@kubernetes/client-node';
import differenceInDays from "date-fns/differenceInDays";
import yaml from 'js-yaml';
import * as fs from 'fs'

const app = express();
const port = 2000;



// Body parser middleware
app.use(express.json());

// Load the Kubernetes configuration
const kubeConfig = new KubeConfig();
kubeConfig.loadFromDefault();
// Create the Kubernetes API client
const appsV1Api = kubeConfig.makeApiClient(AppsV1Api)
const coreV1Api = kubeConfig.makeApiClient(CoreV1Api);

// API endpoint to create a pod
app.post('/api/pods', async (req: Request, res: Response) => {
  try {
    // Extract pod details from the request body
    const { name, image } = req.body;

    // Define the pod manifest
    const podManifest: V1Pod = {
      apiVersion: 'v1',
      kind: 'Pod',
      metadata: {
        name,
      } as V1ObjectMeta,
      spec: {
        
        containers: [
          {
            name: 'my-container',
            image,
          } as V1Container,
        ],
      },
    };

    // Create the pod
    const createPodResponse = await coreV1Api.createNamespacedPod('default', podManifest);

    // Return the created pod
    res.status(201).json(createPodResponse.body);
  } catch (err) {
    console.error('Error creating pod:', err);
    res.status(500).json({ error: 'Failed to create pod' });
  }
});

app.delete('/api/pods/:name', async (req: Request, res: Response) => {
    try {
      const podName = req.params.name;
  
      // Delete the pod
      const deletePodResponse = await coreV1Api.deleteNamespacedPod(podName, 'default');
  
      // Return success message
      res.status(200).json({ message: `Pod '${podName}' deleted successfully` });
    } catch (err) {
      console.error('Error deleting pod:', err);
      res.status(500).json({ error: 'Failed to delete pod' });
    }
  });

app.post('/api/namespaces', async (req: Request, res: Response) => {
try {
    const { name } = req.body;

    // Define the namespace manifest
    const namespaceManifest: V1Namespace = {
    apiVersion: 'v1',
    kind: 'Namespace',
    metadata: {
        name,
    },
    };

    // Create the namespace
    const createNamespaceResponse = await coreV1Api.createNamespace(namespaceManifest);
    console.log(req.body)
    // Return the created namespace
    res.status(201).json(createNamespaceResponse.body);
} catch (err) {
    console.error('Error creating namespace:', err);
    res.status(500).json({ error: 'Failed to create namespace' });
}
});
// API endpoint to delete a namespace
app.delete('/api/namespaces/:name', async (req: Request, res: Response) => {
try {
    const namespaceName = req.params.name;

    // Delete the namespace
    const deleteNamespaceResponse = await coreV1Api.deleteNamespace(namespaceName);

    // Return success message
    res.status(200).json({ message: `Namespace '${namespaceName}' deleted successfully` });
} catch (err) {
    console.error('Error deleting namespace:', err);
    res.status(500).json({ error: 'Failed to delete namespace' });
}
});

app.get('/api/namespaces/:name', async (req: Request, res: Response) => {
    try {
      const namespaceName = req.params.name;
      // Retrieve namespace information
      const getNamespaceResponse = await coreV1Api.readNamespace(namespaceName); 
      // Return the namespace information
      res.status(200).json(getNamespaceResponse.body);
      const now =  Date.now() 
      
      const date = getNamespaceResponse.body.metadata?.creationTimestamp
      


      
      
    } catch (err) {
      console.error('Error retrieving namespace information:', err);
      res.status(500).json({ error: 'Failed to retrieve namespace information' });
    }
  });



app.post('/api/namespace:name/deployment' , async(req: Request , res: Response) => {
  const {name  , image } = req.body
  const namespaceName = req.params.body
  const deployment = {
    apiVersion: 'apps/v1',
    kind: 'Deployment',
    metadata: {
      namespace: namespaceName,
      name: name,
    },
    spec: {
      replicas: 1,
      selector: {
        matchLabels: {
          app: 'my-app',
        },
      },
      template: {
        metadata: {
          labels: {
            app: 'my-app',
          },
        },
        spec: {
          containers: [
            {
              name: 'my-container',
              image: image,
            },
          ],
        },
      },
    },
  };
  appsV1Api.createNamespacedDeployment('default', deployment)
  .then((response) => {
    console.log(`Created deployment ${deployment.metadata.name}`);
    res.status(200).json(`created Deployment ${deployment.metadata.name}`)
  })
  .catch((err) => {
    console.error('Error:', err);
    res.status(500).json(err)
  });


})

app.post('/api/labs/objectstoage',async(req: Request , res: Response) => {
  const {accessKey , secretKey , namespaceName } = req.body
  parsedataforLab1('./Labs/obejctStoageLab.yaml',accessKey ,secretKey , )
  const deployment = yaml.load(fs.readFileSync('./Labs/obejctStoageLab.yaml'))
  
  appsV1Api.createNamespacedDeployment(namespaceName, deployment)
  .then((response) => {
    console.log(`Created deployment ${deployment.metadata.name}`);
    res.status(200).json(`created Deployment ${deployment.metadata.name}`)
  })
  .catch((err) => {
    console.error('Error:', err);
  });



})
function parsedataforLab1(filePath: string, accessKey: string, secretKey: string ): void {
  try {
    // Read the YAML file
    const fileContents = fs.readFileSync(filePath, 'utf8');

    // Parse the YAML file
    const deployment = yaml.load(fileContents);

    // Add the AccessKey and SecretKey environment variables
    if (deployment && deployment[0] && deployment[0].spec && deployment[0].spec.template &&
        deployment[0].spec.template.spec && deployment[0].spec.template.spec.containers &&
        deployment[0].spec.template.spec.containers.length > 0 &&
        deployment[0].spec.template.spec.containers[0].env) {
      const envVariables = deployment[0].spec.template.spec.containers[0].env;
      envVariables.push({ name: 'MINIO_ACCESS_KEY', value: accessKey })
      envVariables.push({ name: 'MINIO_SECRET_KEY', value: secretKey })
    }

    // Convert the modified deployment back to YAML
    const updatedYaml = yaml.dump(deployment);

    // Overwrite the YAML file with the updated content
    fs.writeFileSync(filePath, updatedYaml, 'utf8');

    console.log('YAML file updated successfully.');
  } catch (error) {
    console.error('Error updating YAML file:', error);
  }
}
// Start the server




app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
