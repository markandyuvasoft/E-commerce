import multer from "multer";
import Product from "../models/product.js";

const storage = multer.diskStorage({
  destination: 'images',
  
  filename: (req, file, cb) => {
      cb(null, new Date().toISOString().replace(/:/g, '-') + '-' + file.originalname);
    }
});
//FILE STORAGE QUERY END....................................................................................


//FILE FILTER QUERY START....................................................................................
const filefilter = (req, file, cb) => {
  if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' 
      || file.mimetype === 'image/jpeg' || file.mimetype === 'application/pdf'){
          cb(null, true);
      }else {
          cb(null, false);
      }

}
const upload= (multer({storage:storage, fileFilter:filefilter }).single('image'))

export default upload