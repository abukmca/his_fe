import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, Typography, MenuItem, Autocomplete } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Grid } from '@mui/material';  // Use this if your version expects this import

const BE_API_ROOT = "http://localhost:8000";
const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const relationshipChoices = [
    { value: "SPOUSE", label: "Spouse" },
    { value: "SON", label: "Son" },
    { value: "DAUGHTER", label: "Daughter" },
    { value: "DAUGHTER_IN_LAW", label: "Daughter-in-law" }
];

const CreateDependent = () => {
    const [dependent, setDependent] = useState({
        name: '',
        mobile: '',
        dob: '',
        blood_group: '',
        father: '',
        relationship: '',
        parent: ''
    });

    const [members, setMembers] = useState([]);  // For the member search
    const navigate = useNavigate();

    useEffect(() => {
        const fetchMembers = async () => {
            try {
                const token = localStorage.getItem('authToken');  // Retrieve the JWT token from local storage
                const response = await axios.get(BE_API_ROOT + '/api/member/', {
                    headers: {
                        Authorization: `Bearer ${token}`,  // Attach the token in the Authorization header
                    },
                });
                setMembers(response.data);  // Assuming response.data contains the member data
            } catch (error) {
                console.error('Error fetching members:', error.response.data);
            }
        };

        fetchMembers();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setDependent({
            ...dependent,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('authToken');
        try {
            const response = await axios.post(
                BE_API_ROOT + '/api/dpnd/',
                dependent,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            console.log('Dependent created successfully', response.data);
            setDependent({
                name: '',
                mobile: '',
                dob: '',
                blood_group: '',
                father: '',
                relationship: '',
                parent: ''
            });

            navigate('/dpnd');
        } catch (error) {
            console.error('Error creating dependent:', error);
        }
    };

    return (
        <Box sx={{ maxWidth: 600, mx: 'auto', mt: 5, p: 3, border: '1px solid #ddd', borderRadius: 2 }}>
            <Typography variant="h4" gutterBottom>
                Add Dependent
            </Typography>
            <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                    {/* Member Search and Select */}
                    <Grid item xs={12}>
                        <Autocomplete
                            options={members}
                            getOptionLabel={(option) => option.register_number}
                            onChange={(event, value) => {
                                setDependent({ 
                                    ...dependent, 
                                    parent: value ? value.register_number : ''  // Use registration number as parent
                                });
                            }}
                            renderInput={(params) => (
                                <TextField {...params} label="Search Member (Parent)" variant="outlined" fullWidth />
                            )}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Name"
                            name="name"
                            value={dependent.name}
                            onChange={handleInputChange}
                            required
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Mobile"
                            name="mobile"
                            type="tel"
                            value={dependent.mobile}
                            onChange={handleInputChange}
                            required
                        />
                    </Grid>

                    {/* Father and Relationship Fields */}
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Father"
                            name="father"
                            value={dependent.father}
                            onChange={handleInputChange}
                            required
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            select
                            fullWidth
                            label="Relationship"
                            name="relationship"
                            value={dependent.relationship}
                            onChange={handleInputChange}
                            required
                        >
                            {relationshipChoices.map((choice) => (
                                <MenuItem key={choice.value} value={choice.value}>
                                    {choice.label}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Date of Birth"
                            name="dob"
                            type="date"
                            value={dependent.dob}
                            onChange={handleInputChange}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            required
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            select
                            fullWidth
                            label="Blood Group"
                            name="blood_group"
                            value={dependent.blood_group}
                            onChange={handleInputChange}
                            required
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
                            Add Dependent
                        </Button>
                    </Grid>
                </Grid>
            </form>
        </Box>
    );
};

export default CreateDependent;
