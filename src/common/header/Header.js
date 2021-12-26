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
    const [headerBtnText, setHeaderBtnText] = useState('Login');
    const [loginModalIsOpen, setLoginModalIsOpen] = useState(false);
    const loginClasses = useLoginStyles();

    const handleOpenModal = () => {
        setLoginModalIsOpen(true);
    };

    const handleLogin = () => {
        alert("talwinder");
    }

    const handleLogout = () => {
        alert('Logout');
    }

    function afterOpenModal() {
        // references are now sync'd and can be accessed.
        //subtitle.style.color = '#f00';
    }

    function closeModal() {
        setLoginModalIsOpen(false);
    }

    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return <div className='header-panel'>
        <div className='logo-panel'><img src={logo} alt='logo' className='logo-img'/></div>
        <div className='title-panel'><h2>Doctor Finder </h2></div>
        <div className='btn-panel'>
            <Button
                variant="contained" color="primary"
                onClick={handleOpenModal}
            >
                {headerBtnText}
            </Button>
            <Button
                variant="contained" color="secondary"
                onClick={handleLogout}
            >
                {headerBtnText}
            </Button>
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
                            <InputLabel htmlFor="login-email">Email address</InputLabel>
                            <Input id="login-email" aria-describedby="email" />
                            {/*<FormHelperText id="my-helper-text">We'll never share your email.</FormHelperText>*/}
                        </FormControl>
                        <FormControl>
                            <InputLabel htmlFor="login-password">Password</InputLabel>
                            <Input id="login-password" aria-describedby="password" />
                            {/*<FormHelperText id="my-helper-text">We'll never share your email.</FormHelperText>*/}
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
                    Item Two
                </TabPanel>
            </div>

        </Modal>
    </div>;
}

export default Header;
