import React, {Fragment, useEffect, useState} from "react";
import {Button, FormControl, FormHelperText, InputLabel, MenuItem, Select, TextField} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import DateFnsUtils from '@date-io/date-fns';
import {FormLabel} from "@material-ui/core";
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker,
} from '@material-ui/pickers';
import Alert from "@material-ui/lab/Alert";

const useModalStyles = makeStyles((theme) => ({
    root: {
        padding : '15px 15px 30px 15px',
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

const selectStyles = makeStyles((theme) => ({
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
        width: '200px'
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
}));

const getFormattedDate = (date) => {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    return `${year}-${month}-${day}`

}

const BookAppointment = ({baseUrl, doctorName, doctorId, accessToken, loggedInUserId, closeModal}) => {
    const modalClasses = useModalStyles();
    const [selectedDate, setSelectedDate] = React.useState(getFormattedDate(new Date()));
    const [timeSlots, setTimeSlots] = useState([]);
    const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
    const [bookAppointmentForm, setBookAppointmentForm] = useState({
        'medicalHistory': '',
        'symptoms': ''
    })
    const selectClasses = selectStyles();

    const fetchTimeSlotForAppointment = () => {
        fetch(`${baseUrl}doctors/${doctorId}/timeSlots?date=${selectedDate}`)
            .then(response => response.json())
            .then(response => {
                console.log(`TimeSlots ${response}`);
                console.log(JSON.stringify(response));
                const time = response.timeSlot;
                console.log(JSON.stringify(time));
                setTimeSlots([...time]);
            });
    }

    useEffect(() => {
        const err = document.getElementById('timeslot-error');
        err.style.display = 'none';
        const err2 = document.getElementById('not-loggedin-error');
        err2.classList.add('hide-message');
        err2.classList.remove('show-message');
        fetchTimeSlotForAppointment();

    }, []);

    const handleDateChange = (date) => {

        setSelectedDate(getFormattedDate(date));
        fetchTimeSlotForAppointment();
    };

    const handleTimeSlotChange = (event) => {
        setSelectedTimeSlot(event.target.value);
    };

    const handleInputChange = (e) => {
        const state = bookAppointmentForm;
        state[e.target.name] = e.target.value;
        setBookAppointmentForm({...state});
    }

    const isValidForm = () => {
        let errorFound = false;
        if(selectedTimeSlot === '') {
            const err = document.getElementById('timeslot-error');
            err.style.display = 'block';
            errorFound = true;
        }

        if(loggedInUserId === '' || loggedInUserId === undefined) {
            const err = document.getElementById('not-loggedin-error');
            err.classList.remove('hide-message');
            err.classList.add('show-message');
            errorFound = true;
        }

        return !errorFound;
    }
    
    const handleBookAppointment = async () => {
        if(isValidForm()) {
            const body = {
                "doctorId": `${doctorId}`,
                "doctorName": `${doctorName}`,
                "userId": `${loggedInUserId}`,
                "timeSlot": `${selectedTimeSlot}`,
                "appointmentDate": `${selectedDate}`,
                "createdDate": "",
                "symptoms": `${bookAppointmentForm.symptoms}`,
                "priorMedicalHistory": `${bookAppointmentForm.medicalHistory}`
            }
            const rawResponse = await fetch(baseUrl + "appointments", {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            });
            if(rawResponse.ok) {
                console.log(rawResponse);
                alert("Appointment was booked successfully");
                closeModal();
            } else {
                alert("Either the slot is already booked or not available");
            }
        }
    }

    return <Fragment>
        <div className='heading'><h2>Book an Appointment</h2></div>
        <form name='book-appointment-form' className={modalClasses.root}>
            <TextField disabled id="doctorName" label="Doctor Name*" defaultValue={doctorName}/>

            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <KeyboardDatePicker
                    disableToolbar
                    variant="inline"
                    format="MM/dd/yyyy"
                    margin="normal"
                    id="date-picker-inline"
                    label="Date picker inline"
                    value={selectedDate}
                    onChange={handleDateChange}
                    KeyboardButtonProps={{
                        'aria-label': 'change date',
                    }}
                />
            </MuiPickersUtilsProvider>
            <FormControl className={selectClasses.formControl}>
                <InputLabel shrink id="select-speciality-input-label">Timeslot</InputLabel>
                <Select
                    labelId="select-timeslot-label-label"
                    id="select-timeslot-label"
                    value={selectedTimeSlot}
                    onChange={handleTimeSlotChange}
                    displayEmpty
                    className={selectClasses.selectEmpty}
                >
                    <MenuItem value="">
                        <em>None</em>
                    </MenuItem>
                    {
                        timeSlots.map((time) => (
                                <MenuItem value={time}>{time}</MenuItem>
                            )
                        )
                    }
                </Select>
                <FormHelperText id='timeslot-error'>Select a time slot</FormHelperText>
            </FormControl>
            <FormControl className={selectClasses.formControl}>
                <FormLabel>Medical History</FormLabel>
                <TextField id='medical-history'
                           name='medicalHistory'
                           onChange={handleInputChange}
                />
            </FormControl>
            <FormControl className={selectClasses.formControl}>
                <FormLabel>Symptoms</FormLabel>
                <TextField id='symptoms'
                           name='symptoms'
                           onChange={handleInputChange}
                />
            </FormControl>
            <Button variant="contained" color="primary"
                    onClick={handleBookAppointment}>BOOK APPOINTMENT</Button>
            <Alert severity="error" className="hide-message" id="not-loggedin-error">Please login to book an appointment</Alert>
        </form>
    </Fragment>

}

export default BookAppointment;
