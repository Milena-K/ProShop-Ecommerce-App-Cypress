import React from 'react'
import {Alert} from 'react-bootstrap'

function Message(props) {
    return (
        <Alert data-cy="signin-error" variant={props.variant}>
            
          {props.children}

        </Alert>

    )
}

// Message.defaultProps = {
//     variant:"info"
// }


export default Message
