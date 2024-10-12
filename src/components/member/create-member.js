import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, Typography, MenuItem } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Grid } from '@mui/material';  // Use this if your version expects this import


const BE_API_ROOT = "http://localhost:8000"

const CreateMember = () => {
    const [member, setMember] = useState({
        name: '',
        phone: '',
        dob: '',
        house_name: '',
        dependents: [{ name: '', dob: '', relationship: '' }],
    });

    const [houseNames, setHouseNames] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchHouseNames = async () => {
            try {
                const token = localStorage.getItem('authToken'); // Retrieve the JWT token from local storage
                const response = await axios.get(BE_API_ROOT+'/api/house-names/', {
                    headers: {
                        Authorization: `Bearer ${token}`,  // Attach the token in the Authorization header
                    },
                });
                console.log(response)
                setHouseNames(response.data);  // Assuming response.data contains the house names
            } catch (error) {
                console.error('Error fetching house names:', error.response.data);
            }
        };
    
        fetchHouseNames();
    }, []);
    

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setMember({
            ...member,
            [name]: value,
        });
    };

    const handleDependentChange = (index, e) => {
        const { name, value } = e.target;
        const newDependents = [...member.dependents];
        newDependents[index][name] = value;
        setMember({
            ...member,
            dependents: newDependents,
        });
    };

    const addDependent = () => {
        setMember({
            ...member,
            dependents: [...member.dependents, { name: '', dob: '', relationship: '' }],
        });
    };

    const removeDependent = (index) => {
        const newDependents = member.dependents.filter((_, i) => i !== index);
        setMember({
            ...member,
            dependents: newDependents,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('authToken');

        try {
            const response = await axios.post(
                'http://13.60.99.23/api/members/',
                member,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            console.log('Member created successfully', response.data);
            navigate('/members');
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
                            name="phone"
                            type="tel"
                            value={member.phone}
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

                    {/* HouseName Select Field */}
                    <Grid item xs={12}>
                        <TextField
                            select
                            fullWidth
                            label="House Name"
                            name="house_name"
                            value={member.house_name}
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

                    <Typography variant="h5" mt={3} mb={2}>
                        Dependents
                    </Typography>

                    {member.dependents.map((dependent, index) => (
                        <Box key={index} sx={{ mb: 2 }}>
                            <Typography variant="h6" gutterBottom>
                                Dependent {index + 1}
                            </Typography>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Name"
                                        name="name"
                                        value={dependent.name}
                                        onChange={(e) => handleDependentChange(index, e)}
                                        required
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Date of Birth"
                                        name="dob"
                                        type="date"
                                        value={dependent.dob}
                                        onChange={(e) => handleDependentChange(index, e)}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        required
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Relationship"
                                        name="relationship"
                                        value={dependent.relationship}
                                        onChange={(e) => handleDependentChange(index, e)}
                                        required
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <Button
                                        variant="outlined"
                                        color="error"
                                        onClick={() => removeDependent(index)}
                                    >
                                        Remove Dependent
                                    </Button>
                                </Grid>
                            </Grid>
                        </Box>
                    ))}

                    <Grid item xs={12}>
                        <Button variant="contained" color="primary" onClick={addDependent}>
                            Add Dependent
                        </Button>
                    </Grid>

                    <Grid item xs={12}>
                        <Button type="submit" variant="contained" color="success" fullWidth>
                            Create Member
                        </Button>
                    </Grid>
                </Grid>
            </form>
        </Box>
    );
};

export default CreateMember;
