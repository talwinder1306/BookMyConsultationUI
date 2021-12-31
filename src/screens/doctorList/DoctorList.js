import React, {useEffect, useState} from "react";
import ReactDOM from "react-dom";
import {Select, MenuItem, FormControl, InputLabel} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import './DoctorList.css';
import {Paper, Typography, CardActions, Button, CardContent} from "@material-ui/core";
import StarIcon from '@material-ui/icons/Star';
import Modal from 'react-modal';


const selectStyles = makeStyles((theme) => ({
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
}));

const useStyles = makeStyles({
    root: {
        minWidth: 275,
        textAlign: 'left',
        maxWidth: '40%',
        margin: "20px auto"
    },
    title: {
        fontSize: 14,
    },
    pos: {
        marginBottom: 12,
    },
    btn: {
        width: '40%',
        margin: '10px'
    }
});

const useModalStyles = makeStyles((theme) => ({
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

const modalCustomStyles = {
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

const DoctorList = ({baseUrl}) => {
    const selectClasses = selectStyles();
    const classes = useStyles();
    const [bookAppointmentModalIsOpen, setBookAppointmentModalIsOpen] = useState(false);
    const modalClasses = useModalStyles();
    const [speciality, setSpeciality] = useState('');
    const [allSpecialities, setAllSpecialities] = useState([]);
    const [allDoctors, setAllDoctors] = useState([]);
    const numberOfStars = 5;

    const fetchAllSpecialities = () => {
        fetch(`${baseUrl}doctors/speciality`)
            .then(response => response.json())
            .then(response => {
                console.log(`All Specialities ${response}`);
                setAllSpecialities([...response]);
            });
    }

    const fetchDoctorsBySpeciality = (speciality) => {
        fetch(`${baseUrl}doctors?speciality=${speciality}`)
            .then(response => response.json())
            .then(response => {
                console.log(`Doctors By Speciality ${response}`);
                console.log(JSON.stringify(response));
                setAllDoctors([...response]);
            });
    }

    useEffect(() => {
        fetchAllSpecialities();
        fetchDoctorsBySpeciality("");
    }, []);

    const handleChange = (event) => {
        setSpeciality(event.target.value);
        fetchDoctorsBySpeciality(event.target.value);
    };

    const handleOpenBookAppointmentModal = () => {
        setBookAppointmentModalIsOpen(true);
    }

    return <div className="doctor-list-container">
        <FormControl className={selectClasses.formControl}>
            <InputLabel shrink id="select-speciality-input-label">Select Speciality</InputLabel>
            <Select
                labelId="select-speciality-label-label"
                id="select-speciality-label"
                value={speciality}
                onChange={handleChange}
                displayEmpty
                className={selectClasses.selectEmpty}
            >
                <MenuItem value="">
                    <em>&nbsp;</em>
                </MenuItem>
                {
                    allSpecialities.map((spec) => (
                            <MenuItem value={spec}>{spec}</MenuItem>
                        )
                    )
                }
            </Select>
        </FormControl>
        {
            allDoctors.map((doctor) => (
                <Paper className={classes.root}>
                    <CardContent>
                        <Typography variant="h5" component="h3">
                            Doctor Name: {doctor.firstName} {doctor.lastName}
                        </Typography>
                        <br/>
                        <Typography variant="body1" component="p">
                            Speciality: {doctor.speciality}
                        </Typography>
                        <Typography variant="body1" component="p">
                            Rating: {[...Array(+numberOfStars).keys()].map(n => {
                            return (
                                    <StarIcon
                                        key={`star-${n}`}
                                        id={`star-${n}`}
                                        className={(n <= doctor.rating)? 'star-selected': 'star-icon'}
                                    ></StarIcon>
                            );
                        })}
                        </Typography>
                    </CardContent>
                    <CardActions>
                        <Button variant="contained" color="primary" className={classes.btn}>BOOK APPOINTMENT</Button>
                        <Button variant="contained" className={`${classes.btn} green-btn`} >VIEW DETAILS</Button>
                    </CardActions>
                </Paper>
            ))
        }

        {/*<Modal
            isOpen={bookAppointmentModalIsOpen}
            onRequestClose={closeBookAppointmentModal}
            style={modalCustomStyles}
            contentLabel="Book Appointment Modal"
        > <BookAppointment /></Modal>*/}

    </div>
}

export default DoctorList;
