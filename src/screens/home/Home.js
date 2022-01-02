import React from "react";
import Header from "../../common/header/Header";
import {TabPanel, a11yProps} from "../../common/tabPanel/TabPanel";
import {Box, Tab, Tabs} from "@material-ui/core";
import DoctorList from "../doctorList/DoctorList";
import Appointment from "../appointment/Appointment"

/**
 * This component displays the Header component on top with DoctorList and Appointment Components in tabs
 * @param baseUrl
 * @param accessToken
 * @param setAccessToken
 * @param loggedInUserId
 * @param setLoggedInUserId
 * @returns {JSX.Element}
 * @constructor
 */
const Home = ({baseUrl, accessToken, setAccessToken, loggedInUserId, setLoggedInUserId}) => {
    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return <React.Fragment>
        <Header baseUrl={baseUrl} accessToken={accessToken} setAccessToken={setAccessToken}
                loggedInUserId={loggedInUserId} setLoggedInUserId={setLoggedInUserId} />
        <div className="home-container">
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={value} onChange={handleChange} aria-label="basic tabs example" indicatorColor="primary"
                      variant="fullWidth">
                    <Tab label="DOCTORS" {...a11yProps(0)} />
                    <Tab label="APPOINTMENT" {...a11yProps(1)} />
                </Tabs>
            </Box>
            <TabPanel value={value} index={0}>
                <DoctorList baseUrl={baseUrl} accessToken={accessToken} loggedInUserId={loggedInUserId}/>
            </TabPanel>
            <TabPanel value={value} index={1}>
                <Appointment baseUrl={baseUrl} accessToken={accessToken} loggedInUserId={loggedInUserId}/>
            </TabPanel>
        </div>
    </React.Fragment>;
}

export default Home;
