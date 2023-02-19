
// admin input
exports.validateAdminUpdate = (req, res, next) => {
    let data = req.body;
    const data_Types = [ 'firstName', 'lastName', 'email', 'gender', 'id', 'address',
     'contact', 'password', 'title', 'accessLevel', 'adminType', 'type' ]

     if (data?.firstName?.length < 2) {
        return res.status(400).json({message: "First Name is too short", statusId:'FAILED'})
    }

    if (data?.lastName?.length < 2) {
        return res.status(400).json({message: "Last Name is too short", statusId:'FAILED'})
    }

    if (data?.email?.length < 2) {
        return res.status(400).json({message: "Email is invalid", statusId:'FAILED'})
    }

    if (data?.gender?.length < 3) {
        return res.status(400).json({message: "Write gender in full", statusId:'FAILED'})
    }
  
    if (data?.address?.length < 4) {
        return res.status(400).json({message: "Address is too short", statusId:'FAILED'})
    }
    
    if (!data?.contact) {
        return res.status(400).json({message: "Contact  must be a provided", statusId:'FAILED'})
    }

     req.body = fieldFilters(data_Types, data)
    next(); 
}



// user input 
exports.validateUserUpdate = (req, res, next) => {
    
    let data = req.body;
    console.log(data)
    const data_Types = ['firstName', 'lastName', 'email', 'gender', 'id', 'location', 'dob',
                 'area', 'address', 'contact', 'password', 'status', 'image', 'type'
    ]

    if (data?.firstName?.length < 0) {
        return res.status(400).json({message: "First Name is needed", statusId:'FAILED'})
    }

    if (data?.lastName?.length < 0) {
        return res.status(400).json({message: "Last Name is needed", statusId:'FAILED'})
    }

    if (data?.email?.length < 2) {
        return res.status(400).json({message: "Email is invalid", statusId:'FAILED'})
    }

    if (data?.gender?.length < 2) {
        return res.status(400).json({message: "Kindly select Gender", statusId:'FAILED'})
    }

    if (data?.status?.length < 2) {
        return res.status(400).json({message: "Kindly elect Status", statusId:'FAILED'})
    }
  

    if (data?.location?.length < 2) {
        return res.status(400).json({message: "Location is too short", statusId:'FAILED'})
    }
  
    if (data?.address?.length < 2) {
        return res.status(400).json({message: "Address is too short", statusId:'FAILED'})
    }
    
    if (data?.contact?.length < 3) {
        return res.status(400).json({message: "Contact  must be a provided", statusId:'FAILED'})
    }

    // if (!!data?.image) {
    //     return res.status(400).json({message: "Kindly Upload a Passport Image", statusId:'FAILED'})
    // }
    

    req.body = fieldFilters(data_Types, data)
    next(); 
}


// filters types to only ensure the specified array of fields passed are returned .
function fieldFilters(listOfFields, obj) {
    let returnedObject = {}
    const fieldKeys = Object.keys(obj);
    let filteredFileds = fieldKeys.filter(e => {
        if ((listOfFields.includes(e))) return true
        return false
    });
    filteredFileds.forEach(elem => {
        returnedObject = { ...returnedObject, [elem]: obj[elem] }
    })
    return returnedObject;
}