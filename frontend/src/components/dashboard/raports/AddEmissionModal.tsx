import { Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button, Box, Typography, Switch, Select, MenuItem, ListItemText, InputLabel, FormHelperText, FormControl, Alert, Snackbar, Stack } from '@mui/material';
import { FormikHelpers, useFormik } from 'formik';
import { Emission, Factor } from '../../../interfaces/interfaces';
import { useEffect, useState } from 'react';
import { endPoints } from '../../../endPoints/endPoints';
import { emissionvalidationSchema } from './emissionValidationSchema';
import { storageGetToken } from '../../../storage/localStorage';


interface Props {
  open: boolean;
  onClose: () => void;
}

interface FormValues {
    title: string;
    value: number;
    units: string;
    factor: string;
    startDate: string;
    endDate: string;
  }

const AddEmissionModal: React.FC<Props> = ({ open, onClose}) => {
   
    const [language, setLanguage] = useState(navigator.language.split('-')[0]);
    const [unitsList, setUnits] = useState([]);
    const [conversionTable, setConversionTable] = useState(null);
    const [factors, setFactors] = useState([]);

    
      
      const handleClose = () => {
        resetForm(); 
        onClose(); 
      };

    
    const onSubmit = async (values:FormValues, actions:FormikHelpers<FormValues>) => {
       
         const newEmission:Emission = {
          id: Math.random(),
          title: values.title,
          value:values.value,
          units:values.units,
          factor:values.factor,
          startDate:values.startDate,
          endDate:values.endDate,
          totalEmission: 0
         }
         
         const factor = factors.find(f=>f._id === newEmission.factor);
         if(newEmission.units === factor.units){
          newEmission.totalEmission = newEmission.value * factor.value;
          
         }
         else{
          newEmission.totalEmission = newEmission.value * conversionTable[newEmission.units][factor.units];
         }
         
         handleClose();
        
      };

    const initialValues = {
        title: '',
        value: 0,
        units: '',
        factor: '',
        startDate: '',
        endDate: ''
    };
    
    useEffect(()=> {
        const fetchUnits = async () => {
          const response = await fetch(endPoints.getUnits + `?lang=${language}`)
          const data = await response.json();
          
          setUnits(data.units);
          setConversionTable(data.conversionMap);
          localStorage.setItem('unitsList', JSON.stringify(data.units));
          localStorage.setItem('conversionTable', JSON.stringify(data.conversionMap));
        }

        const fetchEmissionFactors = async () => {
          const token = storageGetToken();
          try {
          const response = await fetch(`${endPoints.getEmissionFactors}`, {
            headers: {
              Authorization: "Bearer "+token
            }
          });
          const data = await response.json();
          setFactors(data)
          localStorage.setItem('factors', JSON.stringify(data));
            

        } catch (error) {
          //TODO proper error handler
          console.error(error);
        }
          
      }

        
    
        fetchUnits();
        fetchEmissionFactors();
        

        //clean up
        return () => {
          localStorage.removeItem('factors');
          localStorage.removeItem('unitsList');
          localStorage.removeItem('conversionTable');
        };
    
      }, [language])

      


    const {values, errors, touched, handleBlur, handleChange, isSubmitting, handleSubmit, resetForm} = useFormik({
      initialValues: initialValues,
      validationSchema : emissionvalidationSchema,
      onSubmit
    });

  return (
    
    <Dialog
    open={open}
    onClose={handleClose}
    sx={{
      '& .MuiDialog-paper': {
        width: '80%',
        maxWidth: '800px', // Adjust the maxWidth as needed
      },
    }}
  >
    <DialogTitle sx={{ paddingBottom: 0, paddingTop: 2 }}>Dodaj nową emisję</DialogTitle>
    <form onSubmit={handleSubmit}>
      <DialogContent sx={{ paddingTop: 0 }}>
        <Box display="flex" flexWrap="wrap" gap={2}>
          <TextField
            sx={{ flex: '1 1 120px', minWidth: '120px' }}
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="title"
            label="tytuł"
            name="title"
            autoComplete="title"
            value={values.title}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.title && Boolean(errors.title)}
            helperText={touched.title && errors.title}
          />

          <TextField
            sx={{ flex: '1 1 120px', minWidth: '120px' }}
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="value"
            label="wartość"
            name="value"
            autoComplete="value"
            value={values.value}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.value && Boolean(errors.value)}
            helperText={touched.value && errors.value}
          />

          <FormControl sx={{ marginLeft: 1, marginTop: 2, minWidth: 120, flex: '1 1 auto' }}>
            <InputLabel id="units-label">miara</InputLabel>
            <Select
              labelId="units-label"
              required
              id="units"
              name="units"
              value={values.units}
              label="units"
              onChange={handleChange}
              onBlur={handleBlur}
              sx={{
                height: 56,
                '& .MuiSelect-select': {
                  paddingTop: '5px',
                  paddingBottom: '5px'
                }
              }}
            >
              {unitsList.map((unit: any) => (
                <MenuItem key={unit.id} value={unit.id}>
                  <ListItemText primary={unit.name} />
                </MenuItem>
              ))}
            </Select>
            <FormHelperText>{touched.units && errors.units}</FormHelperText>
          </FormControl>

          <FormControl sx={{ marginLeft: 1, marginTop: 2, minWidth: 300, flex: '1 1 auto' }} error={touched.factor && Boolean(errors.factor)}>
            <InputLabel id="factor-label">Wskaźnik</InputLabel>
            <Select
              labelId="factor-label"
              required
              id="factor"
              name="factor"
              value={values.factor}
              label="factor"
              onChange={handleChange}
              onBlur={handleBlur}
              sx={{
                height: 56,
                '& .MuiSelect-select': {
                  paddingTop: '5px',
                  paddingBottom: '5px'
                }
              }}
            >
              {factors.map((factor: Factor) => (
                <MenuItem key={factor._id} value={factor._id}>
                  <ListItemText primary={factor.name} />
                </MenuItem>
              ))}
            </Select>
            <FormHelperText>{touched.factor && errors.factor}</FormHelperText>
          </FormControl>
        </Box>

        <Box display="flex" mt={2} justifyContent="center" gap={2} flexWrap="wrap">
          <TextField
            variant="outlined"
            margin="normal"
            required
            id="startDate"
            label="Data rozpoczęcia"
            type="date"
            name="startDate"
            InputLabelProps={{
              shrink: true,
            }}
            value={values.startDate}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.startDate && Boolean(errors.startDate)}
            helperText={touched.startDate && errors.startDate}
          />

          <TextField
            variant="outlined"
            margin="normal"
            required
            id="endDate"
            label="Data zakończenia"
            type="date"
            name="endDate"
            InputLabelProps={{
              shrink: true,
            }}
            value={values.endDate}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.endDate && Boolean(errors.endDate)}
            helperText={touched.endDate && errors.endDate}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Box display="flex" flexDirection="row" sx={{ marginBottom: '10px' }}>
          <Button variant="text" sx={{ marginRight: '20px' }} onClick={handleClose}>Cancel</Button>
          <Button variant="outlined" sx={{ marginRight: '20px' }} type="submit">Add</Button>
        </Box>
      </DialogActions>
    </form>
  </Dialog>
    
  );
};

export default AddEmissionModal;
