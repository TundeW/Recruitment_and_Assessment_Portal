const express = require("express");
const { signupValidation, loginValidation } = require('./validation')
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();
const router = express.Router();
const {
    createNewUser,
    checkIfUserDoesNotExistBefore,
    checkIfEmailAndPasswordMatch,
    createNewApplication,
    createNewApplicant,
    createNewAssessment,
    createNewQuestion,
    getLatestApplicationDate,
    // createNewParcel,
    authorisationById,
    checkUserDetailsMatch,
    UpdateQuestion,
    // authenticationById,
    // changeDestination,
    // parcelauthorisation,
    // changeStatus,
    // checkParcelStatus,
    // changeLocation,
    // getAllParcels,
    // getParcelsByUserId,
    // getParcelsByUserAndParcelId,
    authenticationnByToken,
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
    checkIfApplicationExistsForAssessment,
    checkIfApplicationHasAssessment,
    getApplicationIdFromApplicants,
    getAssessmentIdFromApplications,
    getQuestionsByAssessmentId,
    updateAssessmentScoreByUserId,
    updateAssessmentStatusById,
    getAllAssessments,
    getLatestApplicationId,
    uploadUserPic,
} = require("./portalService");



router.post(
    "/auth/signup",
    (req, res, next) => {
        // LETS VALIDATE THE DATA
        const { error } = signupValidation(req.body);
        if(error) {
            return res.status(400).json({
                message: error.details[0].message.replace(/[\"]/gi, "")
            })
        }
        // const { first_name, last_name, email, password, state} = req.body;
        // if (!first_name || !last_name || !email || !password || !state) {
        //     return res.status(400).json({
        //         message: "Please fill all fields",
        //     });
        // }
        next();
    },
    async (req, res) => {
        const { email } = req.body;
        const role = "applicant";
        try{
            await checkIfUserDoesNotExistBefore(email);
            const result = await createNewUser(role, req.body);
            return res.status(201).json(result);
        } catch(e) {
            return res.status(e.code).json(e);
        }
    }
);

// router.post(
//     "/auth/admin/signup",
//     (req, res, next) => {
//         const { error } = signupValidation(req.body);
//         if(error) {
//             return res.status(400).json({
//                 message: error.details[0].message.replace(/[\"]/gi, "")
//             })
//         }
//         next();
//     },
//     async (req, res, next) =>{
//         const { auth } = req.headers;
//         const token = auth;
//         try {
//             await authenticationnByToken(token, req);
//             await authorisationById(req.user._id, "superadmin")
//
//         } catch(e) {
//             return res.status(e.code).json(e);
//         }
//         next();
//     },
//     async (req, res) => {
//         const { email } = req.body;
//         const type = "admin";
//         try{
//             await checkIfUserDoesNotExistBefore(email);
//             const result = await createNewUser(type, req.body);
//             return res.status(201).json(result);
//         } catch(e) {
//             return res.status(e.code).json(e);
//         }
//     }
// );

router.post(
    "/auth/login",
    (req, res, next) =>{
        const { error } = loginValidation(req.body);
        if(error) {
            return res.status(400).json({
                message: error.details[0].message.replace(/[\"]/gi, "")
            })
        }
        next();
    },
    async (req, res) => {
        try{
            const result = await checkIfEmailAndPasswordMatch(req.body);
            const app = await getLatestApplicationDate()
            console.log(app.latest)
            const latest_app = await getLatestApplicationId(app.latest)
            const latest_id = latest_app.data
            if(result.data.user.role !== 'applicant'){
                return res.status(401).json({
                    message: "Not authorized to access this platform"
                })
            }
            const hasapplied = await checkIfUserHasApplied(result.data.user.id);


            const token = jwt.sign({_id: result.data.user.id, role: result.data.user.role}, process.env.TOKEN_SECRET);


            const userdet = (({ role, ...o }) => o)(result.data.user)

            res.header('auth', token).json({...result, data: {token, latest_id}, user: {...userdet, application: hasapplied.response}  });

            // return res.status(200).json(result);
        } catch (e) {
            console.log(e)
            return res.status(e.code).json(e);
        }
    }
)

router.post(
    "/auth/admin/login",
    (req, res, next) =>{
        const { error } = loginValidation(req.body);
        if(error) {
            return res.status(400).json({
                message: error.details[0].message.replace(/[\"]/gi, "")
            })
        }
        next();
    },
    async (req, res) => {
        try{
            const result = await checkIfEmailAndPasswordMatch(req.body);
            if(result.data.user.role !== 'admin'){
                return res.status(401).json({
                    message: "Not authorized to access this platform"
                })
            }


            const token = jwt.sign({_id: result.data.user.id, role: result.data.user.role}, process.env.TOKEN_SECRET);


            const userdet = (({ role, ...o }) => o)(result.data.user)

            res.header('auth', token).json({...result, data: {token}, user: {...userdet} });

            // return res.status(200).json(result);
        } catch (e) {
            console.log(e)
            return res.status(e.code).json(e);
        }
    }
)

router.post(
    "/auth/apply",
    async (req, res, next) =>{
        // const { error } = loginValidation(req.body);
        // if(error) {
        //     return res.status(400).json({
        //         message: error.details[0].message.replace(/[\"]/gi, "")
        //     })
        // }

        const { auth } = req.headers;
        const token = auth;

        try {
            await authenticationnByToken(token, req);
            await authorisationById(req.user.role, "applicant");

        } catch(e) {
            return res.status(e.code).json(e);
        }

        next();
    },
    async (req, res) => {

        try{
            const { application_id } = req.body;
            if(!req.files){
                return res.status(400).json({message: 'Please Upload your CV'})
            }
            console.log('files')
            const user_id = req.user._id;
            const cv = req.files.file;
            await checkIfApplicationExists(application_id);
            await checkIfUserHasApplication(application_id, user_id);
            await checkUserDetailsMatch(req.body, user_id)
            const result = await createNewApplicant(req.body, cv, user_id);
            const current = await getCurrentTotalApplications(application_id);
            await updateTotalApplications(application_id, current.total);
            return res.status(201).json(result);

        } catch (e) {
            console.log(e)
            return res.status(e.code).json(e);
        }
    }
)

router.post(
    "/auth/admin/application/create",
    async (req, res, next) =>{
        const {
            batch_id,
            link,
            deadline,
            instructions,
        } = req.body;
        if (!batch_id || !link || !deadline || !instructions) {
            return res.status(400).json({
                message: "Please fill all fields",
            });
        }
        if (!req.files) {
            return res.status(400).json({
                message: "Please upload a file",
            });
        }
        const { auth } = req.headers;
        const token = auth;

        try {
            await authenticationnByToken(token, req);
            await authorisationById(req.user.role, "admin")

        } catch(e) {
            return res.status(e.code).json(e);
        }
        next();
    },
    async (req, res) => {
        const admin_id = req.user._id;
        try{
            const file = req.files.file;
            const result = await createNewApplication(req.body, file, admin_id);
            return res.status(201).json(result);

        } catch (e) {
            console.log(e)
            return res.status(e.code).json(e);
        }
    }
)

router.post(
    "/auth/admin/assessment/create",
    async (req, res, next) =>{
        // const { error } = loginValidation(req.body);
        // if(error) {
        //     return res.status(400).json({
        //         message: error.details[0].message.replace(/[\"]/gi, "")
        //     })
        // }
        const { auth } = req.headers;
        const token = auth;

        try {
            await authenticationnByToken(token, req);
            await authorisationById(req.user.role, "admin")

        } catch(e) {
            return res.status(e.code).json(e);
        }
        next();
    },
    async (req, res) => {
        const admin_id = req.user._id;
        const { application_id } = req.body
        try{
            await checkIfApplicationExistsForAssessment(application_id);
            await checkIfApplicationHasAssessment(application_id);
            const result = await createNewAssessment(req.body);
            return res.status(201).json(result);

        } catch (e) {
            console.log(e)
            return res.status(e.code).json(e);
        }
    }
)


router.post(
    "/auth/admin/question/create",
    async (req, res, next) =>{
        // const { error } = loginValidation(req.body);
        // if(error) {
        //     return res.status(400).json({
        //         message: error.details[0].message.replace(/[\"]/gi, "")
        //     })
        // }
        const { auth } = req.headers;
        const token = auth;

        try {
            await authenticationnByToken(token, req);
            await authorisationById(req.user.role, "admin")

        } catch(e) {
            return res.status(e.code).json(e);
        }
        next();
    },
    async (req, res) => {
        const admin_id = req.user._id;
        try{
            let image
            if(req.files){
                image = req.files.file;
            }

            const result = await createNewQuestion(req.body, image);
            return res.status(201).json(result);

        } catch (e) {
            console.log(e)
            return res.status(e.code).json(e);
        }
    }
)


router.get(
    "/profile",
    async (req, res, next) =>{
        const { auth } = req.headers;
        const token = auth;
        try{
            await authenticationnByToken(token, req);
        } catch(e) {
            return res.status(e.code).json(e);
        }
        next();
    },
    async (req, res) => {
        try {
            const result = await getUserProfileById(req.user._id);
            return res.status(200).json(result);
        } catch (e) {
            console.log(e);
            return res.status(e.code).json(e);
        }

    }
)

router.get(
    "/applicant/details",
    async (req, res, next) =>{
        const { auth } = req.headers;
        const token = auth;
        try{
            await authenticationnByToken(token, req);
            await authorisationById(req.user.role, "applicant")

        } catch(e) {
            return res.status(e.code).json(e);
        }
        next();
    },
    async (req, res) => {
        try {
            const result = await getApplicantById(req.user._id);
            return res.status(200).json(result);
        } catch (e) {
            console.log(e);
            return res.status(e.code).json(e);
        }

    }
)


router.get(
    "/application/details",
    async (req, res, next) =>{
        const { auth } = req.headers;
        const token = auth;
        try{
            await authenticationnByToken(token, req);
            await authorisationById(req.user.role, "admin")

        } catch(e) {
            return res.status(e.code).json(e);
        }
        next();
    },
    async (req, res) => {
        try {
            const result = await getAllApplications();
            return res.status(200).json(result);
        } catch (e) {
            console.log(e);
            return res.status(e.code).json(e);
        }

    }
)

router.get(
    "/applicants/all",
    async (req, res, next) =>{
        const { auth } = req.headers;
        const token = auth;
        try{
            await authenticationnByToken(token, req);
            await authorisationById(req.user.role, "admin")

        } catch(e) {
            return res.status(e.code).json(e);
        }
        next();
    },
    async (req, res) => {
        try {
            const result = await getAllApplicants();
            return res.status(200).json(result);
        } catch (e) {
            console.log(e);
            return res.status(e.code).json(e);
        }

    }
)


router.get(
    "/assessments/all",
    async (req, res, next) =>{
        const { auth } = req.headers;
        const token = auth;
        try{
            await authenticationnByToken(token, req);
            await authorisationById(req.user.role, "admin")

        } catch(e) {
            return res.status(e.code).json(e);
        }
        next();
    },
    async (req, res) => {
        try {
            const result = await getAllAssessments();
            return res.status(200).json(result);
        } catch (e) {
            console.log(e);
            return res.status(e.code).json(e);
        }

    }
)


router.get(
    "/applicants/results",
    async (req, res, next) =>{
        const { auth } = req.headers;
        const token = auth;
        try{
            await authenticationnByToken(token, req);
            await authorisationById(req.user.role, "admin")

        } catch(e) {
            return res.status(e.code).json(e);
        }
        next();
    },
    async (req, res) => {
        try {
            const result = await getAllApplicantsWithScore();
            return res.status(200).json(result);
        } catch (e) {
            console.log(e);
            return res.status(e.code).json(e);
        }

    }
)

router.get(
    "/assessments",
    async (req, res, next) =>{
        const { auth } = req.headers;
        const token = auth;
        try{
            await authenticationnByToken(token, req);
            await authorisationById(req.user.role, "applicant");
        } catch(e) {
            return res.status(e.code).json(e);
        }
        next();
    },
    async (req, res) => {
        try {
            const applicantsRes = await getApplicationIdFromApplicants(req.user._id);
            const application_id = applicantsRes.appId;
            const assessmentRes = await getAssessmentIdFromApplications(application_id);
            const assessment_id = assessmentRes.data.id;
            const result = await getQuestionsByAssessmentId(assessment_id)
            return res.status(200).json({...result, assessment: assessmentRes.data});
        } catch (e) {
            console.log(e);
            return res.status(e.code).json(e);
        }

    }
)

router.put(
    "/assessment/score",
    async (req, res, next) =>{
        const { auth } = req.headers;
        const token = auth;
        try{
            await authenticationnByToken(token, req);
            await authorisationById(req.user.role, "applicant");
        } catch(e) {
            return res.status(e.code).json(e);
        }
        next();
    },
    async (req, res) => {
        try {
            const { assessment_id } = req.body
            await updateAssessmentScoreByUserId(req.body, req.user._id);
            const result = await updateAssessmentStatusById(assessment_id);
            return res.status(200).json(result);
        } catch (e) {
            console.log(e);
            return res.status(e.code).json(e);
        }

    }
)


router.put(
    "/auth/admin/question/update",
    async (req, res, next) =>{
        // const { error } = loginValidation(req.body);
        // if(error) {
        //     return res.status(400).json({
        //         message: error.details[0].message.replace(/[\"]/gi, "")
        //     })
        // }
        const { auth } = req.headers;
        const token = auth;

        try {
            await authenticationnByToken(token, req);
            await authorisationById(req.user.role, "admin")

        } catch(e) {
            return res.status(e.code).json(e);
        }
        next();
    },
    async (req, res) => {
        const admin_id = req.user._id;
        try{
            let image
            if(req.files){
                image = req.files.file;
            }

            const result = await UpdateQuestion(req.body, image);
            return res.status(201).json(result);

        } catch (e) {
            console.log(e)
            return res.status(e.code).json(e);
        }
    }
)

// router.get(
//     "admin/assessments",
//     async (req, res, next) =>{
//         const { auth } = req.headers;
//         const token = auth;
//         try{
//             await authenticationnByToken(token, req);
//             await authorisationById(req.user.role, "admin");
//         } catch(e) {
//             return res.status(e.code).json(e);
//         }
//         next();
//     },
//     async (req, res) => {
//         try {
//             const { assessment_id } = req.body
//             const result = await getQuestionsByAssessmentId(assessment_id)
//             return res.status(200).json({...result, assessment: assessmentRes.data});
//         } catch (e) {
//             console.log(e);
//             return res.status(e.code).json(e);
//         }
//
//     }
// )

router.get(
    "/admin/assessment",
    async (req, res, next) =>{
        const { auth } = req.headers;
        const token = auth;
        try{
            await authenticationnByToken(token, req);
            await authorisationById(req.user.role, "admin");
        } catch(e) {
            return res.status(e.code).json(e);
        }
        next();
    },
    async (req, res) => {
        try {
            const { assessment_id } = req.headers
            const result = await getQuestionsByAssessmentId(assessment_id)
            return res.status(200).json({...result});
        } catch (e) {
            console.log(e);
            return res.status(e.code).json(e);
        }

    }
)

router.put(
    "/auth/profile/picture",
    async (req, res, next) =>{
        // const { error } = loginValidation(req.body);
        // if(error) {
        //     return res.status(400).json({
        //         message: error.details[0].message.replace(/[\"]/gi, "")
        //     })
        // }
        const { auth } = req.headers;
        const token = auth;

        try {
            await authenticationnByToken(token, req);

        } catch(e) {
            return res.status(e.code).json(e);
        }
        next();
    },
    async (req, res) => {
        const user_id = req.user._id;
        try{
            let image = req.files.file;
            if(req.files){
                image = req.files.file;
            }else{
                console.log('no file uploaded')
            }
            console.log(image)
            const result = await uploadUserPic(image, user_id);
            return res.status(201).json(result);

        } catch (e) {
            console.log(e)
            return res.status(e.code).json(e);
        }
    }
)

// router.post(
//     "/auth/admin/assessment/create",
//     async (req, res, next) =>{
//         // const { error } = loginValidation(req.body);
//         // if(error) {
//         //     return res.status(400).json({
//         //         message: error.details[0].message.replace(/[\"]/gi, "")
//         //     })
//         // }
//         const { auth } = req.headers;
//         const token = auth;
//
//         try {
//             await authenticationnByToken(token, req);
//             await authorisationById(req.user.role, "admin")
//
//         } catch(e) {
//             return res.status(e.code).json(e);
//         }
//         next();
//     },
//     async (req, res) => {
//         const admin_id = req.user._id;
//         try{
//             const file = req.files.file;
//             console.log('banana');
//             const result = await createNewApplication(req.body, file, admin_id);
//             return res.status(201).json(result);
//
//         } catch (e) {
//             console.log(e)
//             return res.status(e.code).json(e);
//         }
//     }
// )


module.exports = router;
