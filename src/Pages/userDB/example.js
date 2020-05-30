import React, { useEffect, useState } from 'react';

const Example = () => {
    const [state, setState] = useState()


    useEffect(()=>{
        setState( 'cow')
        setTimeout(()=>{console.log(state)}, 5000)

    }, [])

    return(
        <div>
        <div>I am a boy</div>
        <div> {state} </div>
        </div>
    )
}

export default Example
