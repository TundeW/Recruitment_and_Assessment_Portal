const queries = require("./query");
const db = require("./database");
const moment = require("moment");
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();


async function createNewUser(role, body) {
    const {
        first_name,
        last_name,
        email,
        password,
        phone_number
    } = body;
    const d = new Date();
    const created_at = moment(d).format("YYYY-MM-DD HH:mm:ss");

    const queryObj = {
        text: queries.addNewUser,
        values: [first_name, last_name, email, phone_number, password, role, created_at, created_at],
    };

    try{
        const { rowCount } = await db.query(queryObj);
        if (rowCount == 0) {
            return Promise.reject({
                status: "error",
                code: 500,
                message: "Could not create user account",
            });
        }

        if (rowCount > 0){
            return Promise.resolve({
                status: "success",
                code: 201,
                response: "User Account Successfully Created",
            });
        }
    } catch (e) {
        console.log(e);
        return Promise.reject({
            status: "error",
            code: 500,
            message: "Error creating User Account",
        });
    }
}

async function checkIfUserDoesNotExistBefore(email){
    const queryObj = {
        text: queries.findUserByEmail,
        values: [email],
    };

    try{
        const { rowCount } = await db.query(queryObj);
        if (rowCount == 0) {
            return Promise.resolve();
        }
        if (rowCount > 0) {
            return Promise.reject({
                status: "error",
                code: 409,
                message: "Email Already Exists",
            });
        }
    } catch(e) {
        console.log(e);
        return Promise.reject({
            status: "error",
            code: 500,
            message: "Error finding email",
        });
    }
}

async function checkIfEmailAndPasswordMatch(body){
    const { email, password } = body;
    const queryObj = {
        text: queries.findUserByEmailAndPassword,
        values: [email, password],
    };

    try{
        const { rows, rowCount } = await db.query(queryObj);
        if (rowCount == 0){
            return Promise.reject({
                status: "bad request",
                code: 400,
                message: "The username and password combination you entered doesn't belong to a user.",
            });
        }

        if (rowCount > 0){
            return Promise.resolve({
                status: "success",
                code: 200,
                response: "Login Successful...",
                data: {
                    user: {
                        id: rows[0].id,
                        first_name: rows[0].first_name,
                        last_name: rows[0].last_name,
                        email: rows[0].email,
                        role: rows[0].role
                    }
                },
            });
        }



    } catch (e) {
        return Promise.reject({
            status: "error",
            code: 500,
            message: "Error Logging in",
        });
    }
}


async function createNewApplicant( body, cv, user_id) {

    const cvname = cv.name;
    cv.mv('uploads/'+cvname, (err) => {
        if (err) {
            console.log('Could Not Upload CV');
        }
        else{
            console.log(cvname)
        }
    })
    const {
        first_name,
        last_name,
        email,
        date_of_birth,
        address,
        university,
        course,
        cgpa
    } = body;
    const application_id = 2;
    const status = 'Pending';
    const assessment_status = false;
    const d = new Date();
    const created_at = moment(d).format("YYYY-MM-DD HH:mm:ss");

    const queryObj = {
        text: queries.addNewApplicant,
        values: [user_id, application_id, first_name, last_name, email, date_of_birth, address, university, course, cgpa, cvname, status, assessment_status, created_at, created_at],
    };

    try{
        const { rowCount } = await db.query(queryObj);

        if (rowCount == 0) {
            return Promise.reject({
                status: "error",
                code: 500,
                message: "Could not create user application",
            });
        }

        if (rowCount > 0){
            return Promise.resolve({
                status: "success",
                code: 201,
                response: "User successfully applied.",
            });
        }
    } catch (e) {
        console.log(e);
        return Promise.reject({
            status: "error",
            code: 500,
            message: "Error creating User Application",
        });
    }
}

async function checkIfApplicationExists(id){
    const queryObj = {
        text: queries.findApplicationById,
        values: [id],
    };

    try{
        const { rowCount } = await db.query(queryObj);
        if (rowCount == 0) {

            return Promise.reject({
                status: "error",
                code: 409,
                message: "Application Does not Exist",
            });
        }
        if (rowCount > 0) {
            return Promise.resolve();
        }
    } catch(e) {
        console.log(e);
        return Promise.reject({
            status: "error",
            code: 500,
            message: "Error finding application",
        });
    }
}

