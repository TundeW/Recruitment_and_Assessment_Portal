const queries = require("./query");
const db = require("./database");
const moment = require("moment");
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const sendMail = require('./nodemailer');
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
                message: "The username and password does not match.",
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


async function getLatestApplicationDate(){
    const queryObj = {
        text: queries.findLastestApplicationDate,
    };

    try{
        const { rowCount, rows } = await db.query(queryObj);
        if (rowCount == 0) {

            return Promise.reject({
                status: "error",
                code: 500,
                message: "Error getting latest application",
            });
        }
        if (rowCount > 0) {
            return Promise.resolve({
                latest: rows[0].max
            });
        }
    } catch(e) {
        console.log(e);
        return Promise.reject({
            status: "error",
            code: 500,
            message: "Error finding latest application",
        });
    }
}

async function getLatestApplicationId(created_at){
    const queryObj = {
        text: queries.findApplicationIdByCreatedAt,
        values: [created_at],
    };

    try{
        const { rowCount, rows } = await db.query(queryObj);
        if (rowCount == 0) {

            return Promise.reject({
                status: "error",
                code: 500,
                message: "Error getting latest application id",
            });
        }
        if (rowCount > 0) {
            return Promise.resolve({
                data: rows[0].batch_id
            });
        }
    } catch(e) {
        console.log(e);
        return Promise.reject({
            status: "error",
            code: 500,
            message: "Error finding latest application id",
        });
    }
}

