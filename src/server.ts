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
// app.post('/api/pods', async (req: Request, res: Response) => {
//   try {
//     // Extract pod details from the request body
//     const { name, image } = req.body;

//     // Define the pod manifest
//     const podManifest: V1Pod = {
//       apiVersion: 'v1',
//       kind: 'Pod',
//       metadata: {
//         name,
//       } as V1ObjectMeta,
//       spec: {
        
//         containers: [
//           {
//             name: 'my-container',
//             image,
//           } as V1Container,
//         ],
//       },
//     };

//     // Create the pod
//     const createPodResponse = await coreV1Api.createNamespacedPod('default', podManifest);

//     // Return the created pod
//     res.status(201).json(createPodResponse.body);
//   } catch (err) {
//     console.error('Error creating pod:', err);
//     res.status(500).json({ error: 'Failed to create pod' });
//   }
// });

// app.delete('/api/pods/:name', async (req: Request, res: Response) => {
//     try {
//       const podName = req.params.name;
  
//       // Delete the pod
//       const deletePodResponse = await coreV1Api.deleteNamespacedPod(podName, 'default');
  
//       // Return success message
//       res.status(200).json({ message: `Pod '${podName}' deleted successfully` });
//     } catch (err) {
//       console.error('Error deleting pod:', err);
//       res.status(500).json({ error: 'Failed to delete pod' });
//     }
//   });

// app.post('/api/namespaces', async (req: Request, res: Response) => {
// try {
//     const { name } = req.body;

//     // Define the namespace manifest
//     const namespaceManifest: V1Namespace = {
//     apiVersion: 'v1',
//     kind: 'Namespace',
//     metadata: {
//         name,
//     },
//     };

//     // Create the namespace
//     const createNamespaceResponse = await coreV1Api.createNamespace(namespaceManifest);
//     console.log(req.body)
//     // Return the created namespace
//     res.status(201).json(createNamespaceResponse.body);
// } catch (err) {
//     console.error('Error creating namespace:', err);
//     res.status(500).json({ error: 'Failed to create namespace' });
// }
// });
// // API endpoint to delete a namespace
// app.delete('/api/namespaces/:name', async (req: Request, res: Response) => {
// try {
//     const namespaceName = req.params.name;

//     // Delete the namespace
//     const deleteNamespaceResponse = await coreV1Api.deleteNamespace(namespaceName);

//     // Return success message
//     res.status(200).json({ message: `Namespace '${namespaceName}' deleted successfully` });
// } catch (err) {
//     console.error('Error deleting namespace:', err);
//     res.status(500).json({ error: 'Failed to delete namespace' });
// }
// });

// app.get('/api/namespaces/:name', async (req: Request, res: Response) => {
//     try {
//       const namespaceName = req.params.name;
//       // Retrieve namespace information
//       const getNamespaceResponse = await coreV1Api.readNamespace(namespaceName); 
//       // Return the namespace information
//       res.status(200).json(getNamespaceResponse.body);
//       const now =  Date.now() 
      
//       const date = getNamespaceResponse.body.metadata?.creationTimestamp
      


      
      
//     } catch (err) {
//       console.error('Error retrieving namespace information:', err);
//       res.status(500).json({ error: 'Failed to retrieve namespace information' });
//     }
//   });



// app.post('/api/namespace/deployment' , async(req: Request , res: Response) => {
//   const {name  , image , namespace } = req.body
//   const deployment = yaml.load(fs.readFileSync('./Labs/Deployment.yaml'))
//   deployment.metadata.name = name
//   deployment.spec.template.spec.containers.image = image
//   console.log(deployment)
//   appsV1Api.createNamespacedDeployment(namespace, deployment)
//   .then((response) => {
//     console.log(`Created deployment ${deployment.metadata.name}`);
//     res.status(200).json(`created Deployment ${deployment.metadata.name}`)
//   })
//   .catch((err) => {
//     console.error('Error:', err);
//     res.status(500).json(err)
//   });


// })

// app.post('/api/labs/objectstoage',async(req: Request , res: Response) => {
//   const {accessKey , secretKey , namespaceName } = req.body
//   const deployment = yaml.load(fs.readFileSync('./Labs/ObjectStorage/obejctStoageLab.yaml'))
  
