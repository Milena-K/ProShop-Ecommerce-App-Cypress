import React from 'react'
import { LinkContainer } from "react-router-bootstrap"
import {Route} from 'react-router-dom'
import {useDispatch , useSelector} from "react-redux"
import { Navbar, Nav, Container, NavDropdown } from "react-bootstrap"
import {logout } from  "../actions/userActions"
import SearchBox from './SearchBox'


const Header = () => {

    const dispatch = useDispatch()
    const userLogin =useSelector((state) => state.userLogin)
    const {userInfo} = userLogin

    const logoutHandler=()=>{

        // console.log('logout')
        dispatch(logout())
    }

    return (
        <div>

            <header>
                <Navbar bg="dark" variant="dark" expand="lg" collapseOnSelect data-cy="navbar">
                    <Container>
                        <LinkContainer to="/">
                            <Nav.Link >
                                <Navbar.Brand>Vvork-Tech-Store</Navbar.Brand>
                            </Nav.Link>
                        </LinkContainer>
                        <Navbar.Toggle aria-controls="basic-navbar-nav " />
                      <Navbar.Collapse style={{justifyContent:'space-evenly'}} id="basic-navbar-nav ">
                            <Route render={({history}) => <SearchBox history={history}/>}/>
                            <Nav className="ml-auto">
                              <LinkContainer to="/cart" style={{paddingTop:'20px'}}>
                                    <Nav.Link > <i className="fas fa-shopping-cart"></i>Cart</Nav.Link>
                                </LinkContainer>
                                { userInfo  ? (
                                  <NavDropdown data-cy="username" title={userInfo.name} id="username" style={{marginTop:'9px'}}>

                                        <LinkContainer to="/profile">
                                            <NavDropdown.Item>Profile</NavDropdown.Item>
                                        </LinkContainer>
                                        <NavDropdown.Item onClick={logoutHandler}>Logout</NavDropdown.Item>
                                    </NavDropdown>

                                 ) : <LinkContainer to="/login" style={{paddingTop:'20px'}}>
                                     <Nav.Link><i className="fas fa-user"></i>Sign In</Nav.Link>
                             </LinkContainer>
                             }  
                
                             {userInfo && userInfo.isAdmin && (
                                 <NavDropdown data-cy="dropdown-admin" title="admin" id="adminmenu" style={{paddingTop:'10px'}}>
                                    <LinkContainer to="/admin/userlist">
                                        <NavDropdown.Item>Users</NavDropdown.Item>
                                    </LinkContainer>
                                    <LinkContainer to="/admin/productlist">
                                        <NavDropdown.Item>Products</NavDropdown.Item>
                                    </LinkContainer>
                                    <LinkContainer data-cy="admin-orderlist" to="/admin/orderlist">
                                        <NavDropdown.Item>Orders</NavDropdown.Item>
                                    </LinkContainer>
                                 </NavDropdown>
                             )}
                            </Nav>
                        </Navbar.Collapse>
                    </Container>
                </Navbar>
            </header>

        </div>
    )
}

export default Header