async function checkIfUserHasApplication(application_id, user_id){
    const queryObj = {
        text: queries.findApplicantByApplicationAndUserId,
        values: [application_id, user_id],
    };

    try{
        const { rowCount } = await db.query(queryObj);
        if (rowCount == 0) {
            return Promise.resolve();
        }
        if (rowCount > 0) {

            return Promise.reject({
                status: "error",
                code: 409,
                message: "User has already applied",
            });
        }
    } catch(e) {
        console.log(e);
        return Promise.reject({
            status: "error",
            code: 500,
            message: "Error fetching applicants",
        });
    }
}

async function checkIfUserHasApplied(user_id){
    const queryObj = {
        text: queries.findApplicantByUserId,
        values: [ user_id],
    };

    try{
        const { rowCount } = await db.query(queryObj);
        if (rowCount == 0) {
            return Promise.resolve({
                message: "User has not applied",
                response: false,
            });
        }
        if (rowCount > 0) {

            return Promise.resolve({
                message: "User has already applied",
                response: true,
            });
        }
    } catch(e) {
        console.log(e);
        return Promise.reject({
            status: "error",
            code: 500,
            message: "Error fetching applicants",
        });
    }
}

async function createNewApplication( body, file, admin_id) {

    const filename = file.name;
    file.mv('uploads/'+filename, (err) => {
        if (err) {
            console.log('Could Not Upload file');
        }
        else{
            console.log(filename)
        }
    })
    const {
        batch_id,
        link,
        deadline,
        instructions,
    } = body;
    const applications_total = 0;
    const d = new Date();
    const created_at = moment(d).format("YYYY-MM-DD HH:mm:ss");

    const queryObj = {
        text: queries.addNewApplication,
        values: [batch_id, admin_id, link, deadline, instructions, filename, applications_total, created_at, created_at],
    };

    try{
        const { rowCount } = await db.query(queryObj);

        if (rowCount == 0) {
            return Promise.reject({
                status: "error",
                code: 500,
                message: "Could not create new application",
            });
        }

        if (rowCount > 0){
            return Promise.resolve({
                status: "success",
                code: 201,
                response: "Application created Successfully.",
            });
        }
    } catch (e) {
        console.log(e);
        return Promise.reject({
            status: "error",
            code: 500,
            message: "Error creating Application",
        });
    }
}


async function createNewAssessment( body) {

    const {
        application_id,
        question_total,
        timelimit
    } = body;
    const d = new Date();
    const created_at = moment(d).format("YYYY-MM-DD HH:mm:ss");

    const queryObj = {
        text: queries.addNewApplicant,
        values: [application_id, questions_total,timelimit, created_at, created_at],
    };

    try{
        const { rowCount } = await db.query(queryObj);

        if (rowCount == 0) {
            return Promise.reject({
                status: "error",
                code: 500,
                message: "Could not create new assessment",
            });
        }

        if (rowCount > 0){
            return Promise.resolve({
                status: "success",
                code: 201,
                response: "Assessment created Successfully.",
            });
        }
    } catch (e) {
        console.log(e);
        return Promise.reject({
            status: "error",
            code: 500,
            message: "Error creating Assessment",
        });
    }
}

async function createNewQuestion( body, image) {
    const imagename = image.name;
    cv.mv('uploads/'+imagename, (err) => {
        if (err) {
            console.log('Could Not Upload file');
        }
        else{
            console.log(imagename)
        }
    })

    const {
        assessment_id,
        question,
        options,
        answer
    } = body;
    const queryObj = {
        text: queries.addNewQuestion,
        values: [assessment_id, question, options, answer, imagename],
    };

    try{
        const { rowCount } = await db.query(queryObj);

        if (rowCount == 0) {
            return Promise.reject({
                status: "error",
                code: 500,
                message: "Could not add new question",
            });
        }

        if (rowCount > 0){
            return Promise.resolve({
                status: "success",
                code: 201,
                response: "Assessment Questions created Successfully.",
            });
        }
    } catch (e) {
        console.log(e);
        return Promise.reject({
            status: "error",
            code: 500,
            message: "Error adding Questions",
        });
    }
}


async function authenticationnByToken(token, req){

    if(!token) {
        return Promise.reject ({
            status: "forbidden",
            code: 401,
            message: "Access Denied",
        })
    }

    try{
        const verified = jwt.verify(token, process.env.TOKEN_SECRET);
        req.user = verified;
        console.log(req.user)
    } catch (e) {
        console.log(e);
        return Promise.reject({
            status: "error",
            code: 400,
            message: "Invalid Token",
        });
    }


}

