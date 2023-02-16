import React, { useState } from 'react';
import QrReader from 'react-qr-scanner';
import { Stack, Button, Typography, Container } from '@mui/material';


export default function ScanQRCode({getQR}) {

    const [scan, setScan] = useState({
      delay: 900,
      result: 'No result'
    });


    const handleScan = (data) => {
      console.log(data?.text)
      if(data?.text?.length > 8) {
        getQR(data?.text)
      }
      
    };

    const handleError = (err) => {
      console.log(err)
    };

  return (
    <>
    <Container>
    <QrReader
          delay={scan.delay}
          style={{width: '100%'}}
          onError={(err) => handleError(err)}
          onScan={(data) => handleScan(data)}
          />
        <p>{scan.result}</p>
      {/* <QrReader
        onResult={(result, error) => {
          if (!!result) {
            setData(result?.text);
            getQR(result?.text)
          }

          if (!!error) {
            console.info(error);
          }
        }}
        style={{ width: '100%' }}
      /> */}
      <Typography>Place QR Code close to the camera.</Typography>
      </Container>
    </>
  )
}
