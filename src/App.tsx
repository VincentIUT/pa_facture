import { useState, useEffect } from 'react';
import { Button, List, ListItem, ListItemIcon, ListItemText, Paper, TextField, ToggleButtonGroup, ToggleButton, Modal, Box } from '@mui/material';
import { lightBlue } from '@mui/material/colors';
import './App.css';
import {useDropzone} from 'react-dropzone';


function App() {
  const {acceptedFiles, getRootProps, getInputProps} = useDropzone();
  const [picture, setPicture] = useState<File>();
  const [imgData, setImgData] = useState<any>();
  const [invoiceType, setInvoiceType] = useState<"incoming"|"outgoing">("incoming");
  const [open, setOpen] = useState<boolean>(false);
  const files = acceptedFiles.map(file => (
    // @ts-ignore
    <li key={file.path}>
    {/* @ts-ignore */}
      {file.path} - {file.size} bytes
    </li>
  ));

  useEffect(() => {
    if (acceptedFiles[0]) {
      console.log("picture: ", acceptedFiles);
      setPicture(acceptedFiles[0]);
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        setImgData(reader.result);
      });
      reader.readAsDataURL(acceptedFiles[0]);
    }
  }, [acceptedFiles]);

  function handleChangeType(
    event: React.MouseEvent<HTMLElement>,
    newInvoiceType: "incoming"|"outgoing",
  ) {
      setInvoiceType(newInvoiceType);
    };

  function handleSave(){
    console.log(invoiceType) //mettre les data sauvegardées
  }
  

  const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    pt: 2,
    px: 4,
    pb: 3,
  };

  return (
    <div className="App">
      <section className="container">
        <div {...getRootProps({className: 'dropzone'})} className='dropzone-container'>
          <input {...getInputProps()} />
          <p>Drag 'n' drop some files here, or click to select files</p>
        </div>
        <aside className='fileName-container'>
          {files.length ? <span>{files}</span> : <div className='empty-file'></div>}
        </aside>
      </section>

      <section className='img-container'>
        <img src={imgData} className='invoice-preview' onClick={()=>setOpen(true)} />
        <Paper elevation={3} className='paper'>
          
          <TextField id="outlined-basic" label="Invoice number" variant="outlined" />
          <TextField id="outlined-basic" label="Date" variant="outlined" />
          <TextField id="outlined-basic" label="Address" variant="outlined" />
          <TextField id="outlined-basic" label="Total HT" variant="outlined" />
          <TextField id="outlined-basic" label="Total TVA" variant="outlined" />
          <TextField id="outlined-basic" label="Total TTC" variant="outlined" />

        </Paper>
      </section>

      <section className='actions'>
        <div></div>
        <div>
          <p>Invoice Type :</p>
          <ToggleButtonGroup
            color="primary"
            value={invoiceType}
            exclusive
            onChange={handleChangeType}
            aria-label="Platform"
          >
            <ToggleButton value="incoming">Incoming</ToggleButton>
            <ToggleButton value="outgoing">Outgoing</ToggleButton>
        
          </ToggleButtonGroup>
        </div>
        <Button variant="contained" className='saveButton' onClick={handleSave}>Save</Button>
      </section>
      
      <Modal
        open={open}
        onClose={()=>setOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        className='modal'
      ><Box sx={style}><img src={imgData} className='invoice-zoom' onClick={()=>setOpen(false)} /></Box></Modal>

    </div>
  );
}

export default App;
