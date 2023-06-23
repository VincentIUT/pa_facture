import { useState, useEffect } from 'react';
import { Button, Paper, TextField, ToggleButtonGroup, ToggleButton, Modal, Box } from '@mui/material';
import './App.css';
import {useDropzone} from 'react-dropzone';
import api from "./api"
import ClockLoader from "react-spinners/ClockLoader";


function App() {
  const {acceptedFiles, getRootProps, getInputProps} = useDropzone();
  const [imgData, setImgData] = useState<any>();
  const [invoiceType, setInvoiceType] = useState<"incoming"|"outgoing">("incoming");
  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [number, setNumber] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [ht, setHT] = useState<string>("");
  const [tva, setTVA] = useState<string>("");
  const [ttc, setTTC] = useState<string>("");
  const [classe, setClasse] = useState<string>("");
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
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        setImgData(reader.result);
        sendFile(reader.result);
      });
      reader.readAsDataURL(acceptedFiles[0]);
    }
  }, [acceptedFiles]);

  //requete Axios
  const sendFile = async (fileResult:any) => {
    const bodyFormData = new FormData();
    bodyFormData.append('facture', acceptedFiles[0]);
    setLoading(true)
    const response = await api.post("main", bodyFormData)
    setLoading(false)
    if (response.data?.results) {
      setNumber(response.data.results.NUM)
      setDate(response.data.results.DATE)
      setAddress(response.data.results.ADRESSE)
      setHT(response.data.results.HT)
      setTVA(response.data.results.TVA)
      setTTC(response.data.results.TTC)
      setClasse(response.data.results.classe)
    }
  } 
  

  const handleSave = async (formResult: any) => {
    const requestData = {
      DATE: date,
      ADRESSE: address,
      NUM: number,
      HT: ht,
      TVA: tva,
      TTC: ttc,
      classe: classe,
      TYPE: invoiceType
    };
  
    try {
      const response = await api.post("save", requestData);
      console.log(response.data); // Log the response data if needed
      // Handle the response as desired
    } catch (error) {
      console.error("Save error:", error);
      // Handle the error as desired
    }
  };

  const handleDownload = async () => {
    try {
      const response = await api.get("download", { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'data.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Download error:", error);
    }
  }
  
  

  function handleChangeType(
    event: React.MouseEvent<HTMLElement>,
    newInvoiceType: "incoming"|"outgoing",
  ) {
      setInvoiceType(newInvoiceType);
    };


  

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

        {loading ? <ClockLoader
        color={"#29b6f6"}
        loading={loading}
        size={80}
        aria-label="Loading Spinner"
        data-testid="loader"
      /> : <div className="loading-div" /> }

        <Paper elevation={3} className='paper'>
          
          <TextField id="number" value={number} onChange={event => setNumber(event.target.value)} label="Invoice number" variant="outlined" />
          <TextField id="date" value={date} onChange={event => setDate(event.target.value)} label="Date" variant="outlined" />
          <TextField id="address" value={address} onChange={event => setAddress(event.target.value)} label="Address" variant="outlined" />
          <TextField id="ht" value={ht} onChange={event => setHT(event.target.value)} label="Total HT" variant="outlined" />
          <TextField id="tva" value={tva} onChange={event => setTVA(event.target.value)} label="Total TVA" variant="outlined" />
          <TextField id="ttc" value={ttc} onChange={event => setTTC(event.target.value)} label="Total TTC" variant="outlined" />
          <TextField id="classe" value={classe} onChange={event => setClasse(event.target.value)} label="Classe" variant="outlined" />

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
        <Button variant="contained" className='downloadButton' onClick={handleDownload}>Download csv</Button>
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
