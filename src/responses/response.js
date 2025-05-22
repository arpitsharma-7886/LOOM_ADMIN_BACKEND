import HttpStatus from "http-status-codes"

export const sendSuccessresponse=async(res,data,message,statusCode=HttpStatus.OK)=>{
 res.status(statusCode).json({
    success:true,
    message,
    data
 })
}
export const sendErrorResponse=async(res,data=[],message,statusCode=HttpStatus.INTERNAL_SERVER_ERROR)=>{
    res.status(statusCode).json({
        success:false,
        message,
        data
    })
}

export const sendSuccessResponse=async(res,data,message,statusCode=HttpStatus.OK)=>{
 res.status(statusCode).json({
    success:true,
    message,
    data
 })
}