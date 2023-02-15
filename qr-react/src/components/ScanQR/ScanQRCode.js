import React, { useState } from 'react';
import { QrReader } from 'react-qr-reader';
import { Stack, Button, Typography, Container } from '@mui/material';


export default function ScanQRCode({getQR}) {

    const [data, setData] = useState('No result');

  return (
    <>
    <Container>
      <QrReader
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
      />
      <Typography>Place QR Code close to the camera.</Typography>
      </Container>
    </>
  )
}
