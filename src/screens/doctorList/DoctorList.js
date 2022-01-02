import React, {useEffect, useState} from "react";
import {Select, MenuItem, FormControl, InputLabel} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import './DoctorList.css';
import {Paper, Typography, CardActions, Button, CardContent} from "@material-ui/core";
import StarIcon from '@material-ui/icons/Star';
import Modal from 'react-modal';
import BookAppointment from "./BookAppointment";
import DoctorDetails from "./DoctorDetails";

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

const modalCustomStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        padding: '0px'
    }
};

const bookAppModalStyles = {
    content: {
        ...modalCustomStyles.content,
        width: '50%',
    }
}
const DoctorList = ({baseUrl, accessToken, loggedInUserId}) => {
    const selectClasses = selectStyles();
    const classes = useStyles();
    const [bookAppointmentModal, setBookAppointmentModal] = useState({
        'isOpen': false,
        'doctorName': '',
        'doctorId': ''
    });
    const [viewDetailsModal, setViewDetailsModal] = useState({
        'isOpen': false,
        'doctorId': '',
        'doctorName': '',
        'totalYearsOfExp': 0,
        'speciality': '',
        'dob': '',
        'city': '',
        'emailId': '',
        'mobile': '',
        'rating': 0.0
    });
    const [speciality, setSpeciality] = useState('');
    const [allSpecialities, setAllSpecialities] = useState([]);
    const [allDoctors, setAllDoctors] = useState([]);
    const numberOfStars = 5;

    const fetchAllSpecialities = () => {
        fetch(`${baseUrl}doctors/speciality`)
            .then(response => response.json())
            .then(response => {
                setAllSpecialities([...response]);
            });
    }

    const fetchDoctorsBySpeciality = (speciality) => {
        fetch(`${baseUrl}doctors?speciality=${speciality}`)
            .then(response => response.json())
            .then(response => {
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

    const handleOpenBookAppointmentModal = (name, id) => {
        const modalState = bookAppointmentModal;
        modalState['isOpen'] = true;
        modalState['doctorName'] = name;
        modalState['doctorId'] = id;
        setBookAppointmentModal({...modalState});
    }

    const closeBookAppointmentModal = () => {
        const modalState = bookAppointmentModal;
        modalState['isOpen'] = false;
        modalState['doctorName'] = '';
        modalState['doctorId'] = '';
        setBookAppointmentModal({...modalState});
    }

    const handleOpenViewDetailsModal = (doctorObj) => {
        const modalState = {
            'isOpen': true,
            'doctorId': `${doctorObj.id}`,
            'doctorName': `${doctorObj.firstName} ${doctorObj.lastName}`,
            'totalYearsOfExp': doctorObj.totalYearsOfExp,
            'speciality': `${doctorObj.speciality}`,
            'dob': `${doctorObj.dob}`,
            'city': `${doctorObj.address.city}`,
            'emailId': `${doctorObj.emailId}`,
            'mobile': `${doctorObj.mobile}`,
            'rating': doctorObj.rating
        };
        setViewDetailsModal({...modalState});
    }

    const closeViewDetailsModal = () => {
        setViewDetailsModal({
            'isOpen': false,
            'doctorId': '',
            'doctorName': '',
            'totalYearsOfExp': 0,
            'speciality': '',
            'dob': '',
            'city': '',
            'emailId': '',
            'mobile': '',
            'rating': 0.0
        });

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
            allDoctors.map((doctor) => {
                const name = `${doctor.firstName} ${doctor.lastName}`;
                return (
                <Paper className={classes.root}>
                    <CardContent>
                        <Typography variant="h5" component="h3">
                            Doctor Name: {name}
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
                                    className={(n < doctor.rating) ? 'star-selected' : 'star-icon'}
                                ></StarIcon>
                            );
                        })}
                        </Typography>
                    </CardContent>
                    <CardActions>
                        <Button variant="contained" color="primary"
                                className={classes.btn} onClick={() => handleOpenBookAppointmentModal(name, doctor.id)}>BOOK APPOINTMENT</Button>
                        <Button variant="contained" className={`${classes.btn} green-btn`}
                                onClick={() => handleOpenViewDetailsModal(doctor)}>VIEW DETAILS</Button>
                    </CardActions>
                </Paper>
            )
            })
        }

        <Modal
            isOpen={bookAppointmentModal.isOpen}
            onRequestClose={closeBookAppointmentModal}
            style={bookAppModalStyles}
            contentLabel="Book Appointment Modal"
        > <BookAppointment baseUrl={baseUrl} accessToken={accessToken}
                           doctorName={bookAppointmentModal.doctorName}
                           doctorId={bookAppointmentModal.doctorId}
                           loggedInUserId={loggedInUserId}
                           closeModal={closeBookAppointmentModal}
        /></Modal>

        <Modal
            isOpen={viewDetailsModal.isOpen}
            onRequestClose={closeViewDetailsModal}
            style={modalCustomStyles}
            contentLabel="View Details Modal"
        > <DoctorDetails baseUrl={baseUrl} accessToken={accessToken}
                           doctorDetails={viewDetailsModal}
                           doctorId={viewDetailsModal.doctorId}
                           loggedInUserId={loggedInUserId}
                           closeModal={closeViewDetailsModal}
        /></Modal>

    </div>
}

export default DoctorList;
