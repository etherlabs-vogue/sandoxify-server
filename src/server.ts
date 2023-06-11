import express, { Request, Response } from 'express';
import { string, z } from 'zod';
import { exec } from 'child_process';
import Handlebars from 'handlebars';
import * as fs from 'fs';
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()


const LAbobject = z.object({
  namespaceName: z.string().min(3).max(10).refine((val) => val.toLowerCase() === val, {
    message: 'Namespace name must be in lowercase'
  }),
  labId: z.number().int(),
  app: z.string().min(3).max(10),
  accessKey: z.string().min(6).refine((val) => val.toLowerCase() === val, {
    message: 'Access key must be in lowercase'
  }),
  secretKey: z.string().min(6).refine((val) => val.toLowerCase() === val, {
    message: 'Secret key must be in lowercase'
  })
});

const app = express();
app.use(express.json());
const PORT = 2090;

function executeKubectl(command: string): Promise<string> {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing command: ${error}`);
        reject(error);
        return;
      }

      console.log(`Command executed successfully: ${command}`);
      resolve(stdout);
      console.log(`stderr: ${stderr}`);
    });
  });
}

async function createDeplyomentinDB(namespace, app , accessKey , secretKey ){
  const deployment = await prisma.lab.create({
    data: {
      namespaceName: namespace,
      app: app,
      accessKey: accessKey,
      secretKet: secretKey,
    },
  })
  console.log(`added namespace: ${namespace} To the DB`)
  
}


async function createLabType(title , description) {
  const labType = await prisma.labType.create({
    data:{
    title: title,
    description: description
  },
})
console.log("added LabType")
}





app.post('/api/labs/objectstorage', (req: Request, res: Response) => {
  try {
    const { namespaceName, labId, app, accessKey, secretKey } = LAbobject.parse(req.body);

    const source = fs.readFileSync('./Labs/Test/ObjectStorageLab.yaml', 'utf-8');
    const template = Handlebars.compile(source);
    const data = {
      NamespaceName: namespaceName,
      labId: labId,
      app: app,
      accessKey: accessKey,
      secretKey: secretKey
    };
    const output = template(data);
    createDeplyomentinDB(namespaceName,app,accessKey,secretKey)
    console.log(output);
    fs.writeFileSync('tempfile.yaml', output, 'utf8');

    executeKubectl('kubectl apply -f ./tempfile.yaml')
      .then(() => {
        res.status(200).json('Deployed Lab');
      })
      .catch((err) => {
        res.status(500).json(err);
      });
  } catch (error) {
    res.status(400).json(error.message);
  }
});

app.delete('/api/labs/objectstorage', (req: Request, res: Response) => {
  try {
    const { namespaceName, labId, app, accessKey, secretKey } = LAbobject.parse(req.body);

    const source = fs.readFileSync('./Labs/Test/ObjectStorageLab.yaml', 'utf-8');
    const template = Handlebars.compile(source);
    const data = {
      NamespaceName: namespaceName,
      labId: labId,
      app: app,
      accessKey: accessKey,
      secretKey: secretKey
    };
    const output = template(data);
    console.log(output);
    fs.writeFileSync('./tempfile.yaml', output, 'utf8');

    executeKubectl('kubectl delete -f ./tempfile.yaml')
      .then(() => {
        res.status(200).json('bla');
      })
      .catch((err) => {
        res.status(500).json(err);
      });
  } catch (error) {
    res.status(400).json(error.message);
  }
});



app.get('/api/info/:namespace',(req:Request,res:Response)=>{
  const { namespaceName } = req.body

  executeKubectl(`kubectl get all -n ${namespaceName} -o json`).then(data => res.send(data) )
  .catch((err)=>{

    res.send(500).json(err)
  })

});


app.post('/api/labtypes/add',(res:Response , req:Request)=>{



})

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
