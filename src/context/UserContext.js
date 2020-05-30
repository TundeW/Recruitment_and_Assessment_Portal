import React, { createContext, Component } from 'react';

export const UserContext = createContext();

class UserContextProvider extends Component {
    state = {
        first_name: "",
        last_name: "",
        email: ""
    }

    componentWillMount() {
        const token = localStorage.getItem("token")
        const requestOptions = {
            method: 'get',
            headers: {
                'Content-Type': 'application/json',
                'auth': token
            },
            // mode: 'no-cors'
        };

        const url = 'http://localhost:5000/api/v1/profile';


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
                    // console.log(data.data.token)
                    // console.log(data.user)
                    this.setState(
                        {
                            first_name: data.data.first_name,
                            last_name: data.data.last_name,
                            email: data.data.email
                        }
                    )
                }
            })
            .catch(error => console.log(error));


    }


    render (){
        return (
            <UserContext.Provider value={{...this.state}}>
                {this.props.children}
            </UserContext.Provider>
        )
    }
}

export default UserContextProvider;