//   deployment.spec.template.spec.containers[0].env[0].value = accessKey
//   deployment.spec.template.spec.containers[0].env[0].value = secretKey
//   const updatedDeployment = yaml.dump(deployment)
//   const deployment1 = yaml.load(updatedDeployment)
//   const serviceDeployment =  yaml.load(fs.readFileSync('./Labs/ObjectStorage/Service.yaml'))

//   // Deploy Minio
//   appsV1Api.createNamespacedDeployment(namespaceName, deployment1)
//   // Deploy Minio Service
//   coreV1Api.createNamespacedService(namespaceName , serviceDeployment)
//   .then((response) => {
//     console.log(`Created deployment ${deployment1.metadata.name}`);
//     res.status(200).json(`created Deployment ${deployment1.metadata.name}`)
//   })
//   .catch((err) => {
//     console.error('Error:', err);
//   });
//   res.status(200).json("created anything")



// })

app.post('/api/deployment',async(req: Request , res: Response) => {
  const {image , deploymentName, namespace  , port } = req.body
  const deploymentFile = yaml.load(fs.readFileSync('Templates/Deployment.yaml'))
  /// Fortmating Yaml File
  deploymentFile.metadata.name = deploymentName
  deploymentFile.spec.template.spec.containers[0].image = image
  //Add Change to ContainerPort//

  appsV1Api.createNamespacedDeployment(namespace , deploymentFile)
  .then((response) => {
      res.send(200).json("Deployment For" + deploymentName + "Finished")

  })
  .catch((err) => {
    res.send(500).json(err);
  });
})

app.delete('/api/deployment',async(req: Request , res: Response) => {
  const {image , deploymentName, namespace  , port } = req.body
  const deploymentFile = yaml.load(fs.readFileSync('Templates/Deployment.yaml'))
  /// Fortmating Yaml File
  deploymentFile.metadata.name = deploymentName
  deploymentFile.spec.template.spec.containers[0].image = image
  //Add Change to ContainerPort//

  appsV1Api.deleteNamespacedDeployment(namespace , deploymentFile).then((response) => {
      res.send(200).json("Deployment For" + deploymentName + "Finished")

    })
    .catch((err) => {
      res.send(500).json(err)
})
})


app.post('/api/service',async(req: Request , res: Response) => {

  // Add Enum for ClusterIP , LoadBalancer , NodePort
  const {namespaceName , serviceName , targetPort , sourcePort , type}  = req.body
  const serviceDeploymentFile = yaml.load(fs.readFileSync('Templates/Service.yaml'))
  console.log(serviceDeploymentFile)
  serviceDeploymentFile.metadata.name = serviceName
  serviceDeploymentFile.spec.type = type
  serviceDeploymentFile.spec.ports[0].port = sourcePort
  serviceDeploymentFile.spec.ports[0].targetPort = targetPort
  coreV1Api.createNamespacedService(namespaceName , serviceDeploymentFile)
  .then((response) => {
    res.status(200).json("Created Service" + serviceName)
  })
  .catch((err) => {
    res.status(500).json(err)
  })
})

app.delete('/api/service',async(req: Request , res: Response) => {

  // Add Enum for ClusterIP , LoadBalancer , NodePort
  const {namespaceName , serviceName , targetPort , sourcePort , type}  = req.body
  const serviceDeploymentFile = yaml.load(fs.readFileSync('Templates/Service.yaml'))
  serviceDeploymentFile.metadata.name = serviceName
  serviceDeploymentFile.spec.type = type
  serviceDeploymentFile.spec.ports[0].port = sourcePort
  serviceDeploymentFile.spec.ports[0].targetPort = targetPort
  coreV1Api.deleteNamespacedService(namespaceName , serviceDeploymentFile)
  .then((response) => {
    res.status(200).json("Created Service" + serviceName)
  })
  .catch((err) => {
    res.status(500).json(err)
  })
})


app.post('/api/storage/pv',async(req: Request , res: Response) =>{




})





















// Start the server

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
