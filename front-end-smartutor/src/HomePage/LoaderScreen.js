import CircularProgress from '@mui/material/CircularProgress';
const LoaderScreen = ({mesg}) => {
  return (
    <>
     <div style={{display:'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
     <p >{mesg}</p>
       <CircularProgress style={{marginLeft:'5%'}} />
    
     </div>
    </>
  );
};
export default LoaderScreen;
