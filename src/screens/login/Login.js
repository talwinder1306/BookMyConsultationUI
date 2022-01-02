import React, {useState} from 'react';
import {Button, FormControl, FormHelperText, Input, InputLabel} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";

//=================================CSS Styles ================================================//
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

const Login = ({validateEmail, showEmptyError, hideEmptyError, fetchLogin, closeModal, setAccessToken, setLoggedInUserId}) => {
    const loginClasses = useLoginStyles();
    const [loginForm, setLoginForm] = useState({
        'email': '',
        'password': ''
    })
    const [loginError, setLoginError] = useState({
        'emailError': false,
        'passwordError': false
    });
    const [loginErrorText, setLoginErrorText] = useState({
        'emailErrorText': '',
        'passwordErrorText': ''
    })

    function hideErrors() {
        setLoginError({
            'emailError': false,
            'passwordError': false
        });
        setLoginErrorText({
            'emailErrorText': '',
            'passwordErrorText': ''
        });
    }

    //================================= Validation methods ===========================//
    function validateLogin(loginForm) {
        const email = loginForm['email'];

        let errorFound = showEmptyError(loginForm);
        let isValidEmail = validateEmail(email);
        if (!isValidEmail) {
            const error = loginError;
            error['emailError'] = true;
            const errorText = loginErrorText;
            errorText['emailErrorText'] = "Enter valid Email";
            setLoginError({...error});
            setLoginErrorText({...errorText});
        }

        return isValidEmail && !errorFound;
    }


    //================================ Event Handlers =======================================//
    const handleLogin = async (e) => {
        e.preventDefault();
        const {email, password} = loginForm;
        let isValid = validateLogin(loginForm);

        if (isValid === true) {
            const {rawResponse, response} = await fetchLogin(email, password);
            if (rawResponse.ok) {
                setAccessToken(response.accessToken);
                setLoggedInUserId(email);
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


    const loginInputChangedHandler = (e) => {
        hideEmptyError(loginForm);
        hideErrors();
        const state = loginForm;
        state[e.target.name] = e.target.value;

        setLoginForm({...state});
    }

    return (
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
                <FormHelperText id="email-empty-error" className="floating-error">Please fill out this
                    field</FormHelperText>
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
                <FormHelperText id="password-empty-error" className="floating-error">Please fill out this
                    field</FormHelperText>
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
    )
}

export default Login;
