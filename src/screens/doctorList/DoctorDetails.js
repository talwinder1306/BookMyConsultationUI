import React, {Fragment} from 'react';
import {Typography} from "@material-ui/core";
import StarIcon from "@material-ui/icons/Star";
import {makeStyles} from "@material-ui/core/styles";

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

const DoctorDetails = ({baseUrl, doctorId, doctorDetails, accessToken, closeModal, loggedInUserId}) => {
    const numberOfStars = 5;
    const classes = useModalStyles();

    return <Fragment>
        <div className='heading'><h2>Doctor Details</h2></div>
        <form name='view-details-form' className={classes.root}>
        <Typography variant="h5" component="h3">
            Dr: {doctorDetails.doctorName}
        </Typography>
        <Typography variant="body1" component="p">
            Total Experience: {doctorDetails.totalYearsOfExp}
        </Typography>
        <Typography variant="body1" component="p">
            Speciality: {doctorDetails.speciality}
        </Typography>
        <Typography variant="body1" component="p">
            Date of Birth: {doctorDetails.dob}
        </Typography>
        <Typography variant="body1" component="p">
            City: {doctorDetails.city}
        </Typography>
        <Typography variant="body1" component="p">
            Email: {doctorDetails.emailId}
        </Typography>
        <Typography variant="body1" component="p">
            Mobile: {doctorDetails.mobile}
        </Typography>
        <Typography variant="body1" component="p">
            Rating: {[...Array(+numberOfStars).keys()].map(n => {
            return (
                <StarIcon
                    key={`star-${n}`}
                    id={`star-${n}`}
                    className={(n < doctorDetails.rating) ? 'star-selected' : 'star-icon'}
                ></StarIcon>
            );
        })}
        </Typography>
        </form>
    </Fragment>
}

export default DoctorDetails;
