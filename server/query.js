const queries = {
    addNewUser: `
    INSERT INTO users(
        first_name,
        last_name,
        email,
        phone_number,
        password,
        role,
        usercreated_at,
        updated_at
    ) VALUES($1, $2, $3, $4, crypt( $5, gen_salt('bf')), $6, $7, $8 ) RETURNING *`,

    findUserByEmail:`
    SELECT * FROM users WHERE email=($1)
    `,

    findUserByEmailAndPassword:`
    SELECT id, first_name, last_name, email, role FROM users WHERE email=($1) AND password=crypt($2, password)
    `,


    findApplicationById:`
    SELECT * FROM applications WHERE batch_id=($1)
    `,

    findApplicantByApplicationAndUserId:`
    SELECT * FROM applicants WHERE application_id=($1) AND user_id=($2)
    `,


    findApplicantByUserId:`
    SELECT * FROM applicants WHERE user_id=($1)
    `,

    addNewApplicant: `
    INSERT INTO applicants(
        user_id,
        application_id,
        first_name,
        last_name,
        email,
        date_of_birth,
        address,
        university,
        course,
        cgpa,
        cv,
        status,
        assessment_status,
        created_at,
        updated_at
    ) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15 ) RETURNING *`,

    addNewApplication: `
    INSERT INTO applications(
        batch_id,
        admin_id,
        link,
        deadline,
        instructions,
        file,
        applications_total,
        created_at,
        updated_at
    ) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9 ) RETURNING *`,

    addNewAssessment: `
    INSERT INTO assessments(
        application_id,
        questions_total,
        timelimit,
        created_at,
        updated_at
    ) VALUES($1, $2, $3, $4, %5) RETURNING *`,

    addNewQuestion: `
    INSERT INTO questions(
        assessment_id,
        question,
        options,
        answer,
        image
    ) VALUES($1, $2, $3, $4, %5) RETURNING *`,

    findUserById: `
      SELECT first_name, last_name, email, file FROM users WHERE id=($1)
    `,

    findApplicantsById: `
      SELECT status, created_at, assessment_status FROM applicants WHERE user_id=($1)
    `,

    findAllApplications: `
      SELECT * FROM applications
    `,

    findAllApplicants: `
      SELECT * FROM applicants
    `,

    findAllApplicantsWithScore: `
      SELECT * FROM applicants WHERE assessment_score IS NOT NULL
    `,


    findApplicationTotalById: `
      SELECT applications_total FROM applications WHERE batch_id=($1)
    `,

    updateApplicationByBatchId: `
    UPDATE applications SET applications_total=($2) WHERE batch_id=($1)
  `,

};

module.exports = queries;
