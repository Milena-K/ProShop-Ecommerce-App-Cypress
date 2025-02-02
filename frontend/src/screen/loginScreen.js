import React, {useState , useEffect} from 'react'
import {Link} from 'react-router-dom'
import { Form , Button , Row , Col } from 'react-bootstrap'
import { useDispatch , useSelector } from 'react-redux'
import Message from '../Components/Message'
import FormContainer from '../Components/formContainer'
import Loader from '../Components/Loader'
import {login } from '../actions/userActions'

function LoginScreen({ location , history}) {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const dispatch = useDispatch()

    const userLogin=useSelector(state =>  state.userLogin )
    const {loading , error , userInfo} = userLogin

    const redirect=location.search ? location.search.split('=')[1] :"/"

    useEffect(()=>{
      if (userInfo) {

          history.push(redirect)
      }
    }, [history , userInfo , redirect])

    const submitHandler=(e)=>{
        e.preventDefault()

        dispatch(login(email, password ))        
    }

    return (
        <FormContainer>
            <h1>Sign In</h1>
            {error && <Message data-cy="signin-error" variant="danger">{error}</Message>}
            {loading &&  <Loader/> }
            <Form onSubmit={submitHandler}>
                <Form.Group controlId="email">
                    
                    <Form.Label>Email Adress</Form.Label>
                    <Form.Control data-cy="email" type="email"  placeholder="Enter Email Address"
                     value={email} onChange={(e) => setEmail(e.target.value)}  ></Form.Control>

                </Form.Group> 
                {/* password group */}
                <Form.Group controlId="password">
                    
                    <Form.Label>Password</Form.Label>
                    <Form.Control data-cy="password" type="password"  placeholder="Enter Correct Password"
                     value={password} onChange={(e) => setPassword(e.target.value)}  ></Form.Control>

                </Form.Group>    
                <Button type="submit"  variant="primary" className="mt-3" >Sign In</Button>
            </Form>            
        <Row className='py-3'>
        <Col>
          New Customer?{' '}
          <Link to={redirect ? `/register?redirect=${redirect}` : '/register'}>
            Register
          </Link>
        </Col>
      </Row>
        </FormContainer>
    )
}

export default LoginScreen
