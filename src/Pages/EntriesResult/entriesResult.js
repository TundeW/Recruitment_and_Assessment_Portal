import React, { useState, useEffect } from 'react';
import './entriesResult.css';
import SideBar from '../../Components/sidebar/sideBar';
import down from '../../Components/mainicons/down.svg';
import up from '../../Components/mainicons/up.svg';
import IconLevel from '../../Components/iconLevel/iconLevel';
import navicon from '../../Components/mainicons/navicon.svg';

const BatchPage = (props) => {

    const [sortby, setSortby] = useState('default')
    const [batch, setBatch] = useState(1)

    const [entries, setEntries] = useState([])

    useEffect(()=>{
        const token = localStorage.getItem('token')
        const requestOptions = {
            method: 'get',
            headers: {
                'Content-Type': 'application/json',
                'auth': token
            }
        }

        const url = 'http://localhost:5000/api/v1/applicants/results';

        fetch(url, requestOptions).then(response => response.json()).then(data=>{
            if (data.message){
                console.log(data.message)
            }else{
                console.log(data.response)
                console.log(data.data)
                const copy = [...data.data]
                const copies = copy.map(c => ({...c, age: calculateAge(c.date_of_birth), birthdate: changeDateformat(c.date_of_birth)}))
                console.log(copies)
                setEntries([...copies])
            }
        })
    },[])

    const handleChange = (e) => {
        let text = e.target.value;
        let batchId = parseInt(text.slice(5));
        setBatch(batchId);
    }

    const message='Comprises of all that applied for ' + batch.selectValue;

    useEffect(() => {
        const copy = [...entries]
        const copies = copy.map(c => ({...c, age: calculateAge(c.date_of_birth), birthdate: changeDateformat(c.date_of_birth)}))
        console.log(copies)
        setEntries([...copies])
    }, []);

    const cgpaSortUp = () => {
        setSortby('CgpaSortUp')
    }

    const cgpaSortDown = () => {
        setSortby('CgpaSortDown')
    }

    const scoreSortUp = () => {
        setSortby('ScoreSortUp')
    }

    const scoreSortDown = () => {
        setSortby('ScoreSortDown')
    }

    const ageSortUp = () => {
        setSortby('AgeSortUp')
    }

    const ageSortDown = () => {
        setSortby('AgeSortDown')
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
        AgeSortUp: {
            class: 'age-sort-up',
            fn: (a, b) => a.age - b.age
        },
        AgeSortDown: {
            class: 'age-sort-down',
            fn: (a, b) => b.age - a.age
        },
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

    // const sortType = {
    //     AgeSortUp: {
    //         class: 'age-sort-up',
    //         fn: (a, b) => a.age - b.age
    //     },
    //     AgeSortDown: {
    //         class: 'age-sort-down',
    //         fn: (a, b) => b.age - a.age
    //     },
    //     default: {
    //         class: 'sort',
    //         fn: (a, b) => a
    //     }
    // }

    const calculateAge = (date_of_birth) => {
        const birthDate = new Date(date_of_birth);
        const birthYear = birthDate.getFullYear()
        const thisYear = new Date().getFullYear()

        return thisYear - birthYear
    }

    const changeDateformat = (date_of_birth) =>{
        const birthDate = new Date(date_of_birth);
        const month = birthDate.getMonth() + 1
        return birthDate.getDate() + '/' + month + '/' + birthDate.getFullYear()
    }



    const filterTable = (batch) =>{
        return entries.filter(entr=> entr.application_id == {batch})
    }
    let applicants = filterTable(batch)

    return (

        <div>
            <SideBar selected='Result' history={props.history}/>
            <div className='result'>
                <div className='result-select'>
                    <div className='result-entries'>
                        <p id='result-entry-text'>Entries - </p>
                        <select value={batch.selectValue} onChange={handleChange}>
                            <option> Batch 1 </option>
                            <option> Batch 2 </option>
                            <option> Batch 3 </option>
                            <option> Batch 4 </option>
                        </select>
                    </div>
                    <p id='result-entry-text2'>{`Comprises of all that applied for batch ${batch}`}</p>
                </div>
                <div className='ent-table'>
                    {entries.length !== 0 ?
                        <table className= 'entrytable'>
                            <thead className='thead'>
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th id='age'>DOB - Age <img src={up} id='agebtn' onClick={ageSortUp} /> <img src={down} id='agebtn2' onClick={ageSortDown} /></th>
                                    <th>Address</th>
                                    <th>University</th>
                                    <th id='cgpa'>CGPA <img src={up} id='cgpabtn' onClick={cgpaSortUp} /> <img src={down} id='cgpabtn2' onClick={cgpaSortDown} /> </th>
                                    <th id='score'>Test Scores <img src={up} id='scorebtn' onClick={scoreSortUp} /> <img src={down} id='scorebtn2' onClick={scoreSortDown} /> </th>

                                </tr>
                            </thead>
                            <tbody className= 'tbody'>
                                {[...entries].sort((sortTypes[sortby].fn)).filter(entr=> {return entr.application_id == batch}).map((entry, id) => {
                                    return (
                                        <tr key={entry.id} className= 'tr'>
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


    );
}

export default BatchPage;
