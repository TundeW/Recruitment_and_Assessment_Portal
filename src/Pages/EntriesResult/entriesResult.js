import React, { useState, useEffect } from 'react';
import './entriesResult.css';
import SideBar from '../../Components/sidebar/sideBar';
import down from '../../Components/mainicons/down.svg';
import up from '../../Components/mainicons/up.svg';
import IconLevel from '../../Components/iconLevel/iconLevel';
import navicon from '../../Components/mainicons/navicon.svg'

function EntriesResult() {

    const [sortby, setSortby] = useState('default')
    const [sortAge, setSortAge] = useState('default')
    const [sortScore, setSortScore] = useState('default')

    const [entries, setEntries] = useState(
        [
            { id: 1, first_name: 'Peter', last_name: 'Pan', email: 'joe@gmail.com', date_of_birth: '1991-05-26T15:14:14.000Z', address: 'Enyata location', university: 'University of Nigeria', cgpa: 5.0, application_id: 1, assessment_score: 25 },
            { id: 2, first_name: 'Parker', last_name: 'Pan', email: 'joe@gmail.com', date_of_birth: '1993-05-26T15:14:14.000Z', address: 'Enyata location', university: 'University of Nigeria', cgpa: 5.0, application_id: 1, assessment_score: 25 },
            { id: 3, first_name: 'Paul', last_name: 'Pan', email: 'joe@gmail.com', date_of_birth: '1993-05-26T15:14:14.000Z', address: 'Enyata location', university: 'University of Nigeria', cgpa: 4.40, application_id: 1, assessment_score: 25 },
            { id: 4, first_name: 'Matt', last_name: 'Pan', email: 'joe@gmail.com', date_of_birth: '2000-05-26T15:14:14.000Z', address: 'Enyata location', university: 'University of Nigeria', cgpa: 4.21, application_id: 2, assessment_score: 25 },
            { id: 5, first_name: 'Mark', last_name: 'Pan', email: 'joe@gmail.com', date_of_birth: '1990-05-26T15:14:14.000Z', address: 'Enyata location', university: 'University of Nigeria', cgpa: 3.80, application_id: 2, assessment_score: 25 },
            { id: 6, first_name: 'Mani', last_name: 'Pan', email: 'joe@gmail.com', date_of_birth: '1992-05-26T15:14:14.000Z', address: 'Enyata location', university: 'University of Nigeria', cgpa: 3.5, application_id: 2, assessment_score: 25 },
            { id: 7, first_name: 'Ben', last_name: 'Pan', email: 'joe@gmail.com', date_of_birth: '1998-05-26T15:14:14.000Z', address: 'Enyata location', university: 'University of Nigeria', cgpa: 5.0, application_id: 3, assessment_score: 25 },
            { id: 8, first_name: 'Bart', last_name: 'Pan', email: 'joe@gmail.com', date_of_birth: '1999-05-26T15:14:14.000Z', address: 'Enyata location', university: 'University of Nigeria', cgpa: 4.91, application_id: 3, assessment_score: 25 },
            { id: 9, first_name: 'Bull', last_name: 'Pan', email: 'joe@gmail.com', date_of_birth: '1997-05-26T15:14:14.000Z', address: 'Enyata location', university: 'University of Nigeria', cgpa: 3.67, application_id: 3, assessment_score: 25 }
        ]
    )

    useEffect(() => {
        const copy = [...entries]
        const copies = copy.map(c => ({ ...c, age: calculateAge(c.date_of_birth), birthdate: changeDateformat(c.date_of_birth) }))
        console.log(copies)
        setEntries([...copies])
    }, []);

    const cgpaSortUp = () => {
        setSortby('CgpaSortUp')
    }

    const cgpaSortDown = () => {
        setSortby('CgpaSortDown')
    }

    const ageSortUp = () => {
        setSortAge('AgeSortUp')
    }

    const ageSortDown = () => {
        setSortAge('AgeSortDown')
    }

    const scoreSortUp = () => {
        setSortScore('ScoreSortUp')
    }

    const scoreSortDown = () => {
        setSortScore('ScoreSortDown')
    }


    const sortTypes = {
        CgpaSortUp: {
            class: 'cgpa-sort-up',
            fn: (a, b) => a.cgpa - b.cgpa
        },
        CgpaSortDown: {
            class: 'cgpa-sort-down',
            fn: (a, b) => b.cgpa - a.cgpa
        },
        default: {
            class: 'sort',
            fn: (a, b) => a
        }
    }

    const sortType = {
        AgeSortUp: {
            class: 'age-sort-up',
            fn: (a, b) => a.age - b.age
        },
        AgeSortDown: {
            class: 'age-sort-down',
            fn: (a, b) => b.age - a.age
        },
        default: {
            class: 'sort',
            fn: (a, b) => a
        }
    }

    const sortKind = {
        ScoreSortUp: {
            class: 'score-sort-up',
            fn: (a, b) => a.assessment_score - b.assessment_score
        },
        ScoreSortDown: {
            class: 'score-sort-down',
            fn: (a, b) => b.assessment_score - a.assessment_score
        },
        default: {
            class: 'sort',
            fn: (a, b) => a
        }
    }


    const calculateAge = (date_of_birth) => {
        const birthDate = new Date(date_of_birth);
        const birthYear = birthDate.getFullYear()
        const thisYear = new Date().getFullYear()

        return thisYear - birthYear
    }

    const changeDateformat = (date_of_birth) => {
        const birthDate = new Date(date_of_birth);
        const month = birthDate.getMonth() + 1
        return birthDate.getDate() + '/' + month + '/' + birthDate.getFullYear()
    }

    return (

        <div>
            <SideBar />
            <div className='batch'>
                <div className='batch-select'>
                    <div className='entries'>
                        <p id='entry-text'>Entries - </p>
                        <select >
                            <option> Batch 1 </option>
                            <option> Batch 2 </option>
                            <option> Batch 3 </option>
                        </select>
                    </div>
                    <p id='entry-text2'>Comprises of all that applied for batch 2</p>
                </div>
                <div className='ent-table'>
                    {entries.length !== 0 ?
                        <table>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th id='ent-age'>DOB - Age <img src={up} id='ent-agebtn' onClick={ageSortUp} /> <img src={down} id='agebtn2' onClick={ageSortDown} /></th>
                                    <th>Address</th>
                                    <th>University</th>
                                    <th id='rnt-cgpa'>CGPA <img src={up} id='ent-cgpabtn' onClick={cgpaSortUp} /> <img src={down} id='cgpabtn2' onClick={cgpaSortDown} /> </th>
                                    <th id='score'>Test Score <img src={up} id='scorebtn' onClick={scoreSortUp} /> <img src={down} id='scorebtn2' onClick={scoreSortDown} /> </th>
                                </tr>
                            </thead>
                            <tbody>
                                {[...entries].sort((sortTypes[sortby].fn )).map((entry, id) => {
                                    return (
                                        <tr key={entry.id} >
                                            <td>{entry.first_name + ' ' + entry.last_name}</td>
                                            <td>{entry.email}</td>
                                            <td>{entry.birthdate} - {entry.age} </td>
                                            <td>{entry.address}</td>
                                            <td>{entry.university}</td>
                                            <td>{entry.cgpa}</td>
                                            <td>{entry.assessment_score}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table> : <div>There are no applications to review</div>
                    }
                </div>
            </div>
        </div>
    )
}

export default EntriesResult
