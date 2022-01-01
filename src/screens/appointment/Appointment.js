import React, {useEffect, useState} from 'react';
import {Typography, makeStyles, Paper, CardContent, CardActions, Button} from "@material-ui/core";
import Modal from "react-modal";
import RateAppointment from "./RateAppointment";

const useNoLoginStyles = makeStyles({
    root: {
        width: '100%',
        textAlign: 'center',
    },
});

const useStyles = makeStyles({
    root: {
        minWidth: 275,
        textAlign: 'left',
        maxWidth: '100%',
        margin: '25px 15px',
        padding: '20px',
        cursor: 'pointer'
    },
    title: {
        fontSize: 14,
    },
    pos: {
        marginBottom: 12,
    },
    btn: {
        width: "fit-content"
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
        padding: '0px',
        width: '50%'
    }
};

const Appointment = ({baseUrl, accessToken, loggedInUserId}) => {
    const noLoginClasses = useNoLoginStyles();
    const classes = useStyles();
    const [appointments, setAppointments] = useState([]);
    const [rateAppointmentModalIsOpen, setRateAppointmentModalIsOpen] = useState(false);
    const [rateAppointmentModal, setRateAppointmentModal] = useState({
        doctorId: '',
        appointmentId: ''
    });

    const fetchAppointmentByUser = () => {
        fetch(`${baseUrl}users/${loggedInUserId}/appointments`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            }
        })
            .then(response => response.json())
            .then(response => {
                console.log(`Appointment By User ${response}`);
                console.log(JSON.stringify(response));
                setAppointments([...response]);
            });
    }

    useEffect(() => {
        if(accessToken !== '') {
            fetchAppointmentByUser();
        }
    }, [loggedInUserId]);

    const handleOpenRateAppointmentModal = (appointment) => {
        const state = rateAppointmentModal;
        state['doctorId'] = appointment.doctorId;
        state['appointmentId'] = appointment.appointmentId;
        setRateAppointmentModal({...state});
        setRateAppointmentModalIsOpen(true);
    }

    const closeRateAppointmentModal = () => {
        setRateAppointmentModalIsOpen(false);
    }

    return (accessToken === '') ?
        <div className={noLoginClasses.root}>
            <Typography variant="h5" component="h3">{"Login to see appointments"}</Typography>
        </div>
        : <div>
            {
            appointments.map((appointment) =>  (
                    <Paper className={classes.root}>
                        <CardContent>
                            <Typography variant="h5" component="h3">
                                Dr: {appointment.doctorName}
                            </Typography>
                            <Typography variant="body1" component="p">
                                Date: {appointment.appointmentDate}
                            </Typography>
                            <Typography variant="body1" component="p">
                                Symptoms: {appointment.symptoms}
                            </Typography>
                            <Typography variant="body1" component="p">
                                Prior Medical History: {appointment.priorMedicalHistory}
                            </Typography>
                        </CardContent>
                        <br/>
                        <CardActions>
                            <Button variant="contained" color="primary"
                                    className={classes.btn} onClick={() => handleOpenRateAppointmentModal(appointment)}
                            >RATE APPOINTMENT</Button>

                        </CardActions>
                    </Paper>
                )
            )
        }
        <Modal
            isOpen={rateAppointmentModalIsOpen}
            onRequestClose={closeRateAppointmentModal}
            style={modalCustomStyles}
            contentLabel="Rate Appointment Modal"
        > <RateAppointment baseUrl={baseUrl} accessToken={accessToken}
                         doctorId={rateAppointmentModal.doctorId}
                         appointmentId={rateAppointmentModal.appointmentId}
                         closeModal={closeRateAppointmentModal}
        /></Modal>
        </div>
}

export default Appointment;
