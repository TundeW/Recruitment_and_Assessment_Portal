import React, { Component } from 'react';
import './adminDb.css';
import DashBoard from '../../Components/dashboad/dashBoard';
import blue from '../../Components/mainicons/bluerec.svg';
import green from '../../Components/mainicons/greenrec.svg';
import orange from '../../Components/mainicons/orangerec.svg';
import navicon from '../../Components/mainicons/navicon.svg';
import SideBar from '../../Components/sidebar/sideBar';
import TopHistory from '../../Components/topHistory/topHistory';
import AssessHead from '../../Components/Assessment/assessHead';
import IconLevel from '../../Components/iconLevel/iconLevel';
import History from '../../Components/history/history'

class AdminDb extends Component {
    state = {
        applications: []
    }

    // console.log(application)
    // console.log(setApplication)

    componentDidMount() {
        const token = localStorage.getItem("token")
        const requestOptions = {
            method: 'get',
            headers: {
                'Content-Type': 'application/json',
                'auth': token
            },
            // mode: 'no-cors'
        };


        const url = 'http://localhost:5000/api/v1/application/details';


        fetch(url, requestOptions)
            .then(response => response.json())
            .then(data => {
                if (data.message) {
                    // Here you should have logic to handle invalid creation of a user.
                    // This assumes your Rails API will return a JSON object with a key of
                    // 'message' if there is an error with creating the user, i.e. invalid username
                    console.log(data.message)
                } else {
                    console.log(data.response)
                    console.log(data)
                    // console.log(data.data.token)
                    // console.log(data.data)
                    this.setState({
                        applications: data.data
                    })
                    // console.log(this.state)
                    // console.log(this.state['0'].length)
                    // console.log(apple)
                }
            })
            .catch(error => console.log(error));

        // const apple = this.state['0'].length

    }


    // current = this.state.applications.filter(c => c.batch_id == 2)

    //current_total = this.current[0].applications_total


    changeDateformat = (date_of_birth) =>{
        const birthDate = new Date(date_of_birth);
        const raw_day = birthDate.getDate()
        const day = `0${raw_day}`
        const raw_month = birthDate.getMonth() + 1
        const month = `0${raw_month}`
        const year = birthDate.getFullYear().toString()
        return day.slice(-2) + '/' + month.slice(-2) + '/' + year.slice(2)
    }

    tot = () => {
        const total = 0
        this.state.applications.map(a => {
            total += a.applications_total
        })
        return total
    }
    total = this.tot()


    // curr = () =>{
    //     const total = 0
    //     const result = this.state.applications.filter(c => c.batch_id == 2)
    //     const obj = result
    //     console.log(obj)
    //     return obj
    // }
    //
    // current = this.curr()

    curr = () => {
        const total = 0
        const result = this.state.applications.filter(c => c.batch_id == 2)
        console.log(total)
        console.log(result)
        // result.applications.map(a => {
        //     total += a.applications_total
        // })
        return total
    }
    current = this.curr()



    render(){
        console.log('app')
        const result = this.state.applications.filter(c => c.batch_id == 2)
        const obj = this.state.applications.filter(c => c.batch_id == 2)[0]
        console.log(obj)
        return (
            <div className='mainpage'>
                <div><SideBar /></div>
                <div className='dashboard' >
                    <p className='dashtext'>Dashboard</p>
                    <div className='dashboard-section'>
                        <DashBoard app='Current Applications' num={this.current} icon={blue} text2='Academy 2.0' />
                        <DashBoard app='Total Applications' num={this.total} icon={green} text2='All entries so far' />
                        <DashBoard app='Academys' num={this.state.applications.length} icon={orange} text2='So far' />
                    </div>
                    <div>
                        <IconLevel navicon={navicon} />
                    </div>
                    <div className='history'>
                        <div className='history-section'>
                            {this.state.applications.map(a => {
                                return(
                                    <div key = {a.batch_id} className = 'history-list'>
                                        <span>Academy Batch {a.batch_id} </span>
                                        <span>{a.applications_total} Students</span>
                                        <span>Created at {this.changeDateformat(a.created_at)}</span>
                                    </div>
                                )
                            })}
                        </div>
                        <div className='assessment-section'>
                            <AssessHead text='Create Assessment' />
                        </div>
                    </div>
                </div>
            </div>
        )
    }

}

export default AdminDb;