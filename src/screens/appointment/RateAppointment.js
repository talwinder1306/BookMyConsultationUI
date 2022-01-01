import React, {Fragment, useEffect, useState} from 'react';
import {Button, FormControl, FormHelperText, FormLabel, TextField, Typography} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import StarIcon from '@material-ui/icons/Star';
import '../../common/common.css';

const useStyles = makeStyles((theme) => ({
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
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
        width: '200px',
        display: 'block'
    }
}));

const RateAppointment = ({baseUrl, accessToken, doctorId, appointmentId, closeModal}) => {
    const classes = useStyles();
    const numberOfStars = 5;
    const[stars, setStars] = useState([false,false,false,false,false]);

    function resetFormDefaults() {
        const err = document.getElementById('rating-error');
        err.style.display = 'none';
    }

    useEffect(() => {
        resetFormDefaults();
    }, []);

    const [rateAppointmentForm, setRateAppointmentForm] = useState({
        comments: '',
        rating: 0
    });

    const isValidForm= () => {
        let errorFound = false;
        if(rateAppointmentForm.rating == 0) {
            const err = document.getElementById('rating-error');
            err.style.display = 'block';
            errorFound = true;
        }

        return !errorFound;
    }

    const handleRateAppointment = async () => {
        if(isValidForm()) {
            const body = {
                'appointmentId':`${appointmentId}`,
                'doctorId': `${doctorId}`,
                'rating': `${rateAppointmentForm.rating}`,
                'comments':`${rateAppointmentForm.comments}`
            }
            const rawResponse = await fetch(baseUrl + "ratings", {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            });
            if(rawResponse.ok) {
                console.log(rawResponse);
                alert("Rating the appointment was successfully");
                closeModal();
            } else {
                alert("There was some error rating the appointment. Please try again later.");
            }
        }
    }

    /**
     * This handles the rating stars click
     * @param e
     */
    const onRatingClick = (e) => {
        resetFormDefaults();
        const id = e.target.id;
        const n = id.substring(5);
        const star = [];
        for(let i=0; i < 5; i++) {
            star[i] = i <= n;
        }

        const state = rateAppointmentForm;
        state['rating'] = Number(n)+1;
        setRateAppointmentForm({...state});

        setStars(star);
    }

    const handleInputChange = (e) => {
        const state = rateAppointmentForm;
        state[e.target.name] = e.target.value;
        setRateAppointmentForm({...state});
    }

    return <Fragment>
        <div className='heading'><h2>Rate an Appointment</h2></div>
        <form className={`${classes.root} rate-appointment-form`}>
            <FormControl className={classes.formControl}>
                <FormLabel>Comments</FormLabel>
                <TextField id='comments'
                           name='comments'
                           onChange={handleInputChange}
                />
            </FormControl>
            <FormControl className={classes.formControl}>
                <Typography className={classes.boldText}>
                    Rate this movie:
                </Typography>
                <div className="star-container">
                    {[...Array(+numberOfStars).keys()].map(n => {
                        return (
                            <StarIcon
                                key={`star-${n}`}
                                id={`star-${n}`}
                                onClick={onRatingClick}
                                className={stars[n] === true ? 'star-selected': 'star-icon'}
                            ></StarIcon>
                        );
                    })}
                </div>
                <FormHelperText id='rating-error'>Select a rating</FormHelperText>
            </FormControl>
            <Button variant="contained" color="primary"
                    onClick={handleRateAppointment}>RATE APPOINTMENT</Button>
        </form>
    </Fragment>
}

export default RateAppointment;