async function checkUserDetailsMatch(body, id){
    const {
        first_name,
        last_name,
        email
    } = body;

    const queryObj = {
        text: queries.findUserById,
        values: [id],
    };

    try{
        const { rowCount, rows } = await db.query(queryObj);
        if (rowCount == 0) {

            return Promise.reject({
                status: "error",
                code: 500,
                message: "Error confirming applicants details",
            });
        }
        if (rowCount > 0) {
            if(rows[0].first_name != first_name){
                return Promise.reject({
                    status: "error",
                    code: 409,
                    message: "Please fill correct First Name",
                });
            }else if(rows[0].last_name != last_name){
                return Promise.reject({
                    status: "error",
                    code: 409,
                    message: "Please fill correct Last Name",
                });
            }else if(rows[0].email != email) {
                return Promise.reject({
                    status: "error",
                    code: 409,
                    message: "Email must match what was used to Sign Up",
                });
            }else{
                return Promise.resolve({})
            }

        }
    } catch(e) {
        console.log(e);
        return Promise.reject({
            status: "error",
            code: 500,
            message: "Error matching applicants details",
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
        course_of_study,
        cgpa,
        application_id
    } = body;
    const status = 'Pending';
    const assessment_status = false;
    const d = new Date();
    const created_at = moment(d).format("YYYY-MM-DD HH:mm:ss");

    const queryObj = {
        text: queries.addNewApplicant,
        values: [user_id, application_id, first_name, last_name, email, date_of_birth, address, university, course_of_study, cgpa, cvname, status, assessment_status, created_at, created_at],
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
            const useremail = email;
            const subject = 'Enyata Academy Application'
            const text = `Your application into Academy ${application_id} has been received. You can monitor your application on your dashboard and take assessments`;
            // sendMail(useremail, subject, text)
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
        const { rowCount, rows } = await db.query(queryObj);
        if (rowCount == 0) {

            return Promise.reject({
                status: "error",
                code: 409,
                message: "Application Does not Exist",
            });
        }
        if (rowCount > 0) {
            const now = new Date()
            const deadline = new Date(rows[0].deadline)
            if (now > deadline){
                return Promise.reject({
                    status: "error",
                    code: 409,
                    message: "Application has closed",
                });
            }else{
                return Promise.resolve();
            }

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


async function checkIfApplicationExistsForAssessment(id){
    const queryObj = {
        text: queries.findApplicationById,
        values: [id],
    };

    try{
        const { rowCount, rows } = await db.query(queryObj);
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


async function checkIfApplicationHasAssessment(id){
    const queryObj = {
        text: queries.findAssessmentByApplicationById,
        values: [id],
    };

    try{
        const { rowCount, rows } = await db.query(queryObj);
        if (rowCount == 0) {
            return Promise.resolve();
        }
        if (rowCount > 0) {
                return Promise.reject({
                    status: "error",
                    code: 409,
                    message: "Application already has an Assessment",
                });
        }
    } catch(e) {
        console.log(e);
        return Promise.reject({
            status: "error",
            code: 500,
            message: "Error checking applications",
        });
    }
}

async function createNewAssessment( body) {

    const {
        application_id,
        questions_total,
        timelimit
    } = body;
    const status = 'Not Done'
    const d = new Date();
    const created_at = moment(d).format("YYYY-MM-DD HH:mm:ss");

    const queryObj = {
        text: queries.addNewAssessment,
        values: [application_id, questions_total,timelimit, created_at, created_at, status],
    };

    try{
        console.log('apple')
        const { rowCount, rows } = await db.query(queryObj);
        console.log('cow')
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
                data: rows[0].id
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
    let imagename = null
    if(image){
        imagename = image.name;
        image.mv('uploads/'+imagename, (err) => {
            if (err) {
                console.log('Could Not Upload file');
            }
            else{
                console.log(imagename)
            }
        })
    }


    const {
        assessment_id,
        question,
        option_a,
        option_b,
        option_c,
        option_d,
        answer
    } = body;
    const options = [option_a, option_b, option_c, option_d]
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


async function UpdateQuestion( body, image) {
    let imagename = null
    if(image){
        imagename = image.name;
        image.mv('uploads/'+imagename, (err) => {
            if (err) {
                console.log('Could Not Upload file');
            }
            else{
                console.log(imagename)
            }
        })
    }


    const {
        id,
        question,
        option_a,
        option_b,
        option_c,
        option_d,
        answer
    } = body;
    const options = [option_a, option_b, option_c, option_d]
    const queryObj = {
        text: queries.updateQuestionById,
        values: [question, options, answer, imagename, id],
    };

    try{
        const { rowCount } = await db.query(queryObj);

        if (rowCount == 0) {
            return Promise.reject({
                status: "error",
                code: 500,
                message: "Could not update question",
            });
        }

        if (rowCount > 0){
            return Promise.resolve({
                status: "success",
                code: 201,
                response: "Assessment Questions updated Successfully.",
            });
        }
    } catch (e) {
        console.log(e);
        return Promise.reject({
            status: "error",
            code: 500,
            message: "Error updating Questions",
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

async function getAllAssessments() {
    const queryObj = {
        text: queries.findAllAssessments,
    };
    try {
        const { rows } = await db.query(queryObj);
        return Promise.resolve({
            status: "success",
            code: 200,
            response: "Successfully fetched all assessments",
            data: rows,
        });
    } catch (e) {
        return Promise.reject({
            status: "error",
            code: 500,
            message: "Error fetching assessments",
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

async function getApplicationIdFromApplicants(id){
    const queryObj = {
        text: queries.findApplicationIdByUserId,
        values: [id],
    };

    try{
        const { rowCount, rows } = await db.query(queryObj);
        if (rowCount == 0) {

            return Promise.reject({
                status: "error",
                code: 500,
                message: "Error finding application Id",
            });
        }
        if (rowCount > 0) {
            return Promise.resolve({
                status: "success",
                code: 200,
                message: "Application total error",
                appId: rows[0].application_id
            });
        }
    } catch(e) {
        console.log(e);
        return Promise.reject({
            status: "error",
            code: 500,
            message: "Error fetching application Id",
        });
    }
}


async function getAssessmentIdFromApplications(id){
    const queryObj = {
        text: queries.findAssessmentIdByApplicationId,
        values: [id],
    };

    try{
        const { rowCount, rows } = await db.query(queryObj);
        if (rowCount == 0) {

            return Promise.reject({
                status: "error",
                code: 500,
                message: "Error finding Assessment Id",
            });
        }
        if (rowCount > 0) {
            return Promise.resolve({
                status: "success",
                code: 200,
                response: "Successfully fetched Assessment Id",
                data: rows[0]
            });
        }
    } catch(e) {
        console.log(e);
        return Promise.reject({
            status: "error",
            code: 500,
            message: "Error fetching Assessment Id",
        });
    }
}



async function getQuestionsByAssessmentId(id){
    const queryObj = {
        text: queries.findQuestionsByAssessmentId,
        values: [id],
    };

    try{
        const { rowCount, rows } = await db.query(queryObj);
        if (rowCount == 0) {

            return Promise.reject({
                status: "error",
                code: 500,
                message: "Error finding Questions",
            });
        }
        if (rowCount > 0) {
            return Promise.resolve({
                status: "success",
                code: 200,
                response: "Successfully fetched Questions",
                data: rows
            });
        }
    } catch(e) {
        console.log(e);
        return Promise.reject({
            status: "error",
            code: 500,
            message: "Error fetching Questions",
        });
    }
}

async function updateAssessmentScoreByUserId(body, user_id){
    const {
        assessment_id,
        assessment_score
    } = body;
    const assessment_status = true;
    const status = 'Completed';
    const queryObj = {
        text: queries.updateApplicantScoreByUserId,
        values: [assessment_id, assessment_score, assessment_status, user_id, status],
    };

    try{
        const { rowCount, rows } = await db.query(queryObj);
        if (rowCount == 0) {

            return Promise.reject({
                status: "error",
                code: 500,
                message: "Error updating Assessment Score",
            });
        }
        if (rowCount > 0) {
            return Promise.resolve({});
        }
    } catch(e) {
        console.log(e);
        return Promise.reject({
            status: "error",
            code: 500,
            message: "Error Updating Assessment Results",
        });
    }
}

async function updateAssessmentStatusById(assessment_id){
    const status = 'Taken'
    const queryObj = {
        text: queries.updateAssessmentStatusById,
        values: [status, assessment_id],
    };

    try{
        const { rowCount, rows } = await db.query(queryObj);
        if (rowCount == 0) {

            return Promise.reject({
                status: "error",
                code: 500,
                message: "Error updating Assessment",
            });
        }
        if (rowCount > 0) {
            return Promise.resolve({
                status: "success",
                code: 200,
                response: "Assessment Updated Successfully",
            });
        }
    } catch(e) {
        console.log(e);
        return Promise.reject({
            status: "error",
            code: 500,
            message: "Error Updating Assessment",
        });
    }
}


async function uploadUserPic(image, user_id) {
    let imagename = null
    if(image){
        imagename = image.name;
        image.mv('upload_profile/'+imagename, (err) => {
            if (err) {
                console.log('Could Not Upload picture');
            }
            else{
                console.log(imagename)
            }
        })
    }

    const queryObj = {
        text: queries.uploadProfilePic,
        values: [imagename, user_id],
    };

    try{
        const { rowCount } = await db.query(queryObj);

        if (rowCount == 0) {
            return Promise.reject({
                status: "error",
                code: 500,
                message: "Could not upload profile",
            });
        }

        if (rowCount > 0){
            return Promise.resolve({
                status: "success",
                code: 201,
                response: "Picture uploaded Successfully.",
            });
        }
    } catch (e) {
        console.log(e);
        return Promise.reject({
            status: "error",
            code: 500,
            message: "Error uploading picture",
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
    uploadUserPic,
    // changeDestination,
    // parcelauthorisation,
    // checkParcelStatus,
    // changeStatus,
    // changeLocation,
    // getAllParcels,
    // getParcelsByUserId,
    // getParcelsByUserAndParcelId,
    UpdateQuestion,
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
    checkIfApplicationHasAssessment,
    checkIfApplicationExistsForAssessment,
    getApplicationIdFromApplicants,
    getAssessmentIdFromApplications,
    getQuestionsByAssessmentId,
    updateAssessmentStatusById,
    updateAssessmentScoreByUserId,
    getAllAssessments,
    getLatestApplicationDate,
    getLatestApplicationId,
    checkUserDetailsMatch,
};
