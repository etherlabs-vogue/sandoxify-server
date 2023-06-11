"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const zod_1 = require("zod");
const child_process_1 = require("child_process");
const handlebars_1 = __importDefault(require("handlebars"));
const fs = __importStar(require("fs"));
const LAbobject = zod_1.z.object({
    namespaceName: zod_1.z.string().min(3).max(10).refine((val) => val.toLowerCase() === val, {
        message: 'Namespace name must be in lowercase'
    }),
    labId: zod_1.z.number().int(),
    app: zod_1.z.string().min(3).max(10),
    accessKey: zod_1.z.string().min(6).refine((val) => val.toLowerCase() === val, {
        message: 'Access key must be in lowercase'
    }),
    secretKey: zod_1.z.string().min(6).refine((val) => val.toLowerCase() === val, {
        message: 'Secret key must be in lowercase'
    })
});
const app = (0, express_1.default)();
app.use(express_1.default.json());
const PORT = 2090;
function executeKubectl(command) {
    return new Promise((resolve, reject) => {
        (0, child_process_1.exec)(command, (error, stdout, stderr) => {
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
app.post('/api/labs/objectstorage', (req, res) => {
    try {
        const { namespaceName, labId, app, accessKey, secretKey } = LAbobject.parse(req.body);
        const source = fs.readFileSync('./Labs/Test/ObjectStorageLab.yaml', 'utf-8');
        const template = handlebars_1.default.compile(source);
        const data = {
            NamespaceName: namespaceName,
            labId: labId,
            app: app,
            accessKey: accessKey,
            secretKey: secretKey
        };
        const output = template(data);
        console.log(output);
        fs.writeFileSync('tempfile.yaml', output, 'utf8');
        executeKubectl('kubectl apply -f ./tempfile.yaml')
            .then(() => {
            res.status(200).json('Deployed Lab');
        })
            .catch((err) => {
            res.status(500).json(err);
        });
    }
    catch (error) {
        res.status(400).json(error.message);
    }
});
app.delete('/api/labs/objectstorage', (req, res) => {
    try {
        const { namespaceName, labId, app, accessKey, secretKey } = LAbobject.parse(req.body);
        const source = fs.readFileSync('./Labs/Test/ObjectStorageLab.yaml', 'utf-8');
        const template = handlebars_1.default.compile(source);
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
    }
    catch (error) {
        res.status(400).json(error.message);
    }
});
app.get('/api/info/:namespace', (req, res) => {
    const { namespaceName } = req.body;
    executeKubectl(`kubectl get all -n ${namespaceName} -o json`).then(data => res.send(data))
        .catch((err) => {
        res.send(500).json(err);
    });
});
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