async function authorisationById(token_role, role){


    try{
        if (token_role == role){
            return Promise.resolve();
        }

        if (token_role != role) {
            return Promise.reject({
                status: "forbidden",
                code: 403,
                message: "This user is not authorised to carry out this function",
            })
        }
    } catch(e) {
        console.log(e)
        return Promise.reject({
            status: "error",
            code: 500,
            message: "Error authorizing user",
        })
    }
}

async function getUserProfileById(user_id) {
    const queryObj = {
        text: queries.findUserById,
        values: [user_id],
    };
    try {
        const { rows } = await db.query(queryObj);
        return Promise.resolve({
            status: "success",
            code: 200,
            response: "Successfully fetched User Profile",
            data: rows[0],
        });
    } catch (e) {
        return Promise.reject({
            status: "error",
            code: 500,
            message: "Error fetching User Profile",
        });
    }
}


async function getApplicantById(user_id) {
    const queryObj = {
        text: queries.findApplicantsById,
        values: [user_id],
    };
    try {
        const { rows } = await db.query(queryObj);
        return Promise.resolve({
            status: "success",
            code: 200,
            response: "Successfully fetched applicant details",
            data: rows[0],
        });
    } catch (e) {
        return Promise.reject({
            status: "error",
            code: 500,
            message: "Error fetching applicant details",
        });
    }
}

async function getAllApplications() {
    const queryObj = {
        text: queries.findAllApplications,
    };
    try {
        const { rows } = await db.query(queryObj);
        return Promise.resolve({
            status: "success",
            code: 200,
            response: "Successfully fetched all applications",
            data: rows,
        });
    } catch (e) {
        return Promise.reject({
            status: "error",
            code: 500,
            message: "Error fetching applications",
        });
    }
}


async function getAllApplicants() {
    const queryObj = {
        text: queries.findAllApplicants,
    };
    try {
        const { rows } = await db.query(queryObj);
        return Promise.resolve({
            status: "success",
            code: 200,
            response: "Successfully fetched all applicants",
            data: rows,
        });
    } catch (e) {
        return Promise.reject({
            status: "error",
            code: 500,
            message: "Error fetching applicants",
        });
    }
}


async function getAllApplicantsWithScore() {
    const queryObj = {
        text: queries.findAllApplicantsWithScore,
    };
    try {
        const { rows } = await db.query(queryObj);
        return Promise.resolve({
            status: "success",
            code: 200,
            response: "Successfully fetched all applicants",
            data: rows,
        });
    } catch (e) {
        return Promise.reject({
            status: "error",
            code: 500,
            message: "Error fetching applicants",
        });
    }
}


async function updateTotalApplications(application_id, current){
    const new_total = current + 1;
    const queryObj = {
        text: queries.updateApplicationByBatchId,
        values: [ application_id, new_total],
    };

    try{
        const { rowCount } = await db.query(queryObj);
        if (rowCount == 0) {
            return Promise.reject({
                status: "error",
                code: 500,
                message: "Error updating applications",
            });
        }
        if (rowCount > 0) {

            return Promise.resolve({

            });
        }
    } catch(e) {
        console.log(e);
        return Promise.reject({
            status: "error",
            code: 500,
            message: "Error updating total applications",
        });
    }
}

async function getCurrentTotalApplications(id){
    const queryObj = {
        text: queries.findApplicationTotalById,
        values: [id],
    };

    try{
        const { rowCount, rows } = await db.query(queryObj);
        if (rowCount == 0) {

            return Promise.reject({
                status: "error",
                code: 409,
                message: "Application total error",
            });
        }
        if (rowCount > 0) {
            return Promise.resolve({
                total: rows[0].applications_total
            });
        }
    } catch(e) {
        console.log(e);
        return Promise.reject({
            status: "error",
            code: 500,
            message: "Error finding application total",
        });
    }
}


module.exports = {
    createNewUser,
    checkIfUserDoesNotExistBefore,
    checkIfEmailAndPasswordMatch,
    createNewApplicant,
    // createNewParcel,
    // authenticationById,
    authorisationById,
    // changeDestination,
    // parcelauthorisation,
    // checkParcelStatus,
    // changeStatus,
    // changeLocation,
    // getAllParcels,
    // getParcelsByUserId,
    // getParcelsByUserAndParcelId,
    authenticationnByToken,
    createNewApplication,
    createNewAssessment,
    createNewQuestion,
    checkIfApplicationExists,
    checkIfUserHasApplication,
    getUserProfileById,
    getApplicantById,
    getAllApplications,
    getAllApplicants,
    getAllApplicantsWithScore,
    checkIfUserHasApplied,
    updateTotalApplications,
    getCurrentTotalApplications,
};
