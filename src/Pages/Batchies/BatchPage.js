import React, { useState, useEffect } from 'react';
import './batchPage.css';
import SideBar from '../../Components/sidebar/sideBar';
import down from '../../Components/mainicons/down.svg';
import up from '../../Components/mainicons/up.svg';
import IconLevel from '../../Components/iconLevel/iconLevel';
import navicon from '../../Components/mainicons/navicon.svg';

const BatchPage = (props) => {

    const [sortby, setSortby] = useState('default')
    const [batch, setBatch] = useState(1)
    const [apps, setApps] = useState([])

    const [entries, setEntries] = useState([])

    useEffect(()=>{
        const token = localStorage.getItem('token')
        if(!token){
            props.history.push({
                pathname: '/admin/login'
            })
        }
        const requestOptions = {
            method: 'get',
            headers: {
                'Content-Type': 'application/json',
                'auth': token
            }
        }

        const url = 'http://localhost:5000/api/v1/applicants/all';

        fetch(url, requestOptions).then(response => response.json()).then(data=>{
            if (data.message){
                console.log(data.message)
            }else{
                console.log(data.response)
                // console.log(data.data)
                const copy = [...data.data]
                const copies = copy.map(c => ({...c, age: calculateAge(c.date_of_birth), birthdate: changeDateformat(c.date_of_birth)}))
                // console.log(copies)
                setEntries([...copies])
                let applications=[];
                let arr = [...data.data]
                arr.map(a =>( applications.push(a.application_id)))
                // console.log(applications)
                let unique = [...new Set(applications)]
                // console.log(unique)
                let apps = unique.sort()
                console.log(apps)
                setApps([...apps])
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



    // const filterTable = (batch) =>{
    //     return entries.filter(entr=> entr.application_id == {batch})
    // }
    // let applicants = filterTable(batch)

    return (

        <div>
            <SideBar selected='Application Entries' history={props.history}/>
            <div className='batch'>
                <div className='batch-select'>
                    <div className='entries'>
                        <p id='entry-text'>Entries - </p>
                        <select value={batch.selectValue} onChange={handleChange}>
                            {apps.map(app => {
                                return (
                                    <option>Batch {app}</option>
                                )
                            })}
                        </select>
                    </div>
                    <p id='entry-text2'>{`Comprises of all that applied for batch ${batch}`}</p>
                </div>
                <div className='table'>
                    {entries.length !== 0 ?
                        <table>
                            <thead>
                                <tr className='batch_tr'>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th id='age'>DOB - Age <img src={up} id='agebtn' onClick={ageSortUp} /> <img src={down} id='agebtn2' onClick={ageSortDown} /></th>
                                    <th>Address</th>
                                    <th>University</th>
                                    <th id='cgpa'>CGPA <img src={up} id='cgpabtn' onClick={cgpaSortUp} /> <img src={down} id='cgpabtn2' onClick={cgpaSortDown} /> </th>
                                </tr>
                            </thead>
                            <tbody>
                                {[...entries].sort((sortTypes[sortby].fn)).filter(entr=> {return entr.application_id == batch}).map((entry, id) => {
                                    return (
                                        <tr key={entry.id} className='entry_row'>
                                            <td>{entry.first_name + ' ' + entry.last_name}</td>
                                            <td>{entry.email}</td>
                                            <td>{entry.birthdate} - {entry.age} </td>
                                            <td>{entry.address}</td>
                                            <td>{entry.university}</td>
                                            <td>{entry.cgpa}</td>

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
