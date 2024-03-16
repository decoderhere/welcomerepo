
class errorHandler extends Error {
    constructor(message,statusCode) {
        super();
        this.message= message
        this.statusCode= statusCode

        Error.captureStackTrace(this,this.constructor)

    }
}
module.exports= errorHandler ;