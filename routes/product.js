import express from 'express'
import { store , list ,deletedata , edit , update} from '../controllers/productcontroller.js'
import multer from 'multer'
import upload from '../middlewares/uploads.js'
const product = express()




product.post('/store', upload.array("images", 7), store);
product.get('/list',list)
product.get('/delete/:id',deletedata)
product.get('/edit/:id',edit)
product.post('/update/:id',upload.array("images", 7),update)


export default product