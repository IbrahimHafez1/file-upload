const { StatusCodes } = require('http-status-codes')
const path = require('path')
const CustomAPIError = require('../errors/custom-api')
const cloudinary = require('cloudinary').v2
const fs = require('fs')

const uploadProductImageLocal = async (req, res) => {
    if (!req.files) {
        throw new CustomAPIError('No file uploaded')
    }
    const productImage = req.files.image
    if (!productImage.mimetype.startsWith('image')) {
        throw new CustomAPIError('Please upload image')
    }
    const maxSize = 1024 * 1024
    if (productImage.size > maxSize) {
        throw new CustomAPIError('Please upload image smaller than 1MB')
    }
    const imagePath = path.join(__dirname, '../public/uploads/' + `${productImage.name}`)
    await productImage.mv(imagePath)
    return res.status(StatusCodes.OK).json({ image: { src: `/uploads/${productImage.name}` } })
}

const uploadProductImage = async (req, res) => {
    if (!req.files) {
        throw new CustomAPIError('No file uploaded')
    }
    const productImage = req.files.image
    const result = await cloudinary.uploader.upload(productImage.tempFilePath, {
        use_filename: true,
        folder: 'file-upload',
    })
    fs.unlinkSync(productImage.tempFilePath)
    return res.status(StatusCodes.OK).json({ image: { src: result.secure_url } })
}

module.exports = {
    uploadProductImage
}