import React from "react";
import Header from "../../common/header/Header";
import {TabPanel, a11yProps} from "../../common/tabPanel/TabPanel";
import {Box, Tab, Tabs} from "@material-ui/core";
import DoctorList from "../doctorList/DoctorList";

const Home = ({baseUrl}) => {
    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return <React.Fragment>
        <Header baseUrl={baseUrl} />
        <div className="home-container">
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={value} onChange={handleChange} aria-label="basic tabs example" indicatorColor="primary"
                      variant="fullWidth">
                    <Tab label="DOCTORS" {...a11yProps(0)} />
                    <Tab label="APPOINTMENT" {...a11yProps(1)} />
                </Tabs>
            </Box>
            <TabPanel value={value} index={0}>
                <DoctorList baseUrl={baseUrl} />
            </TabPanel>
            <TabPanel value={value} index={1}>
                Item two
            </TabPanel>
        </div>
    </React.Fragment>;
}

export default Home;
