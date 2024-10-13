import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, Typography, MenuItem } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Grid } from '@mui/material';  


// const BE_API_ROOT = "http://localhost:8000"
const BE_API_ROOT = "https://web-production-962f9.up.railway.app"

const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const token = localStorage.getItem('authToken'); 

const CreateMember = () => {
    const [member, setMember] = useState({
        register_number: '',
        name: '',
        mobile: '',
        dob: '',
        father: '',
        house: '',
        area: '',
        blood_group:'',
    });

    const [houseNames, setHouseNames] = useState([]);
    const [areaNames, setAreaNames] = useState([]);
    
    const navigate = useNavigate();

    useEffect(() => {

        if (!token) {
            navigate('/');
            return; // Exit useEffect to prevent further execution
        }

        const fetchHouseNames = async () => {
            try {
                // const token = localStorage.getItem('authToken'); 
                const response = await axios.get(BE_API_ROOT+'/api/house-names/', {
                    headers: {
                        Authorization: `Bearer ${token}`,  
                    },
                });
                console.log(response)
                setHouseNames(response.data); 
            } catch (error) {
                console.error('Error fetching house names:', error.response.data);
                if (error.response.status === 401) { // Assuming 401 indicates token is invalid/expired
                    navigate('/');
                }
            }
        };


        const fetchAreaNames = async () => {
            try {
                // const token = localStorage.getItem('authToken'); 
                const response = await axios.get(BE_API_ROOT+'/api/areas/', {
                    headers: {
                        Authorization: `Bearer ${token}`,  
                    },
                });
                console.log(response)
                setAreaNames(response.data);  
            } catch (error) {
                console.error('Error fetching Area names:', error.response.data);
            }
        };
    
        fetchHouseNames();
        fetchAreaNames();
        
    }, []);
    

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setMember({
            ...member,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // const token = localStorage.getItem('authToken');
        console.log("mmeber details to post")
        console.log(member)
        try {
            const response = await axios.post(
                BE_API_ROOT+'/api/member/',
                member,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            console.log('Member created successfully', response.data);
            setMember({
                register_number: '',
                name: '',
                mobile: '',
                dob: '',
                father: '',
                house: '',
                area: '',
                blood_group:'',
            });
    
            navigate('/member');
        } catch (error) {
            console.error('Error creating member:', error);
        }
    };

    return (
        <Box sx={{ maxWidth: 600, mx: 'auto', mt: 5, p: 3, border: '1px solid #ddd', borderRadius: 2 }}>
            <Typography variant="h4" gutterBottom>
                Create Member
            </Typography>
            <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                   
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Register Number"
                            name="register_number"
                            value={member.register_number}
                            onChange={handleInputChange}
                            required
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Name"
                            name="name"
                            value={member.name}
                            onChange={handleInputChange}
                            required
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Phone"
                            name="mobile"
                            type="tel"
                            value={member.mobile}
                            onChange={handleInputChange}
                            required
                        />
                    </Grid>
                  


                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Date of Birth"
                        name="dob"
                        type="date"
                        value={member.dob}
                        onChange={handleInputChange}
                        InputLabelProps={{
                            shrink: true,
                         }}
                        required
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Father Name"
                            name="father"
                            value={member.father}
                            onChange={handleInputChange}
                            required
                        />
                    </Grid>

                    {/* HouseName Select Field */}
                    <Grid item xs={12}>
                        <TextField
                            select
                            fullWidth
                            label="House Name"
                            name="house"
                            value={member.house}
                            onChange={handleInputChange}
                            required
                        >
                            {houseNames.map((house) => (
                                <MenuItem key={house.id} value={house.id}>
                                    {house.name}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>

                    {/* Area Select Field */}
                    <Grid item xs={12}>
                        <TextField
                            select
                            fullWidth
                            label="Area"
                            name="area"
                            value={member.area}
                            onChange={handleInputChange}
                            required
                        >
                            {areaNames.map((area) => (
                                <MenuItem key={area.id} value={area.id}>
                                    {area.name}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>


                    <Grid item xs={12}>
                    <TextField
                        select
                        fullWidth
                        label="Blood Group"
                        name="blood_group"
                        value={member.blood_group}
                        onChange={handleInputChange}
                        
                        sx={{ mt: 2 }}  
                    >
                    {bloodGroups.map((group) => (
                    <MenuItem key={group} value={group}>
                    {group}
                    </MenuItem>
                     ))}
                    </TextField>
                    </Grid>

                    <Grid item xs={12}>
                        <Button type="submit" variant="contained" color="success" fullWidth>
                            Create Member
                        </Button>
                    </Grid>


                    <Grid item xs={12}>
                <Button variant="outlined" color="primary" onClick={() => navigate('/dpnd')} fullWidth>
                    Add Dependent
                </Button>
            </Grid>


                    
                </Grid>
            </form>
        </Box>
    );
};

export default CreateMember;
