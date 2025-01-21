import express, { urlencoded } from 'express';
import dotenv from 'dotenv';
import multer from 'multer';
import cors from 'cors';
import path from 'path';
import fs from 'fs';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 2000;
console.log(PORT);

// Middleware
app.use(cors());


// 1.This line sets up middleware to serve static files from a directory named public.
// 2.The express.static function is a built-in middleware function in Express that serves static files such as HTML, CSS, JavaScript, images, etc.
// 3.When a request is made to the server for a file (like an image or a CSS file), Express will look in the `public` directory to find that file and serve it to the client.
// 4.For example, if you have a file public/style.css, it can be accessed via http://yourdomain.com/style.css.
app.use(express.static('public'));

// 1.This line sets up middleware to parse incoming requests with URL-encoded payloads.
// 2.URL-encoded data is typically sent from HTML forms when the form's method is set to `POST` and the `enctype` is set to `application/x-www-form-urlencoded` (which is the default).
// 3.The express.urlencoded middleware parses the incoming request bodies and makes the data available in `req.body`.
// 4.The extended: true option allows for rich objects and arrays to be encoded into the URL-encoded format, using the `qs` library. If set to `false`, it uses the `querystring` library, which does not support nested objects.
app.use(express.urlencoded({extended:true}));

// 1.EJS view engine steup
app.set('view engine','ejs');


//File storage configuration
/* 
    `multer.diskStorage`: This function allows you to customize the storage of uploaded files. It takes an object with two properties: destination and filename.

    `destination`: This function determines where the uploaded files will be stored. It takes three arguments:
        `req`: The request object.
        `file`: The file object being uploaded.
        `cb`: A callback function that you call to indicate where to store the file. The first argument is an error (if any), and the second argument is the destination path.

    In your example, files will be stored in the file-storage/ directory.

    `filename`: This function determines the name of the uploaded file. It also takes three arguments:
        `req`: The request object.
        `file`: The file object being uploaded.
        `cb`: A callback function to set the filename. The first argument is an error (if any), and the second argument is the name of the file.

    In your example, the filename is set to the current timestamp (using `Date.now()`) followed by the original file extension (using `path.extname(file.originalname)`).
 */
const storage = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'uploads/');
    },

    filename:(req,file,cb)=>{
        cb(null,Date.now() + path.extname(file.originalname))
    }
});
// This line creates an instance of the Multer middleware with the specified storage configuration.
const upload = multer({ storage: storage });

// Routes


app.get('/',(req,res)=>{
// `fs.readdir`: This is a method from the Node.js fs (file system) module. It is used to asynchronously read the contents of a directory. In this case, it is reading the directory named 'uploads'.
/* 
Callback Function: The fs.readdir method takes two arguments:
    The first argument is the path to the directory you want to read ('uploads').
    The second argument is a callback function that will be executed once the directory has been read. This function takes two parameters: err and files(array of names of files).
*/
    fs.readdir('uploads',(error,files)=>{
        if(error){
            res.status(500).send('Unable to scan files');
        }
        res.render('index',{ files })
    });
});

// multer provides several methods for handling file uploads, each tailored for different use cases
/* 
1. upload.single(fieldName)
    Purpose: Handles the upload of a single file.
    Parameter:
        fieldName: The name of the form field that contains the file to be uploaded.
    Usage: This method is used when you expect only one file to be uploaded from a specific field in the form.

app.post('/upload', upload.single('file'), (req, res) => {
    console.log(req.file); // Contains information about the uploaded file
    res.send('File uploaded successfully!');
    });

2. upload.array(fieldName, maxCount)
    Purpose: Handles the upload of multiple files from a single field.
    Parameters:
        fieldName: The name of the form field that contains the files to be uploaded.
        maxCount: The maximum number of files that can be uploaded.
    Usage: This method is used when you want to allow users to upload multiple files from a single input field.
    Example:

app.post('/upload', upload.array('files', 5), (req, res) => {
    console.log(req.files); // Contains an array of uploaded files
    res.send('Files uploaded successfully!');
    });

    In this example, the form field named files can accept up to 5 files.

3. upload.fields(fields)
    Purpose: Handles the upload of multiple files from multiple fields.
    Parameter:
        fields: An array of objects, where each object specifies a field name and an optional maximum count of files for that field.
    Usage: This method is useful when you have multiple file input fields in your form, each potentially allowing multiple files.
    Example:

app.post('/upload', upload.fields([{ name: 'images', maxCount: 3 }, { name: 'documents', maxCount: 2 }]), (req, res) => {
    console.log(req.files); // Contains an object with arrays of uploaded files for each field
    res.send('Files uploaded successfully!');
    });
    In this example, the form can have an input field named images that allows up to 3 files and another field named documents that allows up to 2 files.

4. upload.none()
    Purpose: Handles form submissions that do not include any files.
    Usage: This method is used when you want to process form data without any file uploads. It allows you to access the form fields in req.body.
    Example:

app.post('/submit', upload.none(), (req, res) => {
    console.log(req.body); // Contains the form fields
    res.send('Form submitted successfully!');
});
In this example, the form can be submitted without any files, and you can still access the other form fields through req.body

*/

app.post('/uploads',upload.single('file'),(req,res)=>{
    res.redirect('/');
});


app.post('/delete',(req,res)=>{
    // syntax
    // const filePath = path.join('folder', 'subfolder', 'file.txt');
const filePath = path.join(__dirname,'uploads',req.body.filename);
    fs.unlink(filePath,(error)=>{
        if(error){
            return res.status(404).send('File Not Found');
        }
        res.redirect('/');
    });
})


app.listen(3000,()=>{
    console.log(`Server is running on http://localhost:${PORT}`);
})








