import React, {useState} from "react";
import ReactDOM from 'react-dom';
import Modal from 'react-modal';
import './Header.css';
import logo from '../../assets/logo.jpeg'
import {Button, Tabs, Tab, Box} from '@material-ui/core';
import {Typography} from "@material-ui/core";
import PropTypes from 'prop-types';
import { FormControl, Input, InputLabel, FormHelperText } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Alert from '@material-ui/lab/Alert';

const useLoginStyles = makeStyles((theme) => ({
    root: {
        '& .MuiTextField-root': {
            margin: theme.spacing(1),
            width: 200,
        },
        '& .MuiFormControl-root': {
            display: 'flex',
            marginBottom: '15px',
        },
    },
}));

const loginModalCustomStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        padding: '0px',
    },
};

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

const Header = ({baseUrl}) => {
    const [accessToken, setAccessToken] = useState('');
    const [loginModalIsOpen, setLoginModalIsOpen] = useState(false);
    const loginClasses = useLoginStyles();
    const [loginForm, setLoginForm] = useState({
        'email':'',
        'password':''
    })
    const [loginError, setLoginError] = useState({
        'emailError': false,
        'passwordError': false
    });
    const [loginErrorText, setLoginErrorText] = useState({
        'emailErrorText': '',
        'passwordErrorText': ''
    })

    const [registerForm, setRegisterForm] = useState({
        'firstName': '',
        'lastName': '',
        'regEmail': '',
        'regPassword': '',
        'mobile': ''
    })
    const [registerError, setRegisterError] = useState({
        'firstNameError': false,
        'lastNameError': false,
        'regEmailError': false,
        'regPasswordError': false,
        'mobileError': false
    });
    const [registerErrorText, setRegisterErrorText] = useState({
        'firstNameErrorText': '',
        'lastNameErrorText': '',
        'regEmailErrorText': '',
        'regPasswordErrorText': '',
        'mobileErrorText': ''
    });

    const handleOpenModal = () => {
        setLoginModalIsOpen(true);
        setLoginForm({
            'email':'',
            'password':''
        });
        setLoginError({
            'emailError': false,
            'passwordError': false
        });
        setLoginErrorText({
            'emailErrorText': '',
            'passwordErrorText': ''
        })

        setRegisterForm({
            'firstName': '',
            'lastName': '',
            'regEmail': '',
            'regPassword': '',
            'mobile': ''
        });
        setRegisterError({
            'firstNameError': false,
            'lastNameError': false,
            'regEmailError': false,
            'regPasswordError': false,
            'mobileError': false
        });
        setRegisterErrorText({
            'firstNameErrorText': '',
            'lastNameErrorText': '',
            'regEmailErrorText': '',
            'regPasswordErrorText': '',
            'mobileErrorText': ''
        });
        const msg = document.getElementById("reg-alert");
        msg.classList.add("hide-message");
        msg.classList.remove("show-message");
    };

    function showEmptyError(form) {
        let errorFound = false;
        Object.entries(form).forEach(([key, value]) => {
            console.log(`${key} ${value}`);
            if (form[key] === '') {
                console.log(`${key}-empty-error`);
                const ele = document.getElementById(`${key}-empty-error`);
                ele.style.display = 'block';
                errorFound = true;
            }
        });

        return errorFound;
    }

    function validateLogin(loginForm) {
        const {email, password} = loginForm;

        let errorFound = showEmptyError(loginForm);
        let isValidEmail = validateEmail(email);
        if(!isValidEmail) {
            const error = loginError;
            error['emailError'] = true;
            const errorText = loginErrorText;
            errorText['emailErrorText'] = "Enter valid Email";
            setLoginError({...error});
            setLoginErrorText({...errorText});
        }

        return isValidEmail && !errorFound;
    }

    function validateRegister(registerForm) {
        let errorFound = showEmptyError(registerForm);
        let isValidEmail = validateEmail(registerForm['regEmail']);
        if(!isValidEmail) {
            const error = registerError;
            error['regEmailError'] = true;
            const errorText = registerErrorText;
            errorText['regEmailErrorText'] = "Enter valid Email";
            setRegisterError({...error});
            setRegisterErrorText({...errorText});
        }
        let isValidMobile = validateMobileNo(registerForm['mobile']);
        if(!isValidMobile) {
            const error = registerError;
            error['mobileError'] = true;
            const errorText = registerErrorText;
            errorText['mobileErrorText'] = "Enter valid Mobile No.";
            setRegisterError({...error});
            setRegisterErrorText({...errorText});
        }
        return isValidEmail && !errorFound;
    }

    const validateEmail = (email) => {
        let validEmailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
        if (!email.match(validEmailRegex)) {
            return false;
        }

        return true;
    }

    /* checks that the number should be 10 digits */
    const validateMobileNo = (mobile) => {
        let validMobileRegex =  /^[0-9]{10}$/;
        if (!mobile.match(validMobileRegex)) {
            return false;
        }

        return true;
    }

    const fetchLogin = async (email, password) => {
        let stringToEncode = email + ':' + password;
        let basicAuth = window.btoa(stringToEncode);
        const rawResponse = await fetch(baseUrl + "auth/login", {
            method: 'POST',
            headers: {
                'Authorization': `Basic ${basicAuth}`
            },
        });
        const response = await rawResponse.json();
        return {rawResponse, response};
    }

    const fetchRegister = async (registerForm) => {
        const body = {
            "firstName":registerForm.firstName,
            "lastName": registerForm.lastName,
            "dob":"1903-08-06",
            "mobile":registerForm.mobile,
            "password":registerForm.regPassword,
            "emailId":registerForm.regEmail
        };

        const rawResponseReg = await fetch(baseUrl + "users/register", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });
        const responseReg = await rawResponseReg.json();
        return {rawResponseReg, responseReg};
    }

    const handleLogin = async (e) => {
        e.preventDefault();
        const {email, password} = loginForm;
        let isValid = validateLogin(loginForm);

        if(isValid === true) {
            const {rawResponse, response} = await fetchLogin(email, password);
            if (rawResponse.ok) {
                setAccessToken(response.accessToken);
                setLoginForm({
                    email: '',
                    password: ''
                });
                closeModal();
            } else {
                const error = loginError;
                error['emailError'] = true;
                const errorText = loginErrorText;
                errorText['emailErrorText'] = response.message;
                setLoginError({...error});
                setLoginErrorText({...errorText});
            }
        }
    }

    const handleRegister = async (e) => {
        e.preventDefault();
        let isValid = validateRegister(registerForm);

        if(isValid === true) {
            const {rawResponseReg, responseReg} = await fetchRegister(registerForm);
            console.log(rawResponseReg + responseReg);
            if (rawResponseReg.ok) {
                const msg = document.getElementById("reg-alert");
                msg.classList.remove("hide-message");
                msg.classList.add("show-message");
                const {rawResponse, response} = await fetchLogin(registerForm.regEmail, registerForm.regPassword);
                if (rawResponse.ok) {
                    setAccessToken(response.accessToken);
                    setLoginForm({
                        email: '',
                        password: ''
                    });
                    closeModal();
                } else {
                    const error = registerError;
                    error['emailError'] = true;
                    const errorText = registerErrorText;
                    errorText['emailErrorText'] = response.message;
                    setRegisterError({...error});
                    setRegisterErrorText({...errorText});
                }
                setRegisterForm({
                    'firstName': '',
                    'lastName': '',
                    'regEmail': '',
                    'regPassword': '',
                    'mobile': ''
                });
            } else {
                const error = registerError;
                error['emailError'] = true;
                const errorText = registerErrorText;
                errorText['emailErrorText'] = responseReg.message;
                setRegisterError({...error});
                setRegisterErrorText({...errorText});
            }

        }
    }

    const handleLogout = async () => {
        const rawResponse = await fetch(baseUrl + "auth/logout", {
            method:'POST',
            headers:{
                'Authorization': `Bearer ${accessToken}`
            },
        });

        if (rawResponse.ok) {
            setAccessToken('');
        }
    }

    function afterOpenModal() {
        // references are now sync'd and can be accessed.
        //subtitle.style.color = '#f00';
    }

    function closeModal() {
        setLoginModalIsOpen(false);
    }

    function hideEmptyError(form) {
        Object.entries(form).forEach(([key, value]) => {
            console.log(`${key}-empty-error`);
            const ele = document.getElementById(`${key}-empty-error`);
            ele.style.display = 'none';
        })
    }

    function hideErrors(tab) {
        if(tab === "login") {
            setLoginError({
                'emailError': false,
                'passwordError': false
            });
            setLoginErrorText({
                'emailErrorText': '',
                'passwordErrorText': ''
            });
        }

        if(tab === "register") {
            setRegisterError({
                'firstNameError': false,
                'lastNameError': false,
                'regEmailError': false,
                'regPasswordError': false,
                'mobileError': false
            });
            setRegisterErrorText({
                'firstNameErrorText': '',
                'lastNameErrorText': '',
                'regEmailErrorText': '',
                'regPasswordErrorText': '',
                'mobileErrorText': ''
            });
        }
    }

    const loginInputChangedHandler = (e) => {
        hideEmptyError(loginForm);
        hideErrors("login");
        const state = loginForm;
        state[e.target.name] = e.target.value;

        setLoginForm({...state});
    }

    const registerInputChangedHandler = (e) => {
        hideEmptyError(registerForm);
        hideErrors("register");
        const state = registerForm;
        state[e.target.name] = e.target.value;

        setRegisterForm({...state});
    }

    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return <div className='header-panel'>
        <div className='logo-panel'><img src={logo} alt='logo' className='logo-img'/></div>
        <div className='title-panel'><h2>Doctor Finder </h2></div>
        <div className='btn-panel'>
            { accessToken === '' ?
                <Button
                    variant="contained" color="primary"
                    onClick={handleOpenModal}
                > Login </Button> :
                <Button
                    variant="contained" color="secondary"
                    onClick={handleLogout}
                > Logout </Button>}

        </div>
        <Modal
            isOpen={loginModalIsOpen}
            onAfterOpen={afterOpenModal}
            onRequestClose={closeModal}
            style={loginModalCustomStyles}
            contentLabel="Login Modal"
        >
            <div className='heading'><h2>Authentication</h2></div>
            <div className='tabs-container'>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                        <Tab label="Login" {...a11yProps(0)} />
                        <Tab label="Register" {...a11yProps(1)} />
                    </Tabs>
                </Box>
                <TabPanel value={value} index={0}>
                    <form className={loginClasses.root}>
                        <FormControl>
                            <InputLabel htmlFor="login-email">Email *</InputLabel>
                            <Input
                                id="login-email"
                                name="email"
                                aria-describedby="email"
                                onChange={loginInputChangedHandler}
                                error={loginError.emailError === true}
                            />
                            <FormHelperText id="email-error-text">{loginErrorText.emailErrorText}</FormHelperText>
                            <FormHelperText id="email-empty-error" className="floating-error">Please fill out this field</FormHelperText>
                        </FormControl>
                        <FormControl>
                            <InputLabel htmlFor="login-password">Password *</InputLabel>
                            <Input
                                id="login-password"
                                name="password"
                                type="password"
                                aria-describedby="password"
                                onChange={loginInputChangedHandler}
                                error={loginError.passwordError === true}
                            />
                            <FormHelperText id="password-error-text">{loginErrorText.passwordErrorText}</FormHelperText>
                            <FormHelperText id="password-empty-error" className="floating-error">Please fill out this field</FormHelperText>
                        </FormControl>
                        <Button
                            id="login-btn"
                            className='modal-action-btn'
                            variant="contained" color="primary"
                            onClick={handleLogin}
                        >
                            Login
                        </Button>
                    </form>
                </TabPanel>
                <TabPanel value={value} index={1}>
                    <form className={loginClasses.root}>
                        <FormControl>
                            <InputLabel htmlFor="first-name">First Name *</InputLabel>
                            <Input
                                id="first-name"
                                name="firstName"
                                aria-describedby="firstName"
                                onChange={registerInputChangedHandler}
                                error={registerError.firstNameError === true}
                            />
                            <FormHelperText id="firstName-error-text">{registerErrorText.firstNameErrorText}</FormHelperText>
                            <FormHelperText id="firstName-empty-error" className="floating-error">Please fill out this field</FormHelperText>
                        </FormControl>
                        <FormControl>
                            <InputLabel htmlFor="last-name">Last Name *</InputLabel>
                            <Input
                                id="last-name"
                                name="lastName"
                                aria-describedby="lastName"
                                onChange={registerInputChangedHandler}
                                error={registerError.lastNameError === true}
                            />
                            <FormHelperText id="lastName-error-text">{registerErrorText.lastNameErrorText}</FormHelperText>
                            <FormHelperText id="lastName-empty-error" className="floating-error">Please fill out this field</FormHelperText>
                        </FormControl>
                        <FormControl>
                            <InputLabel htmlFor="reg-email">Email Id *</InputLabel>
                            <Input
                                id="reg-email"
                                name="regEmail"
                                aria-describedby="email"
                                onChange={registerInputChangedHandler}
                                error={registerError.regEmailError === true}
                            />
                            <FormHelperText id="regEmail-error-text">{registerErrorText.regEmailErrorText}</FormHelperText>
                            <FormHelperText id="regEmail-empty-error" className="floating-error">Please fill out this field</FormHelperText>
                        </FormControl>
                        <FormControl>
                            <InputLabel htmlFor="register-password">Password *</InputLabel>
                            <Input
                                id="register-password"
                                name="regPassword"
                                type="password"
                                aria-describedby="password"
                                onChange={registerInputChangedHandler}
                                error={registerError.regPasswordError === true}
                            />
                            <FormHelperText id="regPassword-error-text">{registerErrorText.regPasswordErrorText}</FormHelperText>
                            <FormHelperText id="regPassword-empty-error" className="floating-error">Please fill out this field</FormHelperText>
                        </FormControl>
                        <FormControl>
                            <InputLabel htmlFor="register-password">Mobile No *</InputLabel>
                            <Input
                                id="mobile"
                                name="mobile"
                                aria-describedby="mobile"
                                onChange={registerInputChangedHandler}
                                error={registerError.mobileError === true}
                            />
                            <FormHelperText id="mobile-error-text">{registerErrorText.mobileErrorText}</FormHelperText>
                            <FormHelperText id="mobile-empty-error" className="floating-error">Please fill out this field</FormHelperText>
                        </FormControl>
                        <Button
                            id="register-btn"
                            className='modal-action-btn'
                            variant="contained" color="primary"
                            onClick={handleRegister}
                        >
                            Register
                        </Button>
                        <Alert severity="success" className="hide-message" id="reg-alert">Registration Successful</Alert>
                    </form>
                </TabPanel>
            </div>
        </Modal>
    </div>;
}

export default Header;
