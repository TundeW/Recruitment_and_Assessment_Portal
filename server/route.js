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
    // createNewParcel,
    authorisationById,
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
        const role = "admin";
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
            if(result.data.user.role !== 'applicant'){
                return res.status(401).json({
                    message: "Not authorized to access this platform"
                })
            }
            const hasapplied = await checkIfUserHasApplied(result.data.user.id);


            const token = jwt.sign({_id: result.data.user.id, role: result.data.user.role}, process.env.TOKEN_SECRET);


            const userdet = (({ role, ...o }) => o)(result.data.user)

            res.header('auth', token).json({...result, data: {token}, user: {...userdet, application: hasapplied.response} });

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
            // const { application_id } = req.body;
            const cv = req.files.file;
            const user_id = req.user._id;
            await checkIfApplicationExists(2);
            await checkIfUserHasApplication(2, user_id);
            const result = await createNewApplicant(req.body, cv, user_id);
            const current = await getCurrentTotalApplications(2);
            await updateTotalApplications(2, current.total);
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
            const file = req.files.file;
            console.log('banana');
            const result = await createNewApplication(req.body, file, admin_id);
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


module.exports = router;
