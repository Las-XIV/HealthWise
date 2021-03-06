const _ = require('lodash');

class RequestHandler{
    constructor(logger){
        this.logger = logger
    }

    throwIf(fn, status, errorType, errorMessage) {
		return result => (fn(result) ? this.throwError(status, errorType, errorMessage)() : result);
    }
    
    throwError(status, errorType, errorMessage) {
		return (e) => {
			if (!e) e = new Error(errorMessage || 'Default Error');
			e.status = status;
			e.errorType = errorType;
			throw e;
		};
	}

    catchError(res,error){
        if(!error) error = new Error('Default Error');
        res.status(error.status || 500).json({
            type: 'error',
            message: error.message || 'Unhandled error'
        })
    }

    sendSuccess(res,message,status){
        this.logger.infoLogger.log({level: 'info', message: `A request has been made and proccessed successfully at ${new Date()}`});
        return (data, globalData)=>{
            if(_.isUndefined(status)){
                status = 200
            }
            res.status(status).json({
                type: 'success',
                message: message || 'Success result', 
                data, 
                ...globalData,
            })
        }
    }

    sendError(req,res,error){
        this.logger.errorLogger.log({level: 'error', message:`error, error during processing request: ${req.protocol}://${req.get('host')}${req.originalUrl} , message details: ${error.message}`})
        return res.status(error.status || 500).json({
            type: 'error',
            message: error.message || 'Unhandled error',
            error,
        })
    }
}

module.exports = RequestHandler